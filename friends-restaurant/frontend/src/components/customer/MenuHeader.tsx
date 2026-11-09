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
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_20px_48px_rgba(0,0,0,0.65)] border-b border-outline-variant/20">
        <div className="h-20 max-w-[1320px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrDUr9Msf7Rqm_xrgJk3zZrkdpeOrE-c1lC2_A-j4OKxzMBp6I4bibtzvT_w1OqHHkn-0lziRaVWAxMZgxaB3oVgXL6k1LeiYXmNt9o6Hr_h032NTfUS2xfu3t3LdZqIY3S3ekiA1pgztls8hPtxmdMphFdw0Z51dI3Ge8rPUtHLT5qrnGDjRtNDhxVL_KzURJVH4eTEwkt_zStL7ldsBaW2F2KK4Kvq3tOkF65Xzbtq"
                alt="F.R.I.E.N.D.S Restaurant Logo Dark"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline text-headline-sm uppercase tracking-wider text-primary group-hover:text-primary-fixed transition-colors hidden sm:inline-block font-semibold">
                F.R.I.E.N.D.S
              </span>
            </a>

            {/* Table Badge (If scanned via QR) */}
            {tableNumber && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-primary-container/30 text-[11px] font-headline uppercase font-bold tracking-wider text-primary-container">
                <MapPin className="w-3 h-3 text-primary-container" />
                <span>Table #{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-headline text-xs uppercase tracking-widest">
            <a href="#hero" className="text-primary hover:text-primary-fixed transition-colors py-1">
              Home
            </a>
            <a href="#menu-section" className="text-on-surface-variant hover:text-on-surface transition-colors py-1">
              Our Menu
            </a>
            <a href="#about-section" className="text-on-surface-variant hover:text-on-surface transition-colors py-1">
              About Us
            </a>
            <a href="#gallery-section" className="text-on-surface-variant hover:text-on-surface transition-colors py-1">
              Atmosphere
            </a>
            <a href="#location-section" className="text-on-surface-variant hover:text-on-surface transition-colors py-1">
              Location &amp; Hours
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Wi-Fi Button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high border border-tertiary-container/30 text-tertiary text-xs font-headline uppercase font-semibold tracking-wider transition-all"
              title="Complimentary Wi-Fi"
            >
              <Wifi className="w-3.5 h-3.5 text-tertiary-container" />
              <span className="hidden sm:inline">Free Wi-Fi</span>
            </button>

            {/* Staff / Admin Portal */}
            <Link
              to="/admin"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:brightness-110 transition-all shrink-0"
              title="Staff & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-primary py-1"
            >
              Home
            </a>
            <a
              href="#menu-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant hover:text-white py-1"
            >
              Our Menu
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant hover:text-white py-1"
            >
              About Us
            </a>
            <a
              href="#gallery-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant hover:text-white py-1"
            >
              Atmosphere &amp; Plates
            </a>
            <a
              href="#location-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant hover:text-white py-1"
            >
              Location &amp; Operating Hours
            </a>
            <div className="pt-2 border-t border-outline-variant/20 flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWifiModalOpen(true);
                }}
                leftIcon={<Wifi className="w-3.5 h-3.5" />}
              >
                Connect to Free Wi-Fi
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Modal: Free Wi-Fi Details with High-Contrast Text */}
      <Modal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#16B9E8]/20 border border-[#16B9E8]/40 flex items-center justify-center text-[#16B9E8]">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <span className="font-headline text-base sm:text-lg uppercase tracking-wider text-white font-bold">
              Complimentary High-Speed Wi-Fi
            </span>
          </div>
        }
        subtitle="Enjoy uninterrupted connection in our garden & lounge"
      >
        <div className="space-y-4">
          <div className="bg-[#1a1a20] border border-[#2c2c36] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm">
            <div>
              <span className="font-sans text-[10px] text-[#8e8e96] uppercase tracking-[0.15em] font-semibold block">
                Network (SSID)
              </span>
              <p className="font-headline text-base sm:text-lg font-bold text-white tracking-wide mt-0.5">
                Mereba_Friends_Garden_5G
              </p>
            </div>

            <div className="pt-3 border-t border-[#26262e] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-sans text-[10px] text-[#8e8e96] uppercase tracking-[0.15em] font-semibold block">
                  Password
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#FFBD18] tracking-widest bg-[#121215] px-3 py-1.5 rounded-lg border border-[#2b2b34] mt-0.5 inline-block select-all">
                  centralperkcoffee
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyWifi}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFBD18] hover:bg-[#ffca36] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0"
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

          <div className="p-3.5 bg-[#16B9E8]/10 border border-[#16B9E8]/25 rounded-xl flex items-start gap-2.5">
            <Wifi className="w-4 h-4 text-[#16B9E8] shrink-0 mt-0.5" />
            <p className="text-xs text-[#a0e8fd] leading-relaxed">
              Select <strong className="text-white font-bold">Mereba_Friends_Garden_5G</strong> in your Wi-Fi settings and paste the password above.
            </p>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-[#222227] hover:bg-[#2c2c33] text-white font-headline uppercase tracking-wider text-xs font-bold border border-white/10 transition-colors"
            onClick={() => setIsWifiModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};
