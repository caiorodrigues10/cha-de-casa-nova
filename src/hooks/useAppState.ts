import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { User, Gift, Presenca, EventConfig } from '../../types';
import {
  INITIAL_GIFTS,
  DEFAULT_CONFIG,
  USER_STORAGE_KEY,
  ADMIN_STORAGE_KEY,
  ADMIN_JWT_KEY,
} from '../../constants';
import { TabType } from '../components/layout/AppHeader';
import {
  listarGifts,
  adicionarGift,
  editarGift,
  removerGift,
  reservarGift,
  cancelarReserva,
  listarPresencas,
  confirmarPresenca,
  getConfig,
  salvarConfig as salvarConfigAPI,
  getUserByPhone
} from '../services/api';

// ---------------------------------------------------------------------------
// JWT helpers (sem verificação de assinatura — responsabilidade do back-end)
// ---------------------------------------------------------------------------

interface JwtPayload {
  role?: string;
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // base64url → base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function isValidAdminJwt(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  // Verifica expiração se o claim existir
  if (payload.exp !== undefined) {
    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec >= payload.exp) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------

export function useAppState() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminJwt, setAdminJwt] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('evento');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [confirmacoes, setConfirmacoes] = useState<Presenca[]>([]);
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Initial Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [giftsData, configData] = await Promise.all([
        listarGifts(),
        getConfig()
      ]);
      setGifts(giftsData);
      setConfig(configData);
    } catch (err: any) {
      console.error('Failed to load initial data', err);
      setError(err.message || 'Erro ao carregar dados do servidor.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPresencas = useCallback(async (jwt: string) => {
    try {
      const p = await listarPresencas(jwt);
      setConfirmacoes(p);
    } catch (err) {
      console.error('Error loading presences', err);
    }
  }, []);

  // Persistence and Auth
  useEffect(() => {
    loadData();

    // Load user from Cookie instead of LocalStorage
    const savedUserCookie = Cookies.get(USER_STORAGE_KEY);
    if (savedUserCookie) {
      try {
        const parsedUser = JSON.parse(savedUserCookie);
        setUser(parsedUser);

        // Simular o carregamento da presença no app state para o UX do usuário comum
        const localP = localStorage.getItem(`presen_${parsedUser.phone}`);
        if (localP) {
          try {
            const p = JSON.parse(localP);
            setConfirmacoes(prev => prev.find(c => c.phone === p.phone) ? prev : [...prev, p]);
          } catch(e) {}
        }

        // Refresh from DB transparently
        getUserByPhone(parsedUser.phone).then(updated => {
          if (updated) {
             setUser(updated);
             Cookies.set(USER_STORAGE_KEY, JSON.stringify(updated), { expires: 30 });
          } else {
             setUser(null);
             Cookies.remove(USER_STORAGE_KEY);
          }
        }).catch(() => {});
      } catch (e) {
        Cookies.remove(USER_STORAGE_KEY);
      }
    }

    // Restaura sessão admin pelo JWT persistido
    const savedJwt = localStorage.getItem(ADMIN_JWT_KEY);
    if (savedJwt && isValidAdminJwt(savedJwt)) {
      setIsAdmin(true);
      setAdminJwt(savedJwt);
      loadPresencas(savedJwt);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } else if (savedJwt) {
      localStorage.removeItem(ADMIN_JWT_KEY);
    }

    // Suporte a token via URL: ?admin=JWT
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('admin');
    if (urlToken && isValidAdminJwt(urlToken)) {
      setIsAdmin(true);
      setAdminJwt(urlToken);
      localStorage.setItem(ADMIN_JWT_KEY, urlToken);
      loadPresencas(urlToken);
    }
    if (urlToken) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Suporte a rota /admin
    if (window.location.pathname === '/admin') {
      window.history.replaceState({}, '', '/');
      if (!savedJwt || !isValidAdminJwt(savedJwt)) {
        setShowAdminLogin(true);
      } else {
        setActiveTab('admin');
      }
    }
  }, [loadData, loadPresencas]);

  const handleReserve = async (id: string) => {
    if (!user) return;
    try {
      const reservedGift = await reservarGift(id, user.name);
      setGifts(gifts.map(g => g.id === id ? reservedGift : g));
      toast.success('Presente escolhido com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao reservar o presente');
    }
  };

  const handleCancelReserve = async (id: string) => {
    try {
      const canceledGift = await cancelarReserva(id);
      setGifts(gifts.map(g => g.id === id ? canceledGift : g));
      toast.success('Reserva cancelada com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cancelar a reserva');
    }
  };

  const onAddGift = async (data: any, uploadedImage: string | null) => {
    if (!adminJwt) return;
    const finalImageUrl = uploadedImage || data.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`;

    try {
      const addPayload = {
        name: data.name,
        description: data.description,
        imageUrl: finalImageUrl,
        link: data.link,
      };

      const newGift = await adicionarGift(addPayload, adminJwt);
      setGifts(prev => [...prev, newGift]);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar presente');
    }
  };

  const onEditGift = async (id: string, data: any, uploadedImage: string | null) => {
    if (!adminJwt) return;
    // se não enviou imagem nova, mantém a atual mandando `undefined` no payload
    const editPayload: any = {
      name: data.name,
      description: data.description,
      link: data.link,
    };
    if (uploadedImage) {
      editPayload.imageUrl = uploadedImage;
    } else if (data.imageUrl) {
      editPayload.imageUrl = data.imageUrl;
    }

    try {
      const updatedGift = await editarGift(id, editPayload, adminJwt);
      setGifts(prev => prev.map(g => g.id === id ? updatedGift : g));
      toast.success('Presente atualizado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar presente');
    }
  };

  const handleRemoveGift = async (id: string) => {
    if (!adminJwt) return;
    try {
      await removerGift(id, adminJwt);
      setGifts(prev => prev.filter(g => g.id !== id));
    } catch (err: any) {
       toast.error(err.message || 'Erro ao deletar o presente');
    }
  };

  const onConfirmPresenca = async (data: any) => {
    if (!user) return;
    const adults = Number(data.adults) || 0;
    const children = Number(data.children) || 0;

    try {
      const rx = await confirmarPresenca({
         name: user.name,
         phone: user.phone,
         attending: data.attending,
         adultsCount: adults,
         childrenCount: children
      });

      // Atualiza estado local imediatamente para feedback visual na mesma sessão
      setConfirmacoes(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.phone === rx.phone);
        if (idx !== -1) copy[idx] = rx;
        else copy.push(rx);
        return copy;
      });

      // Salva no localStorage temporário para persistir entre reloads
      // simulando cache, pois o "GET" da API é só pra admins
      localStorage.setItem(`presen_${user.phone}`, JSON.stringify(rx));

      if (isAdmin && adminJwt) {
         loadPresencas(adminJwt);
      }
    } catch (err: any) {
       toast.error(err.message || 'Falha ao confirmar presença.');
    }
  };

  const onSaveConfig = async (data: any) => {
    if (!adminJwt) return;
    try {
      const updatedConfig = await salvarConfigAPI(data, adminJwt);
      setConfig(updatedConfig);
      toast.success('Configuração salva com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar configurações.');
    }
  };

  // Recebe JWT do back-end, valida claims no front e persiste sessão
  const handleAdminLogin = useCallback((jwt: string): boolean => {
    if (!isValidAdminJwt(jwt)) return false;

    // Limpa a sessão do usuário comum ao logar como admin
    Cookies.remove(USER_STORAGE_KEY);
    setUser(null);

    setIsAdmin(true);
    setAdminJwt(jwt);
    localStorage.setItem(ADMIN_JWT_KEY, jwt);
    loadPresencas(jwt);
    return true;
  }, [loadPresencas]);

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminJwt(null);
    localStorage.removeItem(ADMIN_JWT_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (activeTab === 'admin') setActiveTab('evento');
  };

  const handleLogout = () => {
    Cookies.remove(USER_STORAGE_KEY);
    setUser(null);
    window.location.reload();
  };

  const handleSaveUser = (u: User) => {
    setUser(u);
    Cookies.set(USER_STORAGE_KEY, JSON.stringify(u), { expires: 30 }); // 30 days
  };

  // Derived data
  const isReservaPast = new Date() > new Date(config.rsvpDeadline);
  const totalPessoas = confirmacoes.reduce((acc, c) => c.attending ? acc + c.guestsCount : acc, 0);
  const totalAdultos = confirmacoes.reduce((acc, c) => c.attending ? acc + c.adultsCount : acc, 0);
  const totalCriancas = confirmacoes.reduce((acc, c) => c.attending ? acc + c.childrenCount : acc, 0);
  const totalNaoVao = confirmacoes.filter(c => !c.attending).length;
  const userReserva = user ? confirmacoes.find(c => c.phone === user.phone) : null;
  const reservedGiftsCount = gifts.filter(g => g.isReserved).length;
  const myGifts = gifts.filter(g => g.isReserved && g.reservedBy === user?.name);
  const progressPercent = gifts.length > 0 ? Math.round((reservedGiftsCount / gifts.length) * 100) : 0;
  const selectedGift = gifts.find(g => g.id === selectedGiftId);

  return {
    // State
    user,
    isAdmin,
    adminJwt,
    showAdminLogin,
    setShowAdminLogin,
    activeTab,
    setActiveTab,
    selectedGiftId,
    setSelectedGiftId,
    gifts,
    confirmacoes,
    config,
    // Handlers
    handleReserve,
    handleCancelReserve,
    onAddGift,
    onEditGift,
    handleRemoveGift,
    onConfirmPresenca,
    onSaveConfig,
    handleAdminLogin,
    handleAdminLogout,
    handleLogout,
    handleSaveUser,
    // Derived
    isReservaPast,
    totalPessoas,
    totalAdultos,
    totalCriancas,
    totalNaoVao,
    userReserva,
    reservedGiftsCount,
    myGifts,
    progressPercent,
    selectedGift,
    isLoading,
    error,
  };
}
