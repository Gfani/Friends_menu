import React from 'react';

export interface MerebaLogoProps {
  /**
   * 'full': Complete vertical emblem with arch, Ge'ez text (መረባ), tufted couch,
   *         F·R·I·E·N·D·S, ፍሬንድስ, and "WE'LL BE THERE FOR YOU"
   * 'wide': Horizontal lockup for navigation bars (couch on left, typography on right)
   * 'couch': Standalone tufted couch with arch & Ge'ez text
   */
  variant?: 'full' | 'wide' | 'couch';
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
  const getAssetSrc = () => {
    switch (variant) {
      case 'wide':
        return '/assets/friends-logo-wide-white.png';
      case 'couch':
        return '/assets/friends-logo-couch.png';
      case 'full':
      default:
        return '/assets/friends-logo-white.png';
    }
  };

  const getDefaultClasses = () => {
    switch (variant) {
      case 'wide':
        return 'h-11 sm:h-12 md:h-13 w-auto object-contain';
      case 'couch':
        return 'h-14 sm:h-16 w-auto object-contain';
      case 'full':
      default:
        return 'w-64 sm:w-80 md:w-96 h-auto object-contain mx-auto';
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none">
      {/* Subtle warm cinematic backlight glow for dark luxury theme */}
      {glow && (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,189,24,0.18)_0%,rgba(243,38,54,0.06)_45%,transparent_70%)] blur-2xl pointer-events-none scale-125"
          aria-hidden="true"
        />
      )}

      {/* Restored Authentic Artwork */}
      <img
        src={getAssetSrc()}
        alt={alt}
        className={`relative z-10 transition-transform duration-300 drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] drop-shadow-[0_0_24px_rgba(255,189,24,0.22)] ${getDefaultClasses()} ${className}`}
        loading="eager"
      />
    </div>
  );
};
