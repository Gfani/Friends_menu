import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, Sparkles, ExternalLink, Wifi } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MerebaLogo } from '../common/MerebaLogo';
import { useSiteSettings } from '../../hooks/useMenu';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({ isOpen, onClose }) => {
  const { data: settings } = useSiteSettings();
  const [selectedTable, setSelectedTable] = useState<string>('4');
  const [customTable, setCustomTable] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const printCardRef = useRef<HTMLDivElement>(null);

  const activeTable = customTable.trim() !== '' ? customTable.trim() : selectedTable;

  // Resolve host: prefer window.location.origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const targetUrl = `${baseUrl}/?table=${encodeURIComponent(activeTable)}`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, activeTable, targetUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Friends-Garden-Table-${activeTable}-QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#FFBD18]" />
          <span>Generate Table QR Cards</span>
        </div>
      }
      subtitle="Generate high-resolution printable QR codes for in-restaurant tables"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Table Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">
            Select Table Number:
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#0a0a0a] rounded-xl border border-[#222222]">
            {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setSelectedTable(num);
                  setCustomTable('');
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTable === num
                    ? 'bg-[#FFBD18] text-black shadow-glow-yellow'
                    : 'bg-[#181818] text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                #{num}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-zinc-500">Or custom label:</span>
            <input
              type="text"
              placeholder="e.g. Garden Patio 1, Bar 3"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              className="bg-[#0a0a0a] text-xs text-white px-3 py-1.5 rounded-lg border border-[#222222] focus:outline-none focus:border-[#FFBD18] flex-1"
            />
          </div>
        </div>

        {/* Printable Table Tent Preview Card */}
        <div className="flex justify-center">
          <div
            ref={printCardRef}
            className="w-full max-w-xs bg-[#0c0c0c] text-white p-6 rounded-3xl shadow-2xl border-2 border-[#262626] text-center space-y-4"
          >
            {/* Friends Official Master Logo on Table Card */}
            <div className="flex justify-center pt-2 pb-1">
              <MerebaLogo variant="full" className="w-36 h-auto mx-auto" />
            </div>

            <div className="py-1">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFBD18] text-black text-xs font-headline font-black tracking-widest uppercase shadow-[0_0_12px_rgba(255,189,24,0.4)]">
                TABLE #{activeTable}
              </span>
            </div>

            {/* QR Code image */}
            <div className="p-3 bg-white rounded-2xl inline-block shadow-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for Table ${activeTable}`}
                  className="w-44 h-44 mx-auto object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-zinc-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-headline text-xs font-extrabold text-white uppercase tracking-wider">
                Scan with Phone Camera
              </p>
              <p className="text-[10px] text-[#A1A1AA]">
                Browse Full Menu &bull; Call Waiter &bull; Instant Bill
              </p>
            </div>

            {/* Dynamic Wi-Fi callout at bottom of table card */}
            <div className="pt-3 border-t border-[#222222] text-[10px] text-[#A1A1AA] space-y-1 bg-[#141414] rounded-xl p-2.5">
              <div className="flex items-center justify-center gap-1.5 text-white font-semibold">
                <Wifi className="w-3.5 h-3.5 text-[#FFBD18]" />
                <span>Guest Wi-Fi Access</span>
              </div>
              <p className="font-mono text-zinc-300">
                Network: <span className="text-white font-bold">{settings?.wifiSsid || 'Mereba_Friends_Garden_5G'}</span>
              </p>
              <p className="font-mono text-zinc-300">
                Pass: <span className="text-[#FFBD18] font-bold">{settings?.wifiPassword || 'centralperkcoffee'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Target link display & Copy */}
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="truncate text-xs text-zinc-400 font-mono">
            {targetUrl}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-[#181818] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Copy URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#181818] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Open Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#222222]">
          <Button variant="secondary" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Download PNG
          </Button>
          <Button variant="yellow" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Table Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};

