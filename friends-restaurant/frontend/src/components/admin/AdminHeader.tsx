import React, { useState } from 'react';
import { LogOut, ExternalLink, QrCode, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { TableQRModal } from './TableQRModal';
import { MerebaLogo } from '../common/MerebaLogo';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#222222] px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-3 group" title="Mereba Friends Garden - Menu Manager">
              <MerebaLogo variant="wide" glow={false} className="h-10 w-auto group-hover:scale-105 transition-transform" />
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#222222]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#121212] border border-[#222222] font-headline text-[10px] text-white uppercase tracking-widest font-extrabold">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl bg-[#FFBD18] text-black hover:brightness-110 shadow-[0_0_15px_rgba(255,189,24,0.3)] transition-all cursor-pointer"
              title="Generate and Print Table QR Codes"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>Table QRs</span>
            </button>

            {/* Customer Menu Link */}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#121212] hover:bg-[#1a1a1a] text-white border border-[#222222] hover:border-[#333333] transition-all"
              title="Open Customer Menu View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span className="hidden sm:inline">View Menu</span>
            </Link>

            {/* Admin User Info */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#121212] border border-[#222222]">
              <div className="w-7 h-7 rounded-full bg-[#181818] flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-headline text-xs font-bold text-white block leading-tight">
                  {user?.name || 'Manager'}
                </span>
                <span className="text-[10px] text-[#A1A1AA] block leading-tight font-mono">
                  {user?.email || 'admin@friends.com'}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#121212] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#222222] hover:border-[#333333] transition-colors flex items-center gap-1.5 cursor-pointer"
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
