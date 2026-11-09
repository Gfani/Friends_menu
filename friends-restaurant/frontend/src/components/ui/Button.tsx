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
      'bg-primary-container text-on-primary-container hover:brightness-110 shadow-glow-yellow',
    yellow:
      'bg-primary-container text-on-primary-container hover:brightness-110 shadow-glow-yellow',
    accent:
      'bg-surface-container-low text-primary-container border border-outline-variant/30 hover:border-primary-container/60 hover:bg-surface-container',
    secondary:
      'bg-surface-container-high text-on-surface hover:text-white border border-outline-variant/30 hover:border-primary-container/50',
    outline:
      'bg-transparent hover:bg-white/5 text-on-surface border border-outline-variant/40 hover:border-primary-container/60',
    danger:
      'bg-secondary-container/20 hover:bg-secondary-container/30 text-secondary border border-secondary-container/40 shadow-glow-red',
    red:
      'bg-secondary-container text-white hover:brightness-110 shadow-glow-red',
    blue:
      'bg-tertiary-container text-on-tertiary-container hover:brightness-110 shadow-glow-blue',
    ghost:
      'bg-transparent hover:bg-white/5 text-on-surface-variant hover:text-on-surface',
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
