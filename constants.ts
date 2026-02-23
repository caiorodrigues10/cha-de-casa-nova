
import { Gift, EventConfig } from './types';

export const INITIAL_GIFTS: Gift[] = [
  {
    id: '1',
    name: 'Jogo de Jantar 20 Peças',
    description: 'Conjunto de pratos de porcelana branca Oxford para ocasiões especiais.',
    imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=600',
    link: 'https://www.amazon.com.br/s?k=jogo+de+jantar+porcelana',
    isReserved: false
  },
  {
    id: '2',
    name: 'Fritadeira Elétrica Airfryer',
    description: 'Airfryer potente (4L) para nossas receitas saudáveis de final de semana.',
    imageUrl: 'https://images.unsplash.com/photo-1626071494702-420443e2ee43?auto=format&fit=crop&q=80&w=600',
    link: 'https://www.magazineluiza.com.br/busca/airfryer/',
    isReserved: false
  },
  {
    id: '3',
    name: 'Jogo de Toalhas Gigante',
    description: 'Kit banho e rosto em algodão egípcio, cor off-white.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    link: 'https://www.tokstok.com.br/banho/jogos-de-toalha',
    isReserved: false
  },
  {
    id: '4',
    name: 'Aspirador de Pó Robô',
    description: 'Para nos ajudar a manter o novo lar sempre impecável.',
    imageUrl: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&q=80&w=600',
    link: 'https://www.mercadolivre.com.br/aspirador-robo',
    isReserved: false
  }
];

export const DEFAULT_CONFIG: EventConfig = {
  eventDate: '2024-12-15',
  eventTime: '18:00',
  location: 'Rua das Flores, 123 - Apt 42, São Paulo',
  locationLink: 'https://maps.app.goo.gl/3fX3B7F1V8C2D5E6',
  rsvpDeadline: '2024-12-01',
  googleCalendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chá+de+Casa+Nova+-+Nosso+Novo+Lar&dates=20241215T210000Z/20241216T010000Z&details=Esperamos+vocês+para+celebrar+nossa+conquista!&location=Rua+das+Flores,+123+-+Apt+42,+São+Paulo'
};

export const USER_STORAGE_KEY = 'housewarming_user';
export const ADMIN_STORAGE_KEY = 'housewarming_admin_session';
export const GIFTS_STORAGE_KEY = 'housewarming_gifts';
export const RSVP_STORAGE_KEY = 'housewarming_reservas_presenca';
export const CONFIG_STORAGE_KEY = 'housewarming_config';

export const ADMIN_PASSWORD = 'admin123';
