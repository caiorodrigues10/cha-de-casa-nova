import React from 'react';

interface EmptyStateProps {
  icon: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'bordered' | 'filled';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  actionLabel,
  onAction,
  variant = 'bordered',
}) => {
  const baseClass = variant === 'filled'
    ? 'text-center py-24 border-2 border-dashed border-[#FAF9F2] rounded-[3rem] bg-[#FAF9F2]/50 relative z-10'
    : 'text-center py-40 bg-white rounded-[3rem] border border-dashed border-[#E8E1D1] shadow-inner';

  return (
    <div className={baseClass}>
      <span className="text-4xl block mb-6">{icon}</span>
      <p className="text-[#A19A8E] font-serif italic text-lg">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 text-[#B59A57] font-bold uppercase tracking-[0.3em] text-[10px] border-b border-[#B59A57] pb-1 hover:text-[#4A4238] hover:border-[#4A4238] transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
