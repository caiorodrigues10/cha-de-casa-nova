import React from 'react';

interface InfoRowProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, children }) => (
  <div className="flex gap-6">
    <div className="w-14 h-14 bg-[#FAF9F2] rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm border border-[#E8E1D1]">
      {icon}
    </div>
    <div>
      <span className="block text-[10px] uppercase font-bold text-[#A19A8E] mb-1.5 tracking-widest">{label}</span>
      {children}
    </div>
  </div>
);

export default InfoRow;
