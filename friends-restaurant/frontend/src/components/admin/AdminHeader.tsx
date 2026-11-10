import React, { useState, useEffect, useRef } from 'react';
import {
  LogOut,
  ExternalLink,
  QrCode,
  Shield,
  KeyRound,
  BookOpen,
  Bell,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { TableQRModal } from './TableQRModal';
import { AccountSecurityModal } from './AccountSecurityModal';
import { ManagerGuideModal } from './ManagerGuideModal';
import { LiveServiceBoardModal } from './LiveServiceBoardModal';
import { MerebaLogo } from '../common/MerebaLogo';
import { useServiceRequests } from '../../hooks/useMenu';
import { playServiceBellChime } from '../../utils/audio';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLiveBoardOpen, setIsLiveBoardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live service requests polling
  const { data: requests = [] } = useServiceRequests();
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const pendingCount = pendingRequests.length;
  const prevCountRef = useRef<number>(pendingCount);

  useEffect(() => {
    if (pendingCount > prevCountRef.current) {
      playServiceBellChime();
    }
    prevCountRef.current = pendingCount;
  }, [pendingCount]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#222222] px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_10px_32px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/admin" className="flex items-center gap-2 group" title="Mereba Friends Garden - Menu Manager">
              <MerebaLogo variant="wide" glow={false} className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform" />
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#222222]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#121212] border border-[#222222] font-headline text-[10px] text-white uppercase tracking-widest font-extrabold">
                  Menu Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Service Requests Call Bell (Always visible so alerts are never missed) */}
            <button
              onClick={() => setIsLiveBoardOpen(true)}
              className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                pendingCount > 0
                  ? 'bg-red-950/70 border border-red-500/50 text-red-200 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-[#141414] hover:bg-[#1f1f1f] text-[#d4d4d8] hover:text-white border border-[#262626]'
              }`}
              title="Live Table Service Requests"
            >
              <Bell className={`w-4 h-4 ${pendingCount > 0 ? 'text-red-400' : 'text-[#FFBD18]'}`} />
              <span className="hidden sm:inline">Table Service</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] font-black text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Desktop Only: Manager Operations Guide */}
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#d4d4d8] hover:text-white border border-[#262626] transition-all cursor-pointer"
              title="1-Page Operations Cheatsheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFBD18]" />
              <span>Manager Guide</span>
            </button>

            {/* Generate Table QR Codes Button (Always available) */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl bg-[#FFBD18] text-black hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.3)] transition-all cursor-pointer"
              title="Generate and Print Table QR Codes"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Table QRs</span>
            </button>

            {/* Desktop Only: View Menu Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#121212] hover:bg-[#1a1a1a] text-white border border-[#222222] hover:border-[#333333] transition-all"
              title="Open Customer Menu View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span>View Menu</span>
            </Link>

            {/* Desktop Only: Admin User / Security */}
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-[#3a3a3a] text-left transition-all cursor-pointer group"
              title="Change Admin Email & Password"
            >
              <div className="w-7 h-7 rounded-full bg-[#181818] group-hover:bg-[#FFBD18] group-hover:text-black flex items-center justify-center text-white transition-colors">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline text-xs font-bold text-white block leading-tight">
                    {user?.name || 'Manager'}
                  </span>
                  <KeyRound className="w-2.5 h-2.5 text-[#A1A1AA] group-hover:text-[#FFBD18]" />
                </div>
                <span className="text-[10px] text-[#A1A1AA] block leading-tight font-mono">
                  {user?.email || 'admin@friends.com'}
                </span>
              </div>
            </button>

            {/* Desktop Only: Logout Button */}
            <button
              onClick={logout}
              className="hidden md:flex px-3 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#121212] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#222222] hover:border-[#333333] transition-colors items-center gap-1.5 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Actions Drawer Toggle (Shown below md screens) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#141414] border border-[#262626] text-white hover:bg-[#1f1f1f] transition-colors"
              aria-label="Toggle manager actions menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#FFBD18]" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#222222] space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => {
                setIsGuideModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#121212] border border-[#222222] text-white font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <BookOpen className="w-4 h-4 text-[#FFBD18]" />
              <span>Manager Operations Guide</span>
            </button>

            <Link
              to="/"
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#121212] border border-[#222222] text-white font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <ExternalLink className="w-4 h-4 text-[#A1A1AA]" />
              <span>View Customer Menu</span>
            </Link>

            <button
              onClick={() => {
                setIsSecurityModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#121212] border border-[#222222] text-white text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#FFBD18]" />
                <div>
                  <div className="font-headline text-xs font-bold uppercase tracking-wider">
                    {user?.name || 'Manager'}
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] font-mono">
                    {user?.email || 'admin@friends.com'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-headline uppercase font-bold text-[#FFBD18] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                Change Password
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Dashboard</span>
            </button>
          </div>
        )}
      </header>

      {/* Live Table Service Board Modal */}
      <LiveServiceBoardModal
        isOpen={isLiveBoardOpen}
        onClose={() => setIsLiveBoardOpen(false)}
      />

      {/* Table QR Modal */}
      <TableQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      {/* Account Security Modal (Change Email & Password) */}
      <AccountSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Manager Operations Guide Modal */}
      <ManagerGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </>
  );
};
