import React, { useState } from 'react';
import {
  Bell,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Send,
  X,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { useCallService } from '../../hooks/useMenu';
import { Language } from '../../i18n/translations';

interface CallServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTableNumber?: string | null;
  currentLang?: Language;
}

export const CallServiceModal: React.FC<CallServiceModalProps> = ({
  isOpen,
  onClose,
  initialTableNumber,
  currentLang = 'en',
}) => {
  const [tableNumber, setTableNumber] = useState(initialTableNumber || '');
  const [serviceType, setServiceType] = useState<'CALL_WAITER' | 'REQUEST_BILL'>('CALL_WAITER');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TELEBIRR' | 'CBE_BIRR'>('TELEBIRR');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const callServiceMutation = useCallService();

  // Sync initial table
  React.useEffect(() => {
    if (initialTableNumber) {
      setTableNumber(initialTableNumber);
    }
  }, [initialTableNumber]);

  // Reset state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage(null);
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setErrorMessage('Please enter your table number.');
      return;
    }

    setErrorMessage(null);

    try {
      await callServiceMutation.mutateAsync({
        tableNumber: tableNumber.trim(),
        type: serviceType,
        paymentMethod: serviceType === 'REQUEST_BILL' ? paymentMethod : undefined,
        notes: notes.trim() || undefined,
      });

      // Save table to local storage for convenience
      localStorage.setItem('friends_table_number', tableNumber.trim());

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to alert staff. Please try again or wave to a waiter.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FFBD18]" />
          <span>Table Assistance &amp; Bill Request</span>
        </div>
      }
      subtitle="Instantly notify our garden lounge staff directly from your table"
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-[#FFBD18]/10 border border-[#FFBD18]/30 text-[#FFBD18] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[#FFBD18]" />
          </div>
          <h3 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
            Staff Notified!
          </h3>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto leading-relaxed">
            A waiter is on their way to <strong className="text-white">Table #{tableNumber}</strong>. We&apos;ll be there for you!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Table Number */}
          <Input
            label="Your Table Number"
            type="text"
            placeholder="e.g. 4 or Garden 2"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            autoFocus={!tableNumber}
          />

          {/* Service Choice Switcher */}
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              What do you need?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setServiceType('CALL_WAITER')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  serviceType === 'CALL_WAITER'
                    ? 'bg-[#FFBD18] text-black border-[#FFBD18] font-bold shadow-[0_0_15px_rgba(255,189,24,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-headline text-xs uppercase tracking-wider">
                  Call Waiter
                </span>
                <span className="text-[10px] opacity-80">Cutlery, order, help</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('REQUEST_BILL')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  serviceType === 'REQUEST_BILL'
                    ? 'bg-[#16B9E8] text-black border-[#16B9E8] font-bold shadow-[0_0_15px_rgba(22,185,232,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Receipt className="w-5 h-5" />
                <span className="font-headline text-xs uppercase tracking-wider">
                  Request Bill
                </span>
                <span className="text-[10px] opacity-80">Ready to pay</span>
              </button>
            </div>
          </div>

          {/* Payment Method Selector (if requesting bill) */}
          {serviceType === 'REQUEST_BILL' && (
            <div className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-2 animate-in fade-in">
              <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-[#A1A1AA]">
                Preferred Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('TELEBIRR')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    paymentMethod === 'TELEBIRR'
                      ? 'bg-[#16B9E8] text-black border-[#16B9E8]'
                      : 'bg-[#161616] text-[#A1A1AA] border-[#282828] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Telebirr</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CBE_BIRR')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    paymentMethod === 'CBE_BIRR'
                      ? 'bg-[#7E3AED] text-white border-[#7E3AED]'
                      : 'bg-[#161616] text-[#A1A1AA] border-[#282828] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>CBE Birr</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    paymentMethod === 'CASH'
                      ? 'bg-[#FFBD18] text-black border-[#FFBD18]'
                      : 'bg-[#161616] text-[#A1A1AA] border-[#282828] hover:text-white'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <TextArea
            label="Special Note for Staff (Optional)"
            placeholder="e.g. Please bring extra napkins, water glasses, or sauce..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="yellow"
              type="submit"
              isLoading={callServiceMutation.isPending}
              leftIcon={<Send className="w-4 h-4 text-black" />}
            >
              Send Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

