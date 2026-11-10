import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wifi,
  Check,
  Copy,
  MapPin,
  Menu as MenuIcon,
  X,
  Lock,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MerebaLogo } from '../common/MerebaLogo';

export const MenuHeader: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlTable = searchParams.get('table');

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

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('centralperkcoffee');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  return (
    <>
      {/* FIXED NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] border-b border-[#222222]">
        <div className="h-20 max-w-[1320px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Official Logo Lockup */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center group" title="Mereba Friends Garden">
              <MerebaLogo variant="wide" glow={false} className="group-hover:scale-105 transition-transform" />
            </a>

            {/* Table Badge (If scanned via QR) */}
            {tableNumber && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-[11px] font-headline uppercase font-bold tracking-wider text-white">
                <MapPin className="w-3 h-3 text-[#FFBD18]" />
                <span>Table #{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-headline text-xs uppercase tracking-widest">
            <a href="#hero" className="text-white hover:text-white transition-colors py-1 font-semibold">
              Home
            </a>
            <a href="#menu-section" className="text-[#A1A1AA] hover:text-white transition-colors py-1 font-medium">
              Our Menu
            </a>
            <a href="#about-section" className="text-[#A1A1AA] hover:text-white transition-colors py-1 font-medium">
              About Us
            </a>
            <a href="#gallery-section" className="text-[#A1A1AA] hover:text-white transition-colors py-1 font-medium">
              Atmosphere
            </a>
            <a href="#location-section" className="text-[#A1A1AA] hover:text-white transition-colors py-1 font-medium">
              Location &amp; Hours
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Wi-Fi Button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] hover:border-[#333333] text-[#A1A1AA] hover:text-white text-xs font-headline uppercase font-semibold tracking-wider transition-all"
              title="Complimentary Wi-Fi"
            >
              <Wifi className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span className="hidden sm:inline">Free Wi-Fi</span>
            </button>

            {/* Staff / Admin Portal */}
            <Link
              to="/admin"
              className="w-8 h-8 rounded-full bg-[#121212] border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all shrink-0"
              title="Staff & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A1A1AA] hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#050505] border-t border-[#222222] px-6 py-5 space-y-3.5 animate-in slide-in-from-top-2">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-white py-1 font-bold"
            >
              Home
            </a>
            <a
              href="#menu-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white py-1"
            >
              Our Menu
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white py-1"
            >
              About Us
            </a>
            <a
              href="#gallery-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white py-1"
            >
              Atmosphere &amp; Plates
            </a>
            <a
              href="#location-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white py-1"
            >
              Location &amp; Operating Hours
            </a>
            <div className="pt-2 border-t border-[#222222] flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-white"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWifiModalOpen(true);
                }}
                leftIcon={<Wifi className="w-3.5 h-3.5 text-white" />}
              >
                Connect to Free Wi-Fi
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
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2c2c2c] flex items-center justify-center text-white">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="font-headline text-base sm:text-lg uppercase tracking-wider text-white font-bold">
              Complimentary Wi-Fi
            </span>
          </div>
        }
        subtitle="Enjoy high-speed connection in our garden lounge"
      >
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-3.5">
            <div>
              <span className="font-sans text-[10px] text-[#A1A1AA] uppercase tracking-[0.15em] font-semibold block">
                Network (SSID)
              </span>
              <p className="font-headline text-base sm:text-lg font-bold text-white tracking-wide mt-0.5">
                Mereba_Friends_Garden_5G
              </p>
            </div>

            <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-sans text-[10px] text-[#A1A1AA] uppercase tracking-[0.15em] font-semibold block">
                  Password
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-white tracking-widest bg-[#121212] px-3 py-1.5 rounded-lg border border-[#222222] mt-0.5 inline-block select-all">
                  centralperkcoffee
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyWifi}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFBD18] hover:brightness-110 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0"
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Select <strong className="text-white font-semibold">Mereba_Friends_Garden_5G</strong> in your device settings and paste the credentials above.
          </p>

          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-white font-headline uppercase tracking-wider text-xs font-bold border border-[#282828] transition-colors"
            onClick={() => setIsWifiModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};
