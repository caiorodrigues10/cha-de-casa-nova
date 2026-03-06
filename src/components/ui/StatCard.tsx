import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  sublabel: string;
  variant?: 'dark' | 'light';
  accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  variant = 'light',
  accentColor = '#B59A57',
}) => {
  if (variant === 'dark') {
    return (
      <div className="bg-[#4A4238] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
        <span className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: accentColor }}>{label}</span>
        <h5 className="text-4xl font-bold">{value}</h5>
        <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">{sublabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-[#E8E1D1] shadow-sm">
      <span className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: accentColor }}>{label}</span>
      <h5 className="text-4xl font-bold text-[#4A4238]">{value}</h5>
      <p className="text-[10px] text-[#A19A8E] mt-2 font-medium uppercase tracking-tighter">{sublabel}</p>
    </div>
  );
};

export default StatCard;
