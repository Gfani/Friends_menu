import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wifi,
  Check,
  Copy,
  MapPin,
  Menu as MenuIcon,
  X,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MerebaLogo } from '../common/MerebaLogo';
import { useSiteSettings } from '../../hooks/useMenu';
import { Language, translations } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

interface MenuHeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  currentLang = 'en',
  onLanguageChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlTable = searchParams.get('table');

  const { data: settings } = useSiteSettings();
  const t = translations[currentLang];
  const { isLightMode, toggleTheme } = useTheme();

  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    return urlTable || localStorage.getItem('friends_table_number') || null;
  });

  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  useEffect(() => {
    if (urlTable) {
      setTableNumber(urlTable);
      localStorage.setItem('friends_table_number', urlTable);
    }
  }, [urlTable]);

  const wifiSsid = settings?.wifiSsid || 'Mereba_Friends_Garden_5G';
  const wifiPassword = settings?.wifiPassword || 'friends2025';

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  const handleLangSelect = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    localStorage.setItem('friends_language', lang);
  };

  return (
    <>
      {/* FIXED NAVIGATION BAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        isLightMode
          ? 'bg-white/95 border-b border-[#E5E7EB] text-zinc-900 shadow-sm'
          : 'bg-[#050505]/90 border-b border-[#222222] text-white shadow-[0_12px_32px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="h-20 max-w-[1320px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Official Logo Lockup */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center group" title={settings?.restaurantName || 'Mereba Friends Garden'}>
              <MerebaLogo variant="wide" glow={false} className="group-hover:scale-105 transition-transform" />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-headline text-xs uppercase tracking-widest">
            <a href="#hero" className={`transition-colors py-1 font-semibold ${isLightMode ? 'text-black hover:text-zinc-600' : 'text-white hover:text-white'}`}>
              {t.home}
            </a>
            <a href="#menu-section" className={`transition-colors py-1 font-medium ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}>
              {t.ourMenu}
            </a>
            <a href="#about-section" className={`transition-colors py-1 font-medium ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}>
              {t.aboutUs}
            </a>
            <a href="#gallery-section" className={`transition-colors py-1 font-medium ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}>
              {t.atmosphere}
            </a>
            <a href="#location-section" className={`transition-colors py-1 font-medium ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}>
              {t.locationHours}
            </a>
          </nav>

          {/* Right Actions: Language Switcher + Theme Invert Button + Free Wi-Fi */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher Bar */}
            <div className={`inline-flex items-center p-1 rounded-full border transition-colors ${
              isLightMode ? 'bg-[#F1F3F5] border-[#E5E7EB]' : 'bg-[#121212] border-[#262626]'
            }`}>
              <button
                type="button"
                onClick={() => handleLangSelect('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#FFBD18] text-black shadow-sm font-extrabold'
                    : isLightMode
                      ? 'text-zinc-600 hover:text-black'
                      : 'text-[#A1A1AA] hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('ti')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-headline font-bold transition-all cursor-pointer ${
                  currentLang === 'ti'
                    ? 'bg-[#FFBD18] text-black shadow-sm font-extrabold'
                    : isLightMode
                      ? 'text-zinc-600 hover:text-black'
                      : 'text-[#A1A1AA] hover:text-white'
                }`}
                title="ትግርኛ"
              >
                ትግ
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('am')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-headline font-bold transition-all cursor-pointer ${
                  currentLang === 'am'
                    ? 'bg-[#FFBD18] text-black shadow-sm font-extrabold'
                    : isLightMode
                      ? 'text-zinc-600 hover:text-black'
                      : 'text-[#A1A1AA] hover:text-white'
                }`}
                title="አማርኛ"
              >
                አማ
              </button>
            </div>

            {/* THEME INVERT ICON: Placed between Language and WiFi */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isLightMode
                  ? 'bg-[#F1F3F5] hover:bg-zinc-200 border-[#E5E7EB] text-zinc-900 shadow-sm'
                  : 'bg-[#121212] hover:bg-[#1c1c1c] border-[#262626] text-[#FFBD18] hover:text-white shadow-sm'
              }`}
              title={isLightMode ? 'Invert to Dark Mode' : 'Invert color to Light Mode'}
              aria-label={isLightMode ? 'Invert to Dark Mode' : 'Invert color to Light Mode'}
            >
              {isLightMode ? (
                <Moon className="w-4 h-4 text-zinc-800 transition-transform duration-300 hover:-rotate-12" />
              ) : (
                <Sun className="w-4 h-4 text-[#FFBD18] transition-transform duration-300 hover:rotate-45" />
              )}
            </button>

            {/* Free Wi-Fi Button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-headline uppercase font-semibold tracking-wider transition-all cursor-pointer ${
                isLightMode
                  ? 'bg-[#F1F3F5] hover:bg-zinc-200 border-[#E5E7EB] text-zinc-800 shadow-sm'
                  : 'bg-[#121212] hover:bg-[#1a1a1a] border-[#222222] hover:border-[#333333] text-[#A1A1AA] hover:text-white'
              }`}
              title={t.freeWifi}
            >
              <Wifi className="w-3.5 h-3.5 text-[#FFBD18]" />
              <span className="hidden sm:inline">{t.freeWifi}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isLightMode
                  ? 'bg-[#F1F3F5] border-[#E5E7EB] text-zinc-900 hover:bg-zinc-200'
                  : 'bg-[#121212] border-[#222222] text-white hover:bg-[#1c1c1c]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-b px-4 py-4 space-y-3 font-headline text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-2 ${
            isLightMode ? 'bg-white border-[#E5E7EB] text-zinc-900 shadow-md' : 'bg-[#080808] border-[#222222] text-white'
          }`}>
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 ${isLightMode ? 'text-black hover:text-zinc-600' : 'text-white hover:text-white'}`}
            >
              {t.home}
            </a>
            <a
              href="#menu-section"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              {t.ourMenu}
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              {t.aboutUs}
            </a>
            <a
              href="#gallery-section"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              {t.atmosphere}
            </a>
            <a
              href="#location-section"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 ${isLightMode ? 'text-zinc-600 hover:text-black' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              {t.locationHours}
            </a>

            <div className={`pt-2 border-t flex gap-2 ${isLightMode ? 'border-zinc-200' : 'border-[#222222]'}`}>
              <Button
                variant={isLightMode ? "outline" : "secondary"}
                size="sm"
                className={`w-full ${isLightMode ? 'text-zinc-900 border-zinc-300 hover:bg-zinc-100' : 'text-white'}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWifiModalOpen(true);
                }}
                leftIcon={<Wifi className="w-3.5 h-3.5 text-[#FFBD18]" />}
              >
                {t.guestWifi}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Modal: Free Wi-Fi Details */}
      <Modal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[#FFBD18] ${
              isLightMode ? 'bg-amber-50 border-amber-200' : 'bg-[#1a1a1a] border-[#2c2c2c]'
            }`}>
              <Wifi className="w-4 h-4 text-[#FFBD18]" />
            </div>
            <span className={`font-headline text-base sm:text-lg uppercase tracking-wider font-bold ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              {t.guestWifi}
            </span>
          </div>
        }
        subtitle="Enjoy high-speed connection in our garden lounge"
      >
        <div className="space-y-4">
          <div className={`border rounded-xl p-4 sm:p-5 space-y-3.5 ${
            isLightMode ? 'bg-zinc-50 border-zinc-200' : 'bg-[#0a0a0a] border-[#222222]'
          }`}>
            <div>
              <span className={`font-sans text-[10px] uppercase tracking-[0.15em] font-semibold block ${
                isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
              }`}>
                Network (SSID)
              </span>
              <p className={`font-headline text-base sm:text-lg font-bold tracking-wide mt-0.5 ${
                isLightMode ? 'text-zinc-900' : 'text-white'
              }`}>
                {wifiSsid}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-3 ${
              isLightMode ? 'border-zinc-200' : 'border-[#1c1c1c]'
            }`}>
              <div className="min-w-0">
                <span className={`font-sans text-[10px] uppercase tracking-[0.15em] font-semibold block ${
                  isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
                }`}>
                  Password
                </span>
                <p className={`font-mono text-sm sm:text-base font-bold tracking-widest px-3 py-1.5 rounded-lg border mt-0.5 inline-block select-all ${
                  isLightMode ? 'bg-white text-zinc-900 border-zinc-300' : 'bg-[#121212] text-white border-[#222222]'
                }`}>
                  {wifiPassword}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyWifi}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFBD18] hover:brightness-110 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer"
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>{t.passwordCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>{t.copyPassword}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${isLightMode ? 'text-zinc-600' : 'text-[#A1A1AA]'}`}>
            Select <strong className={`font-semibold ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>{wifiSsid}</strong> in your device settings and paste the credentials above.
          </p>

          <button
            type="button"
            className={`w-full py-2.5 rounded-lg font-headline uppercase tracking-wider text-xs font-bold border transition-colors cursor-pointer ${
              isLightMode ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300' : 'bg-[#181818] hover:bg-[#222222] text-white border-[#282828]'
            }`}
            onClick={() => setIsWifiModalOpen(false)}
          >
            {t.close}
          </button>
        </div>
      </Modal>
    </>
  );
};
