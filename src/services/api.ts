/**
 * src/services/api.ts
 *
 * Camada de serviço que simula chamadas HTTP ao back-end Fastify.
 * Para ativar o back-end real, basta trocar USE_MOCK para false
 * e garantir que BASE_URL aponte para o servidor.
 *
 * Cada função replica exatamente o contrato de API definido em
 * docs/BACKEND_SPEC.md — mesmos paths, payloads e formatos de resposta.
 */

import { User, Gift, Presenca, EventConfig } from '../../types';
import { INITIAL_GIFTS, DEFAULT_CONFIG } from '../../constants';

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3333';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // mock por padrão

/** Simula latência de rede (50–200ms) */
const delay = (ms = 120) => new Promise<void>(res => setTimeout(res, ms));

// ---------------------------------------------------------------------------
// HTTP helper (usado quando USE_MOCK = false)
// ---------------------------------------------------------------------------

async function http<T>(
  path: string,
  options: RequestInit = {},
  jwt?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// MOCK store (espelha o estado do banco de dados em memória)
// ---------------------------------------------------------------------------

let _gifts: Gift[] = structuredClone(INITIAL_GIFTS);
let _presencas: Presenca[] = [];
let _config: EventConfig = structuredClone(DEFAULT_CONFIG);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginPayload {
  password: string;
}

export interface AuthResponse {
  token: string;
}

/**
 * POST /auth/admin
 * Autentica o admin e retorna um JWT.
 */
export async function adminLogin(payload: LoginPayload): Promise<AuthResponse> {
  return http<AuthResponse>('/auth/admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Usuários
// ---------------------------------------------------------------------------

export interface RegisterUserPayload {
  name: string;
  phone: string;
}

export interface RegisterUserResponse {
  user: User;
}

/**
 * POST /users
 * Registra ou atualiza um usuário pelo telefone.
 */
export async function registerUser(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
  if (USE_MOCK) {
    await delay();
    return { user: { ...payload, isAdmin: false } };
  }

  return http<RegisterUserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /users/me?phone=:phone
 * Busca usuário existente pelo telefone (para auto-fill no modal).
 */
export async function getUserByPhone(phone: string): Promise<User | null> {
  if (USE_MOCK) {
    await delay(60);
    const match = _presencas.find(p => p.phone === phone);
    if (!match) return null;
    return { name: match.name, phone: match.phone, isAdmin: false };
  }

  return http<User | null>(`/users/me?phone=${encodeURIComponent(phone)}`);
}

// ---------------------------------------------------------------------------
// Presença / RSVP
// ---------------------------------------------------------------------------

export interface ConfirmPresencaPayload {
  phone: string;
  name: string;
  attending: boolean;
  adultsCount: number;
  childrenCount: number;
}

/**
 * GET /presencas
 * Lista todas as confirmações (somente admin).
 */
export async function listarPresencas(jwt: string): Promise<Presenca[]> {
  if (USE_MOCK) {
    await delay();
    return structuredClone(_presencas);
  }

  return http<Presenca[]>('/rsvp', {}, jwt);
}

/**
 * POST /presencas
 * Cria ou atualiza a confirmação de presença do usuário.
 */
export async function confirmarPresenca(
  payload: ConfirmPresencaPayload,
  jwt?: string | null,
): Promise<Presenca> {
  if (USE_MOCK) {
    await delay();
    const nova: Presenca = {
      name: payload.name,
      phone: payload.phone,
      attending: payload.attending,
      adultsCount: payload.adultsCount,
      childrenCount: payload.childrenCount,
      guestsCount: payload.adultsCount + payload.childrenCount,
      date: new Date().toISOString(),
    };
    const idx = _presencas.findIndex(p => p.phone === payload.phone);
    if (idx > -1) _presencas[idx] = nova;
    else _presencas.push(nova);
    return nova;
  }

  return http<Presenca>('/rsvp', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, jwt);
}

// ---------------------------------------------------------------------------
// Presentes / Gifts
// ---------------------------------------------------------------------------

/**
 * GET /gifts
 * Retorna todos os presentes.
 */
export async function listarGifts(): Promise<Gift[]> {
  if (USE_MOCK) {
    await delay();
    return structuredClone(_gifts);
  }

  return http<Gift[]>('/gifts');
}

export interface AddGiftPayload {
  name: string;
  description: string;
  imageUrl: string;
  link?: string;
  priceEstimate?: number;
}

/**
 * POST /gifts
 * Adiciona um presente (admin).
 */
export async function adicionarGift(payload: AddGiftPayload, jwt: string): Promise<Gift> {
  if (USE_MOCK) {
    await delay();
    const novo: Gift = {
      ...payload,
      id: Date.now().toString(),
      isReserved: false,
    };
    _gifts.push(novo);
    return novo;
  }

  return http<Gift>('/gifts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, jwt);
}

/**
 * PUT /gifts/:id
 * Edita um presente (admin).
 */
export async function editarGift(id: string, payload: Partial<AddGiftPayload>, jwt: string): Promise<Gift> {
  if (USE_MOCK) {
    await delay();
    const giftIndex = _gifts.findIndex(g => g.id === id);
    if (giftIndex === -1) throw new Error('Presente não encontrado');

    // Atualiza apenas os campos fornecidos
    const giftAtualizado = { ..._gifts[giftIndex], ...payload };
    _gifts[giftIndex] = giftAtualizado;
    return structuredClone(giftAtualizado);
  }

  return http<Gift>(`/gifts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, jwt);
}

/**
 * DELETE /gifts/:id
 * Remove um presente (admin).
 */
export async function removerGift(id: string, jwt: string): Promise<void> {
  if (USE_MOCK) {
    await delay();
    _gifts = _gifts.filter(g => g.id !== id);
    return;
  }

  return http<void>(`/gifts/${id}`, { method: 'DELETE' }, jwt);
}

/**
 * PATCH /gifts/:id/reserve
 * Reserva um presente para o usuário autenticado.
 */
export async function reservarGift(id: string, reservedBy: string): Promise<Gift> {
  if (USE_MOCK) {
    await delay();
    const gift = _gifts.find(g => g.id === id);
    if (!gift) throw new Error('Presente não encontrado');
    if (gift.isReserved) throw new Error('Presente já reservado');
    gift.isReserved = true;
    gift.reservedBy = reservedBy;
    return structuredClone(gift);
  }

  return http<Gift>(`/gifts/${id}/reserve`, {
    method: 'PATCH',
    body: JSON.stringify({ reservedBy }),
  });
}

/**
 * PATCH /gifts/:id/cancel
 * Cancela a reserva de um presente.
 */
export async function cancelarReserva(id: string): Promise<Gift> {
  if (USE_MOCK) {
    await delay();
    const gift = _gifts.find(g => g.id === id);
    if (!gift) throw new Error('Presente não encontrado');
    gift.isReserved = false;
    gift.reservedBy = undefined;
    return structuredClone(gift);
  }

  return http<Gift>(`/gifts/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({})
  });
}

// ---------------------------------------------------------------------------
// Configuração do Evento
// ---------------------------------------------------------------------------

/**
 * GET /config
 * Retorna a configuração atual do evento.
 */
export async function getConfig(): Promise<EventConfig> {
  if (USE_MOCK) {
    await delay(80);
    return structuredClone(_config);
  }

  return http<EventConfig>('/config');
}

/**
 * PUT /config
 * Atualiza a configuração do evento (admin).
 */
export async function salvarConfig(payload: EventConfig, jwt: string): Promise<EventConfig> {
  if (USE_MOCK) {
    await delay();
    _config = { ...payload };
    return structuredClone(_config);
  }

  return http<EventConfig>('/config', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, jwt);
}
