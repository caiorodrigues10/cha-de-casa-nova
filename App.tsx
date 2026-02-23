
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Gift, Presenca, EventConfig } from './types';
import { 
  INITIAL_GIFTS, 
  DEFAULT_CONFIG, 
  USER_STORAGE_KEY, 
  ADMIN_STORAGE_KEY,
  GIFTS_STORAGE_KEY, 
  RSVP_STORAGE_KEY, 
  CONFIG_STORAGE_KEY,
  ADMIN_PASSWORD
} from './constants';

// --- Helpers & Schemas ---

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phone: z.string().regex(phoneRegex, 'Formato inválido: (00) 00000-0000'),
});

const presencaSchema = z.object({
  attending: z.boolean(),
  adults: z.number().min(1, 'Mínimo 1 adulto').max(10, 'Máximo 10 adultos'),
  children: z.number().min(0, 'Mínimo 0').max(10, 'Máximo 10 crianças'),
});

const configSchema = z.object({
  eventDate: z.string().min(1, 'Data é obrigatória'),
  eventTime: z.string().min(1, 'Hora é obrigatória'),
  rsvpDeadline: z.string().min(1, 'Prazo é obrigatório'),
  location: z.string().min(5, 'Endereço muito curto'),
  locationLink: z.string().url('Link inválido').optional().or(z.literal('')),
  googleCalendarLink: z.string().optional(),
});

const giftSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  description: z.string().min(5, 'Descrição muito curta'),
  imageUrl: z.string().optional().or(z.literal('')),
  link: z.string().url('Link da loja inválido').optional().or(z.literal('')),
});

const maskPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 3) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

// --- Sub-components ---

const ErrorMsg: React.FC<{ message?: string }> = ({ message }) => 
  message ? <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-wider">{message}</p> : null;

