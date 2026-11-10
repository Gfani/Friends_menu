import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'yellow' | 'red' | 'blue' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-headline uppercase tracking-wider font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded focus:outline-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#FFBD18] text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.35)]',
    yellow:
      'bg-[#FFBD18] text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.35)]',
    accent:
      'bg-[#1a1a22] text-[#FFBD18] border border-[#383844] hover:border-[#FFBD18] hover:bg-[#20202a]',
    secondary:
      'bg-[#202028] text-white hover:bg-[#2a2a35] border border-[#383844]',
    outline:
      'bg-transparent hover:bg-white/10 text-white border border-[#383844] hover:border-[#FFBD18]',
    danger:
      'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40',
    red:
      'bg-[#F32636] text-white hover:brightness-110 font-bold shadow-[0_0_15px_rgba(243,38,54,0.35)]',
    blue:
      'bg-[#16B9E8] text-black hover:brightness-110 font-bold shadow-[0_0_15px_rgba(22,185,232,0.35)]',
    ghost:
      'bg-transparent hover:bg-white/10 text-zinc-300 hover:text-white',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
