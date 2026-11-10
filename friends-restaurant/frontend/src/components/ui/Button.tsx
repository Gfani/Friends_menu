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
      'bg-[#FFBD18] text-black font-extrabold hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.3)]',
    yellow:
      'bg-[#FFBD18] text-black font-extrabold hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.3)]',
    accent:
      'bg-[#121212] text-white border border-[#222222] hover:border-[#333333] hover:bg-[#181818]',
    secondary:
      'bg-[#181818] text-white hover:bg-[#202020] border border-[#222222]',
    outline:
      'bg-transparent hover:bg-white/5 text-white border border-[#222222] hover:border-[#333333]',
    danger:
      'bg-[#181818] hover:bg-[#222222] text-[#FFA4AB] border border-[#2c2c2c]',
    red:
      'bg-[#F32636] text-white hover:brightness-110 font-bold',
    blue:
      'bg-[#16B9E8] text-black hover:brightness-110 font-bold',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#A1A1AA] hover:text-white',
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
