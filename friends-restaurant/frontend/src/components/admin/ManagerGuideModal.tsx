import React from 'react';
import {
  BookOpen,
  Printer,
  DollarSign,
  Eye,
  Wifi,
  QrCode,
  Shield,
  RotateCcw,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ManagerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerGuideModal: React.FC<ManagerGuideModalProps> = ({ isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FFBD18]" />
          <span>Friends Garden &bull; 1-Page Manager Operations Guide</span>
        </div>
      }
      subtitle="Quick reference cheatsheet for daily restaurant operations & menu updates"
      maxWidth="xl"
    >
      <div className="space-y-6 print:text-black">
        {/* Printable Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div>
            <h3 className="font-headline text-lg font-bold text-white">
              Restaurant Manager Cheatsheet
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Essential daily tasks &amp; instant live updates
            </p>
          </div>

          <Button
            variant="yellow"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-black" />}
          >
            Print Cheatsheet
          </Button>
        </div>

        {/* 6 Step Quick Reference Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Step 1: Instant Price Changes */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#FFBD18] font-headline font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>1. Change a Price in 5 Seconds</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              Go to <strong className="text-white">Dishes &amp; Live Pricing</strong>. Click the yellow price number next to any dish, enter the new price (ETB), and hit the green check. It updates on all customer phones instantly.
            </p>
          </div>

          {/* Step 2: Mark Out of Stock */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#16B9E8] font-headline font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>2. Sold Out / Pause Dish</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              When the kitchen runs out of ingredients, click the <strong className="text-white">Eye icon</strong> under "Menu Visibility". The dish is instantly hidden from the menu. Tap again to restore when restocked.
            </p>
          </div>

          {/* Step 3: Wi-Fi Password Update */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#FFBD18] font-headline font-bold uppercase tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>3. Change Guest Wi-Fi Password</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              Click <strong className="text-white">Customize Menu &amp; Live CMS</strong> &rarr; <strong className="text-white">Wi-Fi &amp; Story</strong> tab. Type your new network name or password and click "Save Wi-Fi Settings".
            </p>
          </div>

          {/* Step 4: Table QR Codes */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#16B9E8] font-headline font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>4. Table QR Stands</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              Click <strong className="text-white">Table QRs</strong> in the top navigation bar. Select Table #1 to #20, and click "Download High-Res QR" or print the table card for your acrylic stands.
            </p>
          </div>

          {/* Step 5: Admin Email & Password */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-white font-headline font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>5. Manager Login &amp; Security</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              Click your manager name pill in the top-right header to update your administrator email or change your login password. Customers cannot see or access this page.
            </p>
          </div>

          {/* Step 6: Restore Defaults */}
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#F32636] font-headline font-bold uppercase tracking-wider">
              <RotateCcw className="w-4 h-4" />
              <span>6. Made an Accidental Mistake?</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed">
              Don’t worry! In <strong className="text-white">Customize Menu &amp; Live CMS</strong>, scroll to the bottom and click <strong className="text-white">Restore Factory Defaults</strong> to safely revert all original settings.
            </p>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-[#d4d4d8]">
          <CheckCircle2 className="w-4 h-4 text-[#FFBD18] shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Keep a printed copy of this cheatsheet laminated near the cashier counter for new shifts and waiters.
          </span>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#222222]">
          <Button variant="secondary" onClick={onClose}>
            Close Guide
          </Button>
        </div>
      </div>
    </Modal>
  );
};
