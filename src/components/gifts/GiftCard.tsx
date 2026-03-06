import React from 'react';
import { Gift, User } from '../../types';
import Button from '../ui/Button';

interface GiftCardProps {
  gift: Gift;
  onReserve: (id: string) => void;
  onCancel: (id: string) => void;
  isAdmin: boolean;
  currentUser: User | null;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, onReserve, onCancel, isAdmin, currentUser, onRemove, onEdit, onViewDetails }) => {
  const isMine = currentUser && gift.reservedBy === currentUser.name;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E8E1D1] transition-all hover:shadow-md flex flex-col h-full group cursor-pointer relative"
      onClick={() => onViewDetails(gift.id)}
    >
      {/* Imagem */}
      <div className={`relative overflow-hidden aspect-[4/3] ${gift.isReserved ? 'bg-[#FAF9F2]' : ''}`}>
        <img
          src={gift.imageUrl || `https://picsum.photos/seed/${gift.id}/600/400`}
          alt={gift.name}
          className={`w-full h-full object-cover transition-all duration-700 ${!gift.isReserved ? 'group-hover:scale-110' : 'opacity-40 grayscale mix-blend-multiply'}`}
        />
        {gift.isReserved && (
          <div className="absolute inset-0 bg-[#4A4238]/5 flex flex-col items-center justify-center p-4 text-center">
            <span className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm scale-100 group-hover:scale-105 transition-transform duration-500 ${isMine ? 'bg-[#B59A57]/90 text-white backdrop-blur-sm' : 'bg-white/90 text-[#7A7165] backdrop-blur-sm shadow-md'}`}>
              {isMine ? '✓ Você Escolheu' : 'Reservado'}
            </span>
            {!isMine && gift.reservedBy && (
              <p className="mt-3 text-[9px] font-bold text-[#4A4238]/70 uppercase tracking-widest bg-white/60 px-3 py-1 rounded-md backdrop-blur-sm shadow-sm">Por {gift.reservedBy.split(' ')[0]}</p>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={`p-6 flex flex-col grow ${gift.isReserved ? 'bg-[#FAF9F2]/50' : ''}`}>
        <h3 className={`text-lg font-bold mb-1 transition-colors line-clamp-1 ${gift.isReserved ? 'text-[#A19A8E] line-through decoration-[#E8E1D1]' : 'text-[#4A4238]'}`}>{gift.name}</h3>
        <p className={`text-xs mb-6 grow leading-relaxed line-clamp-2 transition-colors ${gift.isReserved ? 'text-[#C9C4BB]' : 'text-[#7A7165]'}`}>{gift.description}</p>

        <div className="mt-auto space-y-3" onClick={(e) => e.stopPropagation()}>
          {!gift.isReserved ? (
            <Button variant="secondary" size="sm" fullWidth onClick={() => onReserve(gift.id)}>
              Escolher Presente
            </Button>
          ) : isMine ? (
            <button
              onClick={() => onCancel(gift.id)}
              className="w-full text-[10px] text-[#A19A8E] hover:text-red-400 font-bold uppercase tracking-widest transition py-2 cursor-pointer bg-white rounded-lg border border-[#E8E1D1]"
            >
              Cancelar Minha Escolha
            </button>
          ) : (
            <p className="py-2.5 text-center text-[9px] text-[#C9C4BB] font-bold uppercase tracking-widest bg-black/5 rounded-lg border border-black/5">Item indisponível</p>
          )}
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onEdit?.(gift.id); }}
            >
              Editar Presente
            </Button>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onRemove?.(gift.id); }}
            >
              Remover do Sistema
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard;