const TabButton: React.FC<{ label: string; mobileLabel?: string; active: boolean; onClick: () => void; icon?: React.ReactNode }> = ({ label, mobileLabel, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 md:gap-2 px-5 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex-shrink-0 ${
      active 
        ? 'border-[#B59A57] text-[#B59A57]' 
        : 'border-transparent text-[#A19A8E] hover:text-[#7A7165]'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{mobileLabel || label}</span>
  </button>
);

const Navbar: React.FC<{ 
  user: User | null; 
  isAdmin: boolean; 
  onLogout: () => void; 
  onAdminLoginClick: () => void;
  onAdminLogout: () => void;
}> = ({ user, isAdmin, onLogout, onAdminLoginClick, onAdminLogout }) => (
  <nav className="sticky top-0 z-50 bg-[#FAF9F2]/90 backdrop-blur-md border-b border-[#E8E1D1] px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-[#B59A57] rounded-lg flex items-center justify-center text-white font-serif italic shadow-sm">H</div>
      <h1 className="text-xl font-bold text-[#4A4238] tracking-tight hidden sm:block">Nosso Novo Lar</h1>
    </div>
    <div className="flex items-center gap-4">
      {user && !isAdmin && (
        <span className="hidden md:block text-[#A19A8E] text-[10px] font-bold uppercase tracking-wider">Olá, {user.name.split(' ')[0]}</span>
      )}
      
      {!isAdmin ? (
        <button 
          onClick={onAdminLoginClick}
          className="text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg font-bold transition bg-[#E8E1D1] text-[#7A7165] hover:bg-[#DED5C3]"
        >
          Acesso Admin
        </button>
      ) : (
        <button 
          onClick={onAdminLogout}
          className="text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg font-bold transition bg-[#B59A57] text-white hover:bg-[#A38948]"
        >
          Sair do Admin
        </button>
      )}

      {user && !isAdmin && (
        <button onClick={onLogout} className="text-[10px] font-bold text-[#C9A694] hover:text-[#A68574] uppercase tracking-widest">Sair</button>
      )}
    </div>
  </nav>
);

const AdminLoginModal: React.FC<{ 
  onLogin: (pass: string) => boolean; 
  onClose: () => void;
}> = ({ onLogin, onClose }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(pass)) {
      onClose();
    } else {
      setError(true);
      setPass('');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-[#FAF9F2] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[#E8E1D1] animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-[#E8E1D1] shadow-inner">🔒</div>
          <h2 className="text-2xl font-bold text-[#4A4238] serif">Acesso Restrito</h2>
          <p className="text-[#7A7165] text-[11px] uppercase tracking-widest mt-2">Área Administrativa</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <input 
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              autoFocus
              className={`w-full bg-white border ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-[#E8E1D1]'} rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238] text-center tracking-[0.5em] transition`}
              placeholder="••••••••"
            />
            {error && <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-widest mt-2">Senha incorreta</p>}
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-[#E8E1D1] text-[#7A7165] font-bold uppercase tracking-widest py-4 rounded-xl text-[10px] hover:bg-[#F2EADA] transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-2 bg-[#4A4238] text-white font-bold uppercase tracking-widest py-4 rounded-xl text-[10px] hover:bg-[#3C3633] transition shadow-lg px-8"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GiftCard: React.FC<{ 
  gift: Gift; 
  onReserve: (id: string) => void; 
  onCancel: (id: string) => void;
  isAdmin: boolean; 
  currentUser: User | null;
  onRemove?: (id: string) => void;
  onViewDetails: (id: string) => void;
}> = ({ gift, onReserve, onCancel, isAdmin, currentUser, onRemove, onViewDetails }) => {
  const isMine = currentUser && gift.reservedBy === currentUser.name;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E8E1D1] transition-all hover:shadow-md flex flex-col h-full group cursor-pointer relative" onClick={() => onViewDetails(gift.id)}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={gift.imageUrl || `https://picsum.photos/seed/${gift.id}/600/400`} 
          alt={gift.name} 
          className={`w-full h-full object-cover transition-all duration-700 ${!gift.isReserved ? 'group-hover:scale-110' : 'grayscale opacity-40 blur-[1px]'}`} 
        />
        
        {gift.isReserved && (
          <div className="absolute inset-0 bg-[#4A4238]/20 flex flex-col items-center justify-center p-4 text-center">
            <span className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transform transition-transform duration-500 scale-100 group-hover:scale-105 ${isMine ? 'bg-[#B59A57] text-white ring-2 ring-white/20' : 'bg-white text-[#4A4238] ring-1 ring-[#E8E1D1]'}`}>
              {isMine ? '✓ Você Escolheu' : `Reservado`}
            </span>
            {!isMine && gift.reservedBy && (
              <p className="mt-2 text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-md">Por {gift.reservedBy}</p>
            )}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`text-lg font-bold mb-1 transition-colors ${gift.isReserved ? 'text-[#A19A8E]' : 'text-[#4A4238]'}`}>{gift.name}</h3>
        <p className={`text-xs mb-6 flex-grow leading-relaxed line-clamp-2 transition-colors ${gift.isReserved ? 'text-[#C9C4BB]' : 'text-[#7A7165]'}`}>{gift.description}</p>
        
        <div className="mt-auto space-y-3" onClick={(e) => e.stopPropagation()}>
          {!gift.isReserved ? (
            <button 
              onClick={() => onReserve(gift.id)}
              className="w-full bg-[#4A4238] text-white text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-2xl hover:bg-[#3C3633] transition active:scale-95 shadow-lg shadow-stone-200"
            >
              Escolher Presente
            </button>
          ) : isMine ? (
            <button 
              onClick={() => onCancel(gift.id)}
              className="w-full text-[10px] text-[#A19A8E] hover:text-[#C9A694] font-bold uppercase tracking-widest transition py-2"
            >
              Cancelar Minha Escolha
            </button>
          ) : (
            <div className="py-2 text-center">
               <p className="text-[10px] text-[#C9C4BB] font-bold uppercase tracking-widest italic">Item indisponível</p>
            </div>
          )}
        </div>
        
        {isAdmin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove?.(gift.id); }}
            className="mt-4 w-full text-[9px] text-[#C9A694] hover:text-red-500 border border-[#F2EADA] rounded-xl py-1.5 transition"
          >
            Remover do Sistema
          </button>
        )}
      </div>
    </div>
  );
};

const GiftDetails: React.FC<{
  gift: Gift;
  currentUser: User | null;
  onReserve: (id: string) => void;
  onCancel: (id: string) => void;
  onBack: () => void;
}> = ({ gift, currentUser, onReserve, onCancel, onBack }) => {
  const isMine = currentUser && gift.reservedBy === currentUser.name;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-500 max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A19A8E] hover:text-[#4A4238] mb-8 transition-all group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Voltar para a lista
      </button>

      <div className="bg-white rounded-[3rem] overflow-hidden border border-[#E8E1D1] shadow-xl grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-square lg:aspect-auto relative overflow-hidden bg-[#FAF9F2]">
          <img 
            src={gift.imageUrl || `https://picsum.photos/seed/${gift.id}/800/800`} 
            alt={gift.name} 
            className={`w-full h-full object-cover transition-all duration-1000 ${gift.isReserved ? 'grayscale opacity-50 blur-[2px]' : ''}`} 
          />
          {gift.isReserved && (
             <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#4A4238]/10">
                <div className={`px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl ${isMine ? 'bg-[#B59A57] text-white ring-4 ring-white/30' : 'bg-white text-[#4A4238]'}`}>
                  {isMine ? '✓ Você já escolheu' : 'Reservado'}
                </div>
             </div>
          )}
        </div>
        <div className="p-10 md:p-16 flex flex-col">
          <div className="mb-10">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 serif leading-tight ${gift.isReserved ? 'text-[#A19A8E]' : 'text-[#4A4238]'}`}>{gift.name}</h2>
            <div className={`h-0.5 w-16 mb-8 ${gift.isReserved ? 'bg-[#C9C4BB]' : 'bg-[#B59A57]'}`}></div>
            <p className={`text-base leading-relaxed whitespace-pre-line ${gift.isReserved ? 'text-[#A19A8E]' : 'text-[#7A7165]'}`}>{gift.description}</p>
          </div>

          <div className="mt-auto space-y-6">
            {gift.link && (
              <div className="p-6 bg-[#FAF9F2] rounded-3xl border border-[#E8E1D1]">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59A57] mb-3">Sugestão de Compra</h4>
                <p className="text-[#7A7165] text-xs mb-4">Você pode encontrar este item clicando no botão abaixo:</p>
                <a 
                  href={gift.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white border border-[#E8E1D1] text-[#4A4238] px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-[#B59A57] transition shadow-sm"
                >
                  Ir para a Loja <span className="text-xs">↗</span>
                </a>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {!gift.isReserved ? (
                <button 
                  onClick={() => onReserve(gift.id)}
                  className="w-full bg-[#4A4238] text-white text-xs font-bold uppercase tracking-[0.3em] py-6 rounded-[2rem] hover:bg-[#3C3633] transition shadow-2xl active:scale-[0.98]"
                >
                  Desejo presentear com este item
                </button>
              ) : isMine ? (
                <button 
                  onClick={() => onCancel(gift.id)}
                  className="w-full border-2 border-[#C9A694] text-[#C9A694] text-xs font-bold uppercase tracking-[0.3em] py-6 rounded-[2rem] hover:bg-[#C9A694] hover:text-white transition active:scale-[0.98]"
                >
                  Cancelar Reserva
                </button>
              ) : (
                <div className="w-full bg-[#FAF9F2] text-[#A19A8E] text-xs font-bold uppercase tracking-[0.3em] py-6 rounded-[2rem] text-center border border-[#E8E1D1] italic">
                  Este item já foi reservado
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-[#A19A8E] text-center font-medium uppercase tracking-[0.2em]">Sua participação é o que mais importa para nós.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserAuthModal: React.FC<{ onSave: (u: User) => void }> = ({ onSave }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const phone = watch('phone');
  const [existingUserFound, setExistingUserFound] = useState<string | null>(null);

  // Check for existing user by phone (Unique ID)
  useEffect(() => {
    if (phone && phoneRegex.test(phone)) {
      const savedRSVPs = localStorage.getItem(RSVP_STORAGE_KEY);
      if (savedRSVPs) {
        const list: Presenca[] = JSON.parse(savedRSVPs);
        const match = list.find(r => r.phone === phone);
        if (match) {
          setExistingUserFound(match.name);
          // Set the name field automatically to the first name registered
          setValue('name', match.name);
        } else {
          setExistingUserFound(null);
        }
      }
    } else {
      setExistingUserFound(null);
    }
  }, [phone, setValue]);

  const onSubmit = (data: any) => {
    onSave({ ...data, isAdmin: false });
  };

  return (
    <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#FAF9F2] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-[#E8E1D1]">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-inner border border-[#E8E1D1]">🏠</div>
        <h2 className="text-4xl font-bold mb-3 text-[#4A4238] serif">Bem-vindos!</h2>
        <p className="text-[#7A7165] mb-10 text-sm leading-relaxed">Ficamos muito felizes em celebrar nossa nova casa com você. Como podemos te identificar?</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59A57] ml-1">Telefone / WhatsApp (ID Único)</label>
            <input 
              {...register('phone')}
              onChange={(e) => setValue('phone', maskPhone(e.target.value))}
              className="w-full bg-white border border-[#E8E1D1] rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238] transition shadow-sm font-mono text-sm"
              placeholder="(00) 00000-0000"
            />
            <ErrorMsg message={errors.phone?.message as string} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59A57] ml-1">
              {existingUserFound ? 'Seu Nome Registrado' : 'Seu Nome Completo'}
            </label>
            <input 
              {...register('name')}
              disabled={!!existingUserFound}
              className={`w-full bg-white border border-[#E8E1D1] rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238] transition shadow-sm ${existingUserFound ? 'opacity-70 bg-[#FAF9F2] cursor-not-allowed' : ''}`}
              placeholder="Ex: Maria Clara"
            />
            {existingUserFound && (
              <p className="text-[9px] text-[#B59A57] font-bold uppercase tracking-widest mt-2 ml-1">✓ Já conhecemos você, {existingUserFound.split(' ')[0]}!</p>
            )}
            <ErrorMsg message={errors.name?.message as string} />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4A4238] text-white font-bold uppercase tracking-[0.2em] py-6 rounded-2xl hover:bg-[#3C3633] transition shadow-xl shadow-[#4A4238]/10 mt-6 active:scale-95"
          >
            {existingUserFound ? 'Entrar' : 'Começar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

type TabType = 'evento' | 'presentes' | 'meus-selecionados' | 'admin';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('evento');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [confirmacoes, setConfirmacoes] = useState<Presenca[]>([]);
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG);
  const [showReservaPresencaForm, setShowReservaPresencaForm] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rsvpSectionRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin === 'true') setIsAdmin(true);

    const savedGifts = localStorage.getItem(GIFTS_STORAGE_KEY);
    setGifts(savedGifts ? JSON.parse(savedGifts) : INITIAL_GIFTS);

    const savedPresencas = localStorage.getItem(RSVP_STORAGE_KEY);
    setConfirmacoes(savedPresencas ? JSON.parse(savedPresencas) : []);

    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  // Form hooks for global data
  const { register: regPresenca, handleSubmit: subPresenca, watch: watchPresenca, formState: { errors: errPresenca } } = useForm({
    resolver: zodResolver(presencaSchema),
    defaultValues: { attending: true, adults: 1, children: 0 }
  });

  const { register: regConfig, handleSubmit: subConfig, formState: { errors: errConfig } } = useForm({
    resolver: zodResolver(configSchema),
    values: config
  });

  const { register: regGift, handleSubmit: subGift, reset: resGift, formState: { errors: errGift }, setValue: setGiftValue } = useForm({
    resolver: zodResolver(giftSchema)
  });

  const saveGifts = (updated: Gift[]) => {
    setGifts(updated);
    localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleReserve = (id: string) => {
    if (!user) return;
    const updated = gifts.map(g => g.id === id ? { ...g, isReserved: true, reservedBy: user.name } : g);
    saveGifts(updated);
  };

  const handleCancelReserve = (id: string) => {
    const updated = gifts.map(g => g.id === id ? { ...g, isReserved: false, reservedBy: undefined } : g);
    saveGifts(updated);
  };

  const onAddGift = (data: any) => {
    const finalImageUrl = uploadedImage || data.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`;
    
    const newGift: Gift = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      imageUrl: finalImageUrl,
      link: data.link,
      isReserved: false
    };
    saveGifts([...gifts, newGift]);
    resGift();
    setUploadedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGiftValue('imageUrl', '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGift = (id: string) => {
    const updated = gifts.filter(g => g.id !== id);
    saveGifts(updated);
  };

  const onConfirmReservaPresenca = (data: any) => {
    if (!user) return;
    const adults = Number(data.adults) || 0;
    const children = Number(data.children) || 0;

    const newPresenca: Presenca = {
      name: user.name,
      phone: user.phone,
      attending: data.attending,
      adultsCount: adults,
      childrenCount: children,
      guestsCount: adults + children,
      date: new Date().toISOString()
    };
    
    // Check by phone (ID único)
    const existingIndex = confirmacoes.findIndex(c => c.phone === user.phone);
    let updated;
    if (existingIndex > -1) {
      updated = [...confirmacoes];
      updated[existingIndex] = newPresenca;
    } else {
      updated = [...confirmacoes, newPresenca];
    }
    
    setConfirmacoes(updated);
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
    setShowReservaPresencaForm(false);
  };

  const onSaveConfig = (data: any) => {
    setConfig(data);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(data));
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (activeTab === 'admin') setActiveTab('evento');
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    window.location.reload();
  };

  const scrollToRSVP = () => {
    setShowReservaPresencaForm(true);
    setTimeout(() => {
      rsvpSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const isReservaPast = new Date() > new Date(config.rsvpDeadline);
  
  // New metrics breakdown
  const totalPessoas = confirmacoes.reduce((acc, c) => c.attending ? acc + c.guestsCount : acc, 0);
  const totalAdultos = confirmacoes.reduce((acc, c) => c.attending ? acc + c.adultsCount : acc, 0);
  const totalCriancas = confirmacoes.reduce((acc, c) => c.attending ? acc + c.childrenCount : acc, 0);
  
  const totalReservas = confirmacoes.length;
  const totalNaoVao = confirmacoes.filter(c => !c.attending).length;

  const userReserva = user ? confirmacoes.find(c => c.phone === user.phone) : null;

  const reservedGiftsCount = gifts.filter(g => g.isReserved).length;
  const myGifts = gifts.filter(g => g.isReserved && g.reservedBy === user?.name);
  const progressPercent = gifts.length > 0 ? Math.round((reservedGiftsCount / gifts.length) * 100) : 0;

  const selectedGift = gifts.find(g => g.id === selectedGiftId);

  return (
    <div className="min-h-screen bg-[#FAF9F2]">
      {!user && !isAdmin && <UserAuthModal onSave={(u) => { setUser(u); localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u)); }} />}
      
      {showAdminLogin && (
        <AdminLoginModal 
          onLogin={handleAdminLogin} 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}

      <Navbar 
        user={user} 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
        onAdminLoginClick={() => setShowAdminLogin(true)} 
        onAdminLogout={handleAdminLogout}
      />

      {!selectedGiftId && (
        <header className="bg-white border-b border-[#E8E1D1] pt-16 pb-8">
          <div className="max-w-5xl mx-auto text-center mb-12 px-6">
            <h2 className="text-5xl md:text-7xl font-bold text-[#4A4238] mb-6 serif tracking-tight">Nosso Novo Lar</h2>
            <p className="text-[#7A7165] max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Sua presença é o nosso maior presente. Criamos esta lista para compartilhar com vocês nossos planos para o novo lar.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-10 px-6">
             <div className="bg-[#FAF9F2] rounded-[2rem] p-8 border border-[#E8E1D1] shadow-inner relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 relative z-10">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] block mb-2">Conquista do Lar</span>
                  <h4 className="text-2xl font-bold text-[#4A4238]">{progressPercent}% dos itens preparados</h4>
                </div>
                <div className="text-[#A19A8E] text-xs font-bold uppercase tracking-widest">
                  {reservedGiftsCount} / {gifts.length} Presentes
                </div>
              </div>
              <div className="w-full bg-white h-5 rounded-full overflow-hidden border border-[#E8E1D1] p-1 shadow-sm">
                <div 
                  className="bg-[#B59A57] h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B59A57]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="max-w-5xl w-full flex overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex px-4 md:px-0 gap-1 w-full md:justify-start">
                <TabButton 
                  label="Evento & Reserva" 
                  mobileLabel="Evento"
                  active={activeTab === 'evento'} 
                  onClick={() => setActiveTab('evento')}
                  icon={<span className="text-sm">🏠</span>}
                />
                <TabButton 
                  label="Lista de Presentes" 
                  mobileLabel="Presentes"
                  active={activeTab === 'presentes'} 
                  onClick={() => setActiveTab('presentes')}
                  icon={<span className="text-sm">✨</span>}
                />
                {user && !isAdmin && (
                  <TabButton 
                    label={`Meus Escolhidos (${myGifts.length})`} 
                    mobileLabel={`Meus (${myGifts.length})`}
                    active={activeTab === 'meus-selecionados'} 
                    onClick={() => setActiveTab('meus-selecionados')}
                    icon={<span className="text-sm">🤍</span>}
                  />
                )}
                {isAdmin && (
                  <TabButton 
                    label="Painel Admin" 
                    mobileLabel="Admin"
                    active={activeTab === 'admin'} 
                    onClick={() => setActiveTab('admin')}
                    icon={<span className="text-sm">🛠️</span>}
                  />
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {selectedGift ? (
          <GiftDetails 
            gift={selectedGift} 
            currentUser={user} 
            onReserve={handleReserve} 
            onCancel={handleCancelReserve} 
            onBack={() => setSelectedGiftId(null)}
          />
        ) : (
          <>
            {activeTab === 'evento' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white rounded-[3rem] p-12 border border-[#E8E1D1] shadow-sm flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] mb-8 block">A Celebração</span>
                  <h3 className="text-4xl font-bold mb-10 text-[#4A4238] serif leading-tight">Cada detalhe <br/>foi pensado para você.</h3>
                  
                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="w-14 h-14 bg-[#FAF9F2] rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm border border-[#E8E1D1]">📅</div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#A19A8E] mb-1.5 tracking-widest">Data e Horário</span>
                        <p className="text-xl font-bold text-[#4A4238]">{new Date(config.eventDate).toLocaleDateString('pt-BR')} às {config.eventTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-14 h-14 bg-[#FAF9F2] rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm border border-[#E8E1D1]">📍</div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#A19A8E] mb-1.5 tracking-widest">Localização</span>
                        <div className="flex flex-col gap-2">
                          <p className="text-xl font-bold text-[#4A4238] leading-tight">{config.location}</p>
                          {config.locationLink && (
                            <a 
                              href={config.locationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-[#B59A57] uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                              Ver no Mapa <span>↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        onClick={scrollToRSVP}
                        className="inline-flex items-center justify-center gap-3 bg-[#B59A57] text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#A38948] transition shadow-lg active:scale-95 flex-1"
                      >
                        Confirmar Presença
                      </button>
                      <a 
                        href={config.googleCalendarLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-[#4A4238] text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3C3633] transition shadow-lg active:scale-95 flex-1"
                      >
                        Agendar no Calendário
                      </a>
                    </div>
                  </div>
                </div>

                <div ref={rsvpSectionRef} className="bg-[#4A4238] text-[#FAF9F2] rounded-[3.5rem] p-12 shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] mb-8 block relative z-10">Presença</span>
                  <h3 className="text-4xl font-bold mb-8 serif relative z-10">Vamos celebrar <br/>juntos?</h3>
                  
                  {isReservaPast ? (
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative z-10">
                      <p className="text-[#A19A8E] text-sm italic leading-relaxed">O período de reservas encerrou em {new Date(config.rsvpDeadline).toLocaleDateString('pt-BR')}. Caso precise falar conosco, entre em contato!</p>
                    </div>
                  ) : isAdmin ? (
                     <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative z-10">
                      <p className="text-[#A19A8E] text-sm italic leading-relaxed">Você está visualizando como Administrador. Troque para o perfil de visitante para confirmar presença.</p>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col justify-center relative z-10">
                      {!showReservaPresencaForm ? (
                        <>
                          {userReserva ? (
                            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59A57] block mb-2">Sua Reserva Atual</span>
                               <div className="space-y-1">
                                <p className="text-lg font-bold">
                                  {userReserva.attending 
                                    ? `✓ Confirmado`
                                    : '✗ Você informou que não poderá ir.'}
                                </p>
                                {userReserva.attending && (
                                  <p className="text-[10px] text-[#A19A8E] uppercase tracking-widest">
                                    {userReserva.adultsCount} Adultos • {userReserva.childrenCount} Crianças
                                  </p>
                                )}
                               </div>
                               <button 
                                onClick={() => setShowReservaPresencaForm(true)}
                                className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#A19A8E] hover:text-white transition"
                               >
                                Alterar minha reserva
                               </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowReservaPresencaForm(true)}
                              className="w-full bg-[#FAF9F2] text-[#4A4238] font-bold uppercase tracking-[0.2em] py-6 rounded-2xl hover:bg-white transition shadow-xl active:scale-95 text-xs"
                            >
                              Reservar Presença
                            </button>
                          )}
                        </>
                      ) : (
                        <form onSubmit={subPresenca(onConfirmReservaPresenca)} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex gap-4">
                            <label className={`flex-1 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-2 transition cursor-pointer text-center ${watchPresenca('attending') ? 'bg-[#B59A57] border-[#B59A57] text-white' : 'border-white/10 text-[#A19A8E] hover:border-white/30'}`}>
                              <input type="radio" className="hidden" value="true" checked={watchPresenca('attending') === true} {...regPresenca('attending', { setValueAs: v => v === 'true' })} />
                              Sim, eu vou
                            </label>
                            <label className={`flex-1 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-2 transition cursor-pointer text-center ${!watchPresenca('attending') ? 'bg-[#7A7165] border-[#7A7165] text-white' : 'border-white/10 text-[#A19A8E] hover:border-white/30'}`}>
                              <input type="radio" className="hidden" value="false" checked={watchPresenca('attending') === false} {...regPresenca('attending', { setValueAs: v => v === 'true' })} />
                              Infelizmente não
                            </label>
                          </div>
                          
                          {watchPresenca('attending') && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[#A19A8E] ml-2">Adultos</label>
                                <select 
                                  {...regPresenca('adults', { valueAsNumber: true })}
                                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white outline-none focus:ring-1 focus:ring-[#B59A57] transition"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n} className="text-[#4A4238]">{n}</option>)}
                                </select>
                                <ErrorMsg message={errPresenca.adults?.message as string} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[#A19A8E] ml-2">Crianças</label>
                                <select 
                                  {...regPresenca('children', { valueAsNumber: true })}
                                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white outline-none focus:ring-1 focus:ring-[#B59A57] transition"
                                >
                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n} className="text-[#4A4238]">{n}</option>)}
                                </select>
                                <ErrorMsg message={errPresenca.children?.message as string} />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-6 items-center pt-2">
                            <button type="submit" className="flex-grow bg-[#FAF9F2] text-[#4A4238] font-bold uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-white transition shadow-2xl active:scale-95 text-[10px]">Salvar Reserva</button>
                            <button type="button" onClick={() => setShowReservaPresencaForm(false)} className="text-[#A19A8E] text-[10px] font-bold uppercase hover:text-white transition tracking-widest">Voltar</button>
                          </div>
                        </form>
                      )}
                      <p className="text-[9px] text-[#A19A8E] mt-10 text-center uppercase tracking-[0.4em] font-medium">Data limite: {new Date(config.rsvpDeadline).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'presentes' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {gifts.map(gift => (
                    <GiftCard 
                      key={gift.id} 
                      gift={gift} 
                      onReserve={handleReserve} 
                      onCancel={handleCancelReserve}
                      isAdmin={isAdmin}
                      currentUser={user}
                      onRemove={handleRemoveGift}
                      onViewDetails={(id) => setSelectedGiftId(id)}
                    />
                  ))}
                </div>
                {gifts.length === 0 && (
                  <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-[#E8E1D1] shadow-inner">
                    <span className="text-4xl block mb-6">🥂</span>
                    <p className="text-[#A19A8E] font-serif italic text-2xl">Em breve teremos novidades aqui...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'meus-selecionados' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
                <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-[#E8E1D1] shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-[#B59A57]/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  <h3 className="text-3xl font-bold mb-3 text-[#4A4238] serif relative z-10">Sua Generosidade</h3>
                  <p className="text-[#7A7165] text-sm mb-12 relative z-10">Ficamos imensamente gratos por sua contribuição em nossa nova jornada.</p>
                  
                  {myGifts.length > 0 ? (
                    <div className="space-y-6 relative z-10">
                      {myGifts.map(g => (
                        <div key={g.id} className="flex flex-col sm:flex-row justify-between items-center bg-[#FAF9F2] p-8 rounded-3xl gap-6 border border-[#E8E1D1] group transition-all hover:bg-white hover:shadow-md cursor-pointer" onClick={() => setSelectedGiftId(g.id)}>
                          <div className="flex items-center gap-6">
                            <img src={g.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
                            <div>
                              <h4 className="font-bold text-[#4A4238] text-lg">{g.name}</h4>
                              <p className="text-[10px] text-[#B59A57] uppercase tracking-[0.2em] font-bold mt-1">Item Reservado por Você</p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCancelReserve(g.id); }}
                            className="text-[#A19A8E] hover:text-[#C9A694] text-[10px] font-bold uppercase tracking-[0.2em] transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 border-2 border-dashed border-[#FAF9F2] rounded-[3rem] bg-[#FAF9F2]/50 relative z-10">
                      <span className="text-5xl mb-6 block">🤍</span>
                      <p className="text-[#A19A8E] text-sm font-medium">Nenhum item selecionado por enquanto.</p>
                      <button 
                        onClick={() => setActiveTab('presentes')}
                        className="mt-8 text-[#B59A57] font-bold uppercase tracking-[0.3em] text-[10px] border-b border-[#B59A57] pb-1 hover:text-[#4A4238] hover:border-[#4A4238] transition"
                      >
                        Navegar na Lista
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
                
                {/* Metrics Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#4A4238] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#B59A57] block mb-2">Total Geral</span>
                    <h5 className="text-4xl font-bold">{totalPessoas}</h5>
                    <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">Convidados Totais</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-[#E8E1D1] shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#B59A57] block mb-2">Público Adulto</span>
                    <h5 className="text-4xl font-bold text-[#4A4238]">{totalAdultos}</h5>
                    <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">Maiores de Idade</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-[#E8E1D1] shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#B59A57] block mb-2">Público Infantil</span>
                    <h5 className="text-4xl font-bold text-[#4A4238]">{totalCriancas}</h5>
                    <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">Crianças</p>
                  </div>
                   <div className="bg-white p-8 rounded-[2rem] border border-[#E8E1D1] shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A694] block mb-2">Ausências</span>
                    <h5 className="text-4xl font-bold text-[#4A4238]">{totalNaoVao}</h5>
                    <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">Formulários "Não Vou"</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-[#E8E1D1] shadow-sm">
                    <h3 className="text-[10px] font-bold mb-8 text-[#B59A57] uppercase tracking-[0.3em] flex items-center gap-3">
                      <span className="text-lg">⚙️</span> Configuração do Evento
                    </h3>
                    <form onChange={subConfig(onSaveConfig)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Data</label>
                          <input type="date" {...regConfig('eventDate')} className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Hora</label>
                          <input type="time" {...regConfig('eventTime')} className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238]" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Prazo RSVP</label>
                        <input type="date" {...regConfig('rsvpDeadline')} className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Endereço</label>
                        <textarea {...regConfig('location')} className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none h-20 text-[#4A4238] resize-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Link do Mapa (Google Maps)</label>
                        <input {...regConfig('locationLink')} placeholder="https://maps.app.goo.gl/..." className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238]" />
                        <ErrorMsg message={errConfig.locationLink?.message as string} />
                      </div>
                    </form>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 border border-[#E8E1D1] shadow-sm">
                    <h3 className="text-[10px] font-bold mb-8 text-[#B59A57] uppercase tracking-[0.3em] flex items-center gap-3">
                      <span className="text-lg">✨</span> Adicionar Presente
                    </h3>
                    <form onSubmit={subGift(onAddGift)} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Nome</label>
                        <input {...regGift('name')} placeholder="Ex: Conjunto de Facas" className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238]" />
                        <ErrorMsg message={errGift.name?.message as string} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Descrição</label>
                        <textarea {...regGift('description')} placeholder="Breve detalhe..." className="w-full bg-[#FAF9F2] border border-[#E8E1D1] rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-[#B59A57] outline-none text-[#4A4238] h-24 resize-none" />
                        <ErrorMsg message={errGift.description?.message as string} />
                      </div>
                      <div className="space-y-4 pt-2">
                          <label className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Imagem do Presente</label>
                          <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-[#E8E1D1] rounded-2xl p-6 bg-[#FAF9F2] flex flex-col items-center justify-center cursor-pointer hover:border-[#B59A57] transition-all group h-32 overflow-hidden relative"
                            >
                              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                              {uploadedImage ? (
                                <img src={uploadedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                              ) : (
                                <span className="text-2xl mb-2">📸</span>
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19A8E] relative z-10">{uploadedImage ? 'Trocar Imagem' : 'Escolher Foto'}</span>
                            </div>
                      </div>
                      <button type="submit" className="w-full bg-[#4A4238] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3C3633] transition shadow-lg mt-4 active:scale-95">Salvar Presente</button>
                    </form>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-[#E8E1D1] shadow-sm overflow-hidden">
                  <h3 className="text-[10px] font-bold mb-10 text-[#B59A57] uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="text-lg">📜</span> Lista de Convidados
                  </h3>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#FAF9F2]">
                          <th className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">Convidado</th>
                          <th className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">Status</th>
                          <th className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">Adultos</th>
                          <th className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">Crianças</th>
                          <th className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">Contato</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FAF9F2]">
                        {confirmacoes.map((r, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F2]/50 transition group">
                            <td className="py-6 font-bold text-[#4A4238]">{r.name}</td>
                            <td className="py-6">
                              <span className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${r.attending ? 'bg-[#F2EADA] text-[#B59A57]' : 'bg-red-50 text-red-400'}`}>
                                {r.attending ? 'Confirmado' : 'Não Vai'}
                              </span>
                            </td>
                            <td className="py-6 text-[#4A4238] font-bold">{r.attending ? r.adultsCount : '-'}</td>
                            <td className="py-6 text-[#4A4238] font-bold">{r.attending ? r.childrenCount : '-'}</td>
                            <td className="py-6 text-[#A19A8E] font-mono text-[9px] tracking-widest">{r.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white py-24 border-t border-[#E8E1D1] text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-[#A19A8E] text-2xl serif mb-8 italic leading-relaxed">"O lar não é um lugar, <br/>é um sentimento."</p>
          <div className="h-0.5 bg-[#FAF9F2] w-16 mx-auto mb-10"></div>
          <p className="text-[#B59A57] font-bold uppercase tracking-[0.4em] text-[9px]">Com carinho, seus anfitriões.</p>
        </div>
      </footer>
    </div>
  );
}
