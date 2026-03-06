import React from 'react';

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-[2.5rem] p-10 border border-[#E8E1D1] shadow-sm ${className}`}>
    <h3 className="text-[10px] font-bold mb-8 text-[#B59A57] uppercase tracking-[0.3em] flex items-center gap-3">
      {icon && <span className="text-lg">{icon}</span>}
      {title}
    </h3>
    {children}
  </div>
);

export default SectionCard;
