import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface MerebaLogoProps {
  /**
   * 'full': Complete vertical emblem with arch, Ge'ez text (መረባ), tufted couch,
   *         F·R·I·E·N·D·S, ፍሬንድስ, and "WE'LL BE THERE FOR YOU"
   * 'nav': Sized for top navigation bar lockup
   * 'wide': Synonym for nav
   * 'couch': Standalone tufted couch with arch & Ge'ez text
   */
  variant?: 'full' | 'wide' | 'nav' | 'couch';
  className?: string;
  glow?: boolean;
  alt?: string;
}

export const MerebaLogo: React.FC<MerebaLogoProps> = ({
  variant = 'full',
  className = '',
  glow = true,
  alt = "F·R·I·E·N·D·S - Mereba Friends Garden (መረባ ፍሬንድስ)",
}) => {
  let isLightMode = false;
  try {
    const themeContext = useTheme();
    isLightMode = themeContext.isLightMode;
  } catch {
    // Graceful fallback if rendered outside ThemeProvider
  }

  const isNav = variant === 'nav' || variant === 'wide';
  const isCouchOnly = variant === 'couch';

  // Twin authentic assets with 100% identical pixel dimensions and transparent backgrounds
  const darkSrc = isCouchOnly
    ? '/assets/friends-logo-couch.png'
    : '/assets/friends-official-logo-white.png';

  const lightSrc = isCouchOnly
    ? '/assets/friends-logo-couch-black.png'
    : '/assets/friends-official-logo.png';

  const sizeClass = isNav
    ? 'h-11 sm:h-12 w-auto object-contain'
    : isCouchOnly
    ? 'h-12 sm:h-14 w-auto object-contain'
    : 'w-36 sm:w-44 md:w-48 h-auto object-contain mx-auto';

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Subtle warm cinematic backlight glow for dark luxury theme */}
      {glow && (
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,189,24,0.18)_0%,rgba(243,38,54,0.06)_45%,transparent_70%)] blur-2xl pointer-events-none scale-125 transition-opacity duration-500 ease-in-out ${
            isLightMode ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Dual-layered Cross-Fade Container: Eliminates any flash or jump during theme invert */}
      <div className="relative inline-flex items-center justify-center">
        {/* Dark Mode Version (White strokes on transparent) */}
        <img
          src={darkSrc}
          alt={alt}
          className={`relative z-10 transition-all duration-500 ease-in-out ${
            isLightMode
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] drop-shadow-[0_0_24px_rgba(255,189,24,0.22)]'
          } ${sizeClass}`}
          loading="eager"
        />

        {/* Light Mode Version (Jet-black strokes on transparent) - Cross-fades smoothly on top */}
        <img
          src={lightSrc}
          alt={alt}
          aria-hidden="true"
          className={`absolute inset-0 z-20 transition-all duration-500 ease-in-out ${
            isLightMode
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          } ${sizeClass}`}
          loading="eager"
        />
      </div>
    </div>
  );
};
