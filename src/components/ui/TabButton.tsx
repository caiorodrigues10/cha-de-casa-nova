import React from 'react';

interface TabButtonProps {
  label: string;
  mobileLabel?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, mobileLabel, active, onClick, icon }) => (
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

export default TabButton;
