import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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
      {/* High-opacity dark backdrop - completely blocks background yellow bleeding */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Solid Opaque Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#151518] border border-[#2b2b33] rounded-t-3xl sm:rounded-2xl shadow-[0_24px_56px_rgba(0,0,0,0.95)] overflow-hidden z-10 max-h-[90vh] flex flex-col transition-all duration-300 transform translate-y-0`}
      >
        {/* Top visual grabber for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 bg-[#121215]">
          <div className="w-12 h-1 bg-[#35353d] rounded-full" />
        </div>

        {/* Solid Opaque Header: High Contrast, Sharp White Text */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-[#24242c] bg-[#121215]">
          <div>
            {typeof title === 'string' ? (
              <h3 className="font-headline text-lg sm:text-xl uppercase tracking-wider text-white font-bold leading-tight">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="font-body text-xs text-[#a1a1aa] mt-1 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#202026] transition-colors shrink-0 ml-3"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area (Opaque Dark Background) */}
        <div className="p-5 overflow-y-auto bg-[#151518] text-[#e4e1e6]">
          {children}
        </div>
      </div>
    </div>
  );
};
