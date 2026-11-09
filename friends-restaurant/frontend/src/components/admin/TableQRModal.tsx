import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({ isOpen, onClose }) => {
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
            className="w-full max-w-xs bg-white text-black p-5 rounded-3xl shadow-2xl border-4 border-[#121212] text-center space-y-3"
          >
            {/* Friends Official Logo on Table Card */}
            <div className="flex justify-center pt-1">
              <img
                src="/assets/friends-logo.png"
                alt="F.R.I.E.N.D.S Logo"
                className="h-12 w-auto object-contain mx-auto"
              />
            </div>

            {/* Friends Brand Header on Card */}
            <div className="flex items-center justify-center gap-1">
              <span className="text-xl font-extrabold tracking-widest text-black">F</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F32636] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">R</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B9E8] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">I</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD18] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">E</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F32636] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">N</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD18] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B9E8] inline-block" />
              <span className="text-xl font-extrabold tracking-widest text-black">S</span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Mereba Friends Garden
            </p>

            <div className="py-1">
              <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-xs font-mono font-bold tracking-wider">
                TABLE #{activeTable}
              </span>
            </div>

            {/* QR Code image */}
            <div className="p-2 bg-zinc-50 rounded-2xl border-2 border-zinc-200 inline-block shadow-inner">
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

            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-black uppercase tracking-wider">
                Scan to View Menu & Call Waiter
              </p>
              <p className="text-[9px] text-zinc-500 italic">
                &ldquo;We&apos;ll be there for you.&rdquo;
              </p>
            </div>

            {/* Wi-Fi callout at bottom of table card */}
            <div className="pt-2 border-t border-zinc-200 text-[9px] text-zinc-600 space-y-0.5">
              <p>
                <strong>Wi-Fi:</strong> Mereba_Friends_Garden_5G
              </p>
              <p>
                <strong>Password:</strong> centralperkcoffee
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

