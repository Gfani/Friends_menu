import React, { useState } from 'react';
import { LogOut, ExternalLink, QrCode, Shield, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { TableQRModal } from './TableQRModal';
import { MerebaLogo } from '../common/MerebaLogo';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#131316]/95 backdrop-blur-xl border-b border-[#2b2b34] px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-3 group" title="Mereba Friends Garden - Menu Manager">
              <MerebaLogo variant="wide" glow={false} className="h-10 w-auto group-hover:scale-105 transition-transform" />
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#30303a]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFBD18]/15 border border-[#FFBD18]/30 font-headline text-[10px] text-[#FFBD18] uppercase tracking-widest font-extrabold">
                  Menu Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Generate Table QR Codes Button */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-lg bg-[#FFBD18] text-black hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.3)] transition-all cursor-pointer"
              title="Generate and Print Table QR Codes"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>Table QRs</span>
            </button>

            {/* Customer Menu Link */}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-lg bg-[#1c1c22] hover:bg-[#25252e] text-[#ffe0aa] hover:text-white border border-[#383844] transition-all"
              title="Open Customer Menu View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#16B9E8]" />
              <span className="hidden sm:inline">View Menu</span>
            </Link>

            {/* Admin User Info */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#18181e] border border-[#2e2e38]">
              <div className="w-7 h-7 rounded-full bg-[#FFBD18]/15 flex items-center justify-center text-[#FFBD18]">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-headline text-xs font-bold text-white block leading-tight">
                  {user?.name || 'Manager'}
                </span>
                <span className="text-[10px] text-zinc-400 block leading-tight font-mono">
                  {user?.email || 'admin@friends.com'}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-lg bg-[#1c1c22] hover:bg-[#F32636]/20 hover:text-[#FFA4AB] hover:border-[#F32636]/40 text-zinc-300 border border-[#383844] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Table QR Modal */}
      <TableQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </>
  );
};
