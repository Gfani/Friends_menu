import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-headline text-[11px] uppercase tracking-wider font-bold text-zinc-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[#18181f] text-white placeholder:text-zinc-500 text-sm rounded-lg border border-[#383844] px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-[#FFBD18] focus:ring-1 focus:ring-[#FFBD18] disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${error ? 'border-[#F32636] focus:border-[#F32636]' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-zinc-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#FFA4AB] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-headline text-[11px] uppercase tracking-wider font-bold text-zinc-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full bg-[#18181f] text-white placeholder:text-zinc-500 text-sm rounded-lg border border-[#383844] px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-[#FFBD18] focus:ring-1 focus:ring-[#FFBD18] disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-[#F32636] focus:border-[#F32636]' : ''
          } ${className}`}
          rows={3}
          {...props}
        />
        {error && <p className="text-xs text-[#FFA4AB] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-400">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
