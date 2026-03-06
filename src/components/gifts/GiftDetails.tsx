import React from 'react';
import { Gift, User } from '../../types';
import Button from '../ui/Button';

interface GiftDetailsProps {
  gift: Gift;
  currentUser: User | null;
  onReserve: (id: string) => void;
  onCancel: (id: string) => void;
  onBack: () => void;
}

const GiftDetails: React.FC<GiftDetailsProps> = ({ gift, currentUser, onReserve, onCancel, onBack }) => {
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
        {/* Imagem */}
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

        {/* Conteúdo */}
        <div className="p-10 md:p-16 flex flex-col">
          <div className="mb-10">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 serif leading-tight ${gift.isReserved ? 'text-[#A19A8E]' : 'text-[#4A4238]'}`}>{gift.name}</h2>
            <div className={`h-0.5 w-16 mb-8 ${gift.isReserved ? 'bg-[#C9C4BB]' : 'bg-[#B59A57]'}`} />
            <p className={`text-base leading-relaxed whitespace-pre-line ${gift.isReserved ? 'text-[#A19A8E]' : 'text-[#7A7165]'}`}>{gift.description}</p>
          </div>

          <div className="mt-auto space-y-6">
            {gift.link && (
              <div className="p-6 bg-[#FAF9F2] rounded-3xl border border-[#E8E1D1]">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59A57] mb-3">Sugestão de Compra</h4>
                <p className="text-[#7A7165] text-xs mb-4">Você pode encontrar este item clicando no botão abaixo:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  as="a"
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ir para a Loja <span className="text-xs">↗</span>
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {!gift.isReserved ? (
                <Button variant="secondary" size="lg" fullWidth onClick={() => onReserve(gift.id)}>
                  Desejo presentear com este item
                </Button>
              ) : isMine ? (
                <Button variant="danger" size="lg" fullWidth onClick={() => onCancel(gift.id)}>
                  Cancelar Reserva
                </Button>
              ) : (
                <div className="w-full bg-[#FAF9F2] text-[#A19A8E] text-xs font-bold uppercase tracking-[0.3em] py-6 rounded-[2rem] text-center border border-[#E8E1D1] italic">
                  Este item já foi reservado
                </div>
              )}
            </div>

            <p className="text-[10px] text-[#A19A8E] text-center font-medium uppercase tracking-[0.2em]">
              Sua participação é o que mais importa para nós.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftDetails;
