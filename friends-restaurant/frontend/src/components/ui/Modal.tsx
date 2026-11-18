import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  let isLightMode = false;
  try {
    const themeContext = useTheme();
    isLightMode = themeContext.isLightMode;
  } catch {}

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* High-opacity backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Solid Opaque Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} ${
          isLightMode
            ? 'bg-white border border-zinc-200 shadow-2xl'
            : 'bg-[#121212] border border-[#222222] shadow-[0_24px_56px_rgba(0,0,0,0.95)]'
        } rounded-t-3xl sm:rounded-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col transition-all duration-300 transform translate-y-0`}
      >
        {/* Top visual grabber for mobile */}
        <div className={`sm:hidden flex justify-center pt-3 pb-1 ${isLightMode ? 'bg-zinc-100' : 'bg-[#0a0a0a]'}`}>
          <div className={`w-12 h-1 rounded-full ${isLightMode ? 'bg-zinc-300' : 'bg-[#262626]'}`} />
        </div>

        {/* Solid Opaque Header */}
        <div className={`flex items-start justify-between p-5 pb-4 border-b ${
          isLightMode ? 'border-zinc-200 bg-zinc-50' : 'border-[#222222] bg-[#0a0a0a]'
        }`}>
          <div>
            {typeof title === 'string' ? (
              <h3 className={`font-headline text-lg sm:text-xl uppercase tracking-wider font-bold leading-tight ${
                isLightMode ? 'text-zinc-900' : 'text-white'
              }`}>
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className={`font-body text-xs mt-1 leading-normal ${
                isLightMode ? 'text-zinc-600' : 'text-[#A1A1AA]'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ml-3 ${
              isLightMode
                ? 'text-zinc-500 hover:text-black hover:bg-zinc-200'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className={`p-5 overflow-y-auto ${
          isLightMode ? 'bg-white text-zinc-700' : 'bg-[#121212] text-[#A1A1AA]'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};
