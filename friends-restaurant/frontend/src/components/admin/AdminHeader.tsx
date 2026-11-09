import React, { useState } from 'react';
import { LogOut, ExternalLink, Bell, QrCode, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useServiceRequests } from '../../hooks/useMenu';
import { TableQRModal } from './TableQRModal';

interface AdminHeaderProps {
  onOpenServiceRequests?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenServiceRequests }) => {
  const { user, logout } = useAuth();
  const { data: serviceRequests = [] } = useServiceRequests();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const pendingRequestsCount = serviceRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 group">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrDUr9Msf7Rqm_xrgJk3zZrkdpeOrE-c1lC2_A-j4OKxzMBp6I4bibtzvT_w1OqHHkn-0lziRaVWAxMZgxaB3oVgXL6k1LeiYXmNt9o6Hr_h032NTfUS2xfu3t3LdZqIY3S3ekiA1pgztls8hPtxmdMphFdw0Z51dI3Ge8rPUtHLT5qrnGDjRtNDhxVL_KzURJVH4eTEwkt_zStL7ldsBaW2F2KK4Kvq3tOkF65Xzbtq"
                alt="F.R.I.E.N.D.S Logo"
                className="h-8 w-auto object-contain"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-bold text-primary text-base tracking-wider">
                    F.R.I.E.N.D.S
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                </div>
                <span className="font-headline text-[9px] text-outline uppercase tracking-widest block">
                  Mereba Garden &bull; Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Generate Table QR Codes Button */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline font-semibold uppercase tracking-wider rounded bg-surface-container-high hover:bg-surface-container-highest text-primary-container border border-primary-container/30 transition-all"
              title="Print Table QR Tents"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table QRs</span>
            </button>

            {/* Service Requests Alert Badge */}
            {onOpenServiceRequests && (
              <button
                onClick={onOpenServiceRequests}
                className={`relative p-2 rounded border transition-all flex items-center gap-1.5 ${
                  pendingRequestsCount > 0
                    ? 'bg-secondary-container/20 border-secondary-container/50 text-secondary animate-pulse'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-white'
                }`}
                title="Table Service Alerts"
              >
                <Bell className="w-4 h-4" />
                {pendingRequestsCount > 0 && (
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 bg-secondary-container text-white rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            )}

            {/* Customer Menu Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline font-semibold uppercase tracking-wider rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white border border-outline-variant/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-tertiary" />
              <span>Customer View</span>
            </Link>

            {/* Admin User Info */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container border border-outline-variant/30">
              <Shield className="w-3.5 h-3.5 text-primary-container" />
              <div className="text-left">
                <span className="font-headline text-xs font-bold text-on-surface block leading-none">
                  {user?.name || 'Manager'}
                </span>
                <span className="text-[10px] text-outline block leading-none mt-0.5 font-mono">
                  {user?.email || 'admin@friends.com'}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-headline font-semibold uppercase tracking-wider rounded bg-surface-container hover:bg-secondary-container/20 hover:text-secondary text-on-surface-variant border border-outline-variant/30 transition-colors flex items-center gap-1.5"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Table QR Codes Generator Modal */}
      <TableQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </>
  );
};
