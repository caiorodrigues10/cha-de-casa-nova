import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  dark?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, dark = false, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const base = dark
      ? 'bg-white/10 border border-white/20 text-white focus:ring-[#B59A57]'
      : 'bg-[#FAF9F2] border-[#E8E1D1] text-[#4A4238] focus:ring-[#B59A57]/40 focus:border-[#B59A57]';

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-[9px] font-bold uppercase tracking-[0.2em] ml-1 select-none ${dark ? 'text-[#A19A8E]' : 'text-[#A19A8E]'}`}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={[
            'w-full border rounded-2xl px-5 py-4 text-xs outline-none transition-all duration-200 focus:ring-2',
            base,
            error ? 'border-red-300 focus:ring-red-200' : '',
            className,
          ].join(' ')}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-[#4A4238]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[9px] text-red-400 font-medium ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
