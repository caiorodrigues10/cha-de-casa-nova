import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1 select-none"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-[#FAF9F2] border rounded-2xl px-5 py-4 text-xs text-[#4A4238] outline-none',
            'transition-all duration-200 placeholder:text-[#C4BDB3]',
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50/30'
              : 'border-[#E8E1D1] focus:ring-2 focus:ring-[#B59A57]/40 focus:border-[#B59A57]',
            className,
          ].join(' ')}
          {...props}
        />
        {hint && !error && <p className="text-[9px] text-[#B59A57] ml-1">{hint}</p>}
        {error && <p className="text-[9px] text-red-400 font-medium ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
