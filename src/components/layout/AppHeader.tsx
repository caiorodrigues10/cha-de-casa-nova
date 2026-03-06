import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import TabButton from '../ui/TabButton';
import SuperCelebrationAnimation from '../ui/SuperCelebrationAnimation';

export type TabType = 'evento' | 'presentes' | 'meus-selecionados' | 'admin';

interface AppHeaderProps {
  user: User | null;
  isAdmin: boolean;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  myGiftsCount: number;
  reservedGiftsCount: number;
  totalGiftsCount: number;
  progressPercent: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  isAdmin,
  activeTab,
  onTabChange,
  myGiftsCount,
  reservedGiftsCount,
  totalGiftsCount,
  progressPercent,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  // Trigger super celebration on 100% milestone
  useEffect(() => {
    if (progressPercent === 100) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [progressPercent]);

  return (
    <header className="bg-white border-b border-[#E8E1D1] pt-16 pb-8">
      <SuperCelebrationAnimation
        trigger={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />

      <div className="max-w-5xl mx-auto text-center mb-12 px-6">
      <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#B59A57] mb-4 block">
        Chá de Casa Nova
      </span>
      <h2 className="text-5xl md:text-7xl font-bold text-[#4A4238] mb-6 serif tracking-tight">
        Caio <span className="text-[#C9A694] font-light">&</span> Jhennifer
      </h2>
      <p className="text-[#7A7165] max-w-xl mx-auto text-sm leading-relaxed font-medium">
        Sua presença é o nosso maior presente. Criamos esta lista para compartilhar com vocês nossos planos para o novo lar.
      </p>
    </div>

    <div className="max-w-5xl mx-auto mb-10 px-6">
      <div className="bg-[#FAF9F2] rounded-[2rem] p-8 border border-[#E8E1D1] shadow-inner relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 relative z-10">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] block mb-2">Conquista do Lar</span>
            {progressPercent === 100 ? (
              <h4 className="text-2xl md:text-3xl font-black text-rgb-animated drop-shadow-sm py-1">
                🎉 Meta Concluída: Nosso Novo Lar! 🎉
              </h4>
            ) : (
              <h4 className="text-2xl font-bold text-[#4A4238]">{progressPercent}% dos itens preparados</h4>
            )}
          </div>
          <div className="text-[#A19A8E] text-xs font-bold uppercase tracking-widest">
            {reservedGiftsCount} / {totalGiftsCount} Presentes
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
            onClick={() => onTabChange('evento')}
            icon={<span className="text-sm">🏠</span>}
          />
          <TabButton
            label="Lista de Presentes"
            mobileLabel="Presentes"
            active={activeTab === 'presentes'}
            onClick={() => onTabChange('presentes')}
            icon={<span className="text-sm">✨</span>}
          />
          {user && !isAdmin && (
            <TabButton
              label={`Meus Escolhidos (${myGiftsCount})`}
              mobileLabel={`Meus (${myGiftsCount})`}
              active={activeTab === 'meus-selecionados'}
              onClick={() => onTabChange('meus-selecionados')}
              icon={<span className="text-sm">🤍</span>}
            />
          )}
          {isAdmin && (
            <TabButton
              label="Painel Admin"
              mobileLabel="Admin"
              active={activeTab === 'admin'}
              onClick={() => onTabChange('admin')}
              icon={<span className="text-sm">🛠️</span>}
            />
          )}
        </div>
      </div>
    </div>
  </header>
  );
};

export default AppHeader;
