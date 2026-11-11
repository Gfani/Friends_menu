import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Wifi, Sparkles } from 'lucide-react';
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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const printCardRef = useRef<HTMLDivElement>(null);

  // Single unified URL for all dining tables and guest scans
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const targetUrl = `${baseUrl}/?scan=qr`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, targetUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Friends-Garden-Official-Menu-QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    const cardEl = printCardRef.current;
    if (!cardEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=700,height=950');
    if (!printWindow) {
      window.print();
      return;
    }

    const wifiSsid = settings?.wifiSsid || 'Mereba_Friends_Garden_5G';
    const wifiPassword = settings?.wifiPassword || 'centralperkcoffee';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mereba Friends Garden - Official Table QR Stand</title>
          <style>
            @page { size: auto; margin: 12mm; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #ffffff;
              color: #000000;
            }
            .acrylic-card {
              width: 320px;
              background-color: #0a0a0a !important;
              color: #ffffff !important;
              border: 3px solid #222222;
              border-radius: 28px;
              padding: 28px 24px;
              text-align: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            }
            .brand-name {
              font-size: 15px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #ffffff;
              margin: 8px 0 2px;
            }
            .brand-sub {
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 3px;
              color: #FFBD18;
              text-transform: uppercase;
              margin-bottom: 12px;
            }
            .badge {
              display: inline-block;
              background-color: #FFBD18 !important;
              color: #000000 !important;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 999px;
              margin-bottom: 16px;
            }
            .qr-wrapper {
              background: #ffffff !important;
              padding: 12px;
              border-radius: 20px;
              display: inline-block;
              margin-bottom: 14px;
            }
            .qr-wrapper img {
              width: 180px;
              height: 180px;
              display: block;
            }
            .instructions {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #ffffff;
              margin: 0 0 4px;
            }
            .sub-instructions {
              font-size: 9px;
              color: #a1a1aa;
              margin: 0 0 16px;
            }
            .wifi-box {
              background-color: #141414 !important;
              border-top: 1px solid #262626;
              border-radius: 14px;
              padding: 10px 12px;
              font-size: 10px;
              color: #d4d4d8;
              text-align: center;
            }
            .wifi-header {
              font-weight: 800;
              color: #ffffff;
              margin-bottom: 4px;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 1px;
            }
            .wifi-line {
              font-family: monospace;
              font-size: 10px;
              margin: 2px 0;
            }
            .highlight { color: #FFBD18; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="acrylic-card">
            <div class="brand-name">MEREBA FRIENDS GARDEN</div>
            <div class="brand-sub">መረባ ፍሬንድስ &bull; MEKELLE</div>
            <div>
              <span class="badge">SCAN FOR DIGITAL MENU</span>
            </div>
            <div class="qr-wrapper">
              <img src="${qrDataUrl}" alt="Menu QR Code" />
            </div>
            <p class="instructions">Point Your Camera to Browse</p>
            <p class="sub-instructions">Artisan Dishes &bull; Signature Cocktails &bull; Coffee</p>
            <div class="wifi-box">
              <div class="wifi-header">Guest Wi-Fi Access</div>
              <div class="wifi-line">Network: <strong>${wifiSsid}</strong></div>
              <div class="wifi-line">Password: <span class="highlight">${wifiPassword}</span></div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#FFBD18]" />
          <span>Official Restaurant QR Stand</span>
        </div>
      }
      subtitle="Print this single master QR card for tables, counters, and garden stands"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Printable Table Tent Preview Card */}
        <div className="flex justify-center">
          <div
            ref={printCardRef}
            className="w-full max-w-xs bg-[#0c0c0c] text-white p-6 rounded-3xl shadow-2xl border-2 border-[#262626] text-center space-y-4"
          >
            {/* Friends Official Master Vector Logo */}
            <div className="flex justify-center pt-2 pb-1">
              <MerebaLogo variant="full" className="w-36 h-auto mx-auto" />
            </div>

            <div className="py-0.5">
              <span className="inline-block px-4 py-1 rounded-full bg-[#FFBD18] text-black text-[11px] font-headline font-black tracking-widest uppercase shadow-[0_0_12px_rgba(255,189,24,0.4)]">
                SCAN FOR DIGITAL MENU
              </span>
            </div>

            {/* High-Resolution QR Code */}
            <div className="p-3 bg-white rounded-2xl inline-block shadow-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Official Friends Garden Menu QR Code"
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
                Scan with any Smartphone Camera
              </p>
              <p className="text-[10px] text-[#A1A1AA]">
                Browse Full Menu &bull; Artisan Dishes &bull; Refreshing Drinks
              </p>
            </div>

            {/* Dynamic Wi-Fi callout at bottom of table card */}
            <div className="pt-3 border-t border-[#222222] text-[10px] text-[#A1A1AA] space-y-1 bg-[#141414] rounded-xl p-2.5">
              <div className="flex items-center justify-center gap-1.5 text-white font-semibold">
                <Wifi className="w-3.5 h-3.5 text-[#FFBD18]" />
                <span>Complimentary Guest Wi-Fi</span>
              </div>
              <p className="font-mono text-zinc-300">
                Network: <span className="text-white font-bold">{settings?.wifiSsid || 'Mereba_Friends_Garden_5G'}</span>
              </p>
              <p className="font-mono text-zinc-300">
                Password: <span className="text-[#FFBD18] font-bold">{settings?.wifiPassword || 'centralperkcoffee'}</span>
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
            Download High-Res PNG
          </Button>
          <Button variant="yellow" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Stand Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};

