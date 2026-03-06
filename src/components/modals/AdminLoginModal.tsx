import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { adminLogin } from '../../services/api';

interface AdminLoginModalProps {
  onLogin: (jwt: string) => boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (failedAttempts >= 3) {
      setError('Muitas tentativas falhas. Acesso bloqueado temporariamente.');
      return;
    }
    const trimmed = password.trim();
    if (!trimmed) {
      setError('Insira a senha de administrador.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await adminLogin({ password: trimmed });
      if (onLogin(response.token)) {
        onClose();
      } else {
        setFailedAttempts(prev => prev + 1);
        setError('Token retornado é inválido.');
        setPassword('');
      }
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setError('Muitas tentativas falhas. Acesso bloqueado temporariamente.');
      } else {
        const backendMsg = err.message?.toLowerCase();
        let displayError = 'Senha incorreta.';
        if (backendMsg && (backendMsg.includes('incorrect') || backendMsg.includes('unauthorized') || backendMsg.includes('invalid'))) {
          displayError = 'Senha incorreta. Tente novamente.';
        } else if (err.message && err.message.length < 50) {
          displayError = err.message;
        }
        setError(displayError);
      }
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const isBlocked = failedAttempts >= 3;

  return (
    <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-[#FAF9F2] rounded-4xl p-8 max-w-sm w-full shadow-2xl border border-[#E8E1D1] animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-[#E8E1D1] shadow-inner">🔐</div>
          <h2 className="text-2xl font-bold text-[#4A4238] serif">Área Restrita</h2>
          <p className="text-[#7A7165] text-[11px] uppercase tracking-widest mt-2">Acesso do Administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Senha de Acesso"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            autoFocus
            placeholder="Digite a senha..."
            error={error ?? undefined}
            className="font-mono bg-white"
            disabled={isLoading || isBlocked}
          />

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary" size="md" fullWidth className="flex-2" disabled={isLoading || isBlocked}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
