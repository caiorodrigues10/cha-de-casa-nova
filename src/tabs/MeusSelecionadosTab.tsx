import React from 'react';
import { Gift } from '../../types';
import EmptyState from '../components/ui/EmptyState';

interface MeusSelecionadosTabProps {
  myGifts: Gift[];
  onCancelReserve: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigateToPresentes: () => void;
}

const MeusSelecionadosTab: React.FC<MeusSelecionadosTabProps> = ({
  myGifts,
  onCancelReserve,
  onViewDetails,
  onNavigateToPresentes,
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
    <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-[#E8E1D1] shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#B59A57]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
      <h3 className="text-3xl font-bold mb-3 text-[#4A4238] serif relative z-10">Sua Generosidade</h3>
      <p className="text-[#7A7165] text-sm mb-12 relative z-10">Ficamos imensamente gratos por sua contribuição em nossa nova jornada.</p>

      {myGifts.length > 0 ? (
        <div className="space-y-6 relative z-10">
          {myGifts.map(g => (
            <GiftRow
              key={g.id}
              gift={g}
              onViewDetails={onViewDetails}
              onCancelReserve={onCancelReserve}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="filled"
          icon="🤍"
          message="Nenhum item selecionado por enquanto."
          actionLabel="Navegar na Lista"
          onAction={onNavigateToPresentes}
        />
      )}
    </div>
  </div>
);

interface GiftRowProps {
  gift: Gift;
  onViewDetails: (id: string) => void;
  onCancelReserve: (id: string) => void;
}

const GiftRow: React.FC<GiftRowProps> = ({ gift, onViewDetails, onCancelReserve }) => (
  <div
    className="flex flex-col sm:flex-row justify-between items-center bg-[#FAF9F2] p-8 rounded-3xl gap-6 border border-[#E8E1D1] group transition-all hover:bg-white hover:shadow-md cursor-pointer"
    onClick={() => onViewDetails(gift.id)}
  >
    <div className="flex items-center gap-6">
      <img src={gift.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
      <div>
        <h4 className="font-bold text-[#4A4238] text-lg">{gift.name}</h4>
        <p className="text-[10px] text-[#B59A57] uppercase tracking-[0.2em] font-bold mt-1">Item Reservado por Você</p>
      </div>
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); onCancelReserve(gift.id); }}
      className="text-[#A19A8E] hover:text-[#C9A694] text-[10px] font-bold uppercase tracking-[0.2em] transition"
    >
      Cancelar
    </button>
  </div>
);

export default MeusSelecionadosTab;
