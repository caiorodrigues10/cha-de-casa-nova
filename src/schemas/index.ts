import { z } from 'zod';

export const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phone: z.string().regex(phoneRegex, 'Formato inválido: (00) 00000-0000'),
});

export const presencaSchema = z.object({
  attending: z.boolean(),
  adults: z.number().min(1, 'Mínimo 1 adulto').max(10, 'Máximo 10 adultos'),
  children: z.number().min(0, 'Mínimo 0').max(10, 'Máximo 10 crianças'),
});

export const configSchema = z.object({
  eventDate: z.string().min(1, 'Data é obrigatória'),
  eventTime: z.string().min(1, 'Hora é obrigatória'),
  rsvpDeadline: z.string().min(1, 'Prazo é obrigatório'),
  location: z.string().min(5, 'Endereço muito curto'),
  locationLink: z.string().url('Link inválido').optional().or(z.literal('')),
  googleCalendarLink: z.string().optional(),
});

export const giftSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  description: z.string().min(5, 'Descrição muito curta'),
  imageUrl: z.string().optional().or(z.literal('')),
  link: z.string().url('Link da loja inválido').optional().or(z.literal('')),
});

export const maskPhone = (value: string) => {
  if (!value) return value;

  // Remove non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');

  if (phoneNumber.length === 0) {
    return '';
  }

  if (phoneNumber.length <= 2) {
    return `(${phoneNumber}`;
  }

  if (phoneNumber.length <= 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }

  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};
