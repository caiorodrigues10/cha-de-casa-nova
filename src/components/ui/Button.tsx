import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[#B59A57] text-white hover:bg-[#A38948] shadow-lg',
  secondary: 'bg-[#4A4238] text-white hover:bg-[#3C3633] shadow-lg',
  ghost:     'bg-transparent text-[#A19A8E] hover:text-[#4A4238] border border-[#E8E1D1] hover:border-[#4A4238]',
  danger:    'bg-red-50 text-red-400 hover:bg-red-100 border border-red-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-3 text-[9px] tracking-[0.15em]',
  md: 'px-8 py-4 text-[10px] tracking-[0.2em]',
  lg: 'px-10 py-5 text-[10px] tracking-[0.25em]',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      children,
      className = '',
      disabled,
      as: Tag = 'button',
      ...props
    },
    ref
  ) => {
    const base = [
      'inline-flex items-center justify-center gap-2 rounded-2xl font-bold uppercase transition-all duration-200 active:scale-95 select-none cursor-pointer',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'opacity-50 pointer-events-none' : '',
      className,
    ].join(' ');

    if (Tag === 'a') {
      return (
        <a className={base} {...(props as any)}>
          {loading ? <Spinner /> : children}
        </a>
      );
    }

    return (
      <button ref={ref} className={base} disabled={disabled || loading} {...props}>
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

const Spinner = () => (
  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

Button.displayName = 'Button';
export default Button;
