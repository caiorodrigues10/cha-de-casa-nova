import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Presenca } from '../../../types';
import { RSVP_STORAGE_KEY } from '../../../constants';
import { userSchema, maskPhone } from '../../schemas';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { getUserByPhone, registerUser } from '../../services/api';

interface UserAuthModalProps {
  onSave: (u: User) => void;
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ onSave }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const phone = watch('phone');
  const [existingUserFound, setExistingUserFound] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (phone && /^\(\d{2}\) \d{5}-\d{4}$/.test(phone)) {
        try {
          const match = await getUserByPhone(phone);
          if (match) {
            setExistingUserFound(match.name);
            setValue('name', match.name);
            return;
          }
        } catch (error) {
          // Ignore errors during auto-fill
        }
      }
      setExistingUserFound(null);
    };
    checkUser();
  }, [phone, setValue]);

  const onSubmit = async (data: any) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const { user: registeredUser } = await registerUser({ name: data.name, phone: data.phone });
      onSave(registeredUser);
    } catch (error: any) {
      setApiError(error.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#FAF9F2] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-[#E8E1D1]">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-inner border border-[#E8E1D1]">🏠</div>
        <h2 className="text-4xl font-bold mb-3 text-[#4A4238] serif">Bem-vindos!</h2>
        <p className="text-[#7A7165] mb-10 text-sm leading-relaxed">Ficamos muito felizes em celebrar nossa nova casa com você. Como podemos te identificar?</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Telefone / WhatsApp (ID Único)"
            {...register('phone')}
            onChange={(e) => setValue('phone', maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            error={errors.phone?.message as string}
            className="font-mono text-sm bg-white shadow-sm"
          />

          <Input
            label={existingUserFound ? 'Seu Nome Registrado' : 'Seu Nome Completo'}
            {...register('name')}
            disabled={!!existingUserFound || isLoading}
            placeholder="Ex: Maria Clara"
            error={errors.name?.message as string}
            hint={existingUserFound ? `✓ Já conhecemos você, ${existingUserFound.split(' ')[0]}!` : undefined}
            className="bg-white shadow-sm"
          />

          {apiError && <p className="text-red-500 text-sm font-medium">{apiError}</p>}

          <Button type="submit" variant="secondary" size="lg" fullWidth className="mt-6" disabled={isLoading}>
            {isLoading ? 'Conectando...' : existingUserFound ? 'Entrar' : 'Começar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserAuthModal;
