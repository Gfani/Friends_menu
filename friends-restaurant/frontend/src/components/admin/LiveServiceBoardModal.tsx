import React from 'react';
import {
  Bell,
  Check,
  Receipt,
  CreditCard,
  Banknote,
  Volume2,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useServiceRequests, useResolveServiceRequest } from '../../hooks/useMenu';
import { playServiceBellChime } from '../../utils/audio';

interface LiveServiceBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveServiceBoardModal: React.FC<LiveServiceBoardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: requests = [], isLoading } = useServiceRequests();
  const resolveMutation = useResolveServiceRequest();

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED').slice(0, 5);

  const handleResolve = async (id: string) => {
    await resolveMutation.mutateAsync(id);
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FFBD18]" />
          <span>Live Table Service Board</span>
        </div>
      }
      subtitle="Real-time alerts when customers call a waiter or request their bill"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Header Controls: Counter + Test Chime */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="font-headline text-xs uppercase tracking-wider text-[#A1A1AA] font-bold">
              Active Pending Calls:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFBD18] text-black font-headline font-extrabold text-xs">
              {pendingRequests.length}
            </span>
          </div>

          <button
            type="button"
            onClick={playServiceBellChime}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#262626] text-xs text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
            title="Test Table Alert Chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FFBD18]" />
            <span>Test Chime</span>
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin" />
          </div>
        )}

        {/* Active Pending Requests List */}
        {!isLoading && pendingRequests.length > 0 && (
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const isBill = req.type === 'REQUEST_BILL';

              return (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#0a0a0a] border-2 border-[#FFBD18]/40 shadow-[0_0_15px_rgba(255,189,24,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Table Badge */}
                      <span className="font-headline text-sm font-black px-3 py-1 rounded-lg bg-[#FFBD18] text-black uppercase tracking-wider">
                        Table #{req.tableNumber}
                      </span>

                      {/* Request Type Badge */}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-headline font-bold uppercase tracking-wider border flex items-center gap-1 ${
                          isBill
                            ? 'bg-[#16B9E8]/10 text-[#16B9E8] border-[#16B9E8]/30'
                            : 'bg-[#FFBD18]/10 text-[#FFBD18] border-[#FFBD18]/30'
                        }`}
                      >
                        {isBill ? <Receipt className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        <span>{isBill ? 'Request Bill' : 'Call Waiter'}</span>
                      </span>

                      {/* Payment Method Badge */}
                      {req.paymentMethod && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white font-mono flex items-center gap-1">
                          {req.paymentMethod === 'CASH' ? (
                            <Banknote className="w-3 h-3 text-[#FFBD18]" />
                          ) : (
                            <CreditCard className="w-3 h-3 text-[#16B9E8]" />
                          )}
                          <span>{req.paymentMethod}</span>
                        </span>
                      )}

                      {/* Time */}
                      <span className="text-[10px] text-[#71717A] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(req.createdAt)}</span>
                      </span>
                    </div>

                    {/* Customer Notes */}
                    {req.notes && (
                      <p className="text-xs text-[#d4d4d8] flex items-center gap-1.5 pt-1 italic">
                        <MessageSquare className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
                        <span>&ldquo;{req.notes}&rdquo;</span>
                      </p>
                    )}
                  </div>

                  {/* Mark Completed Button */}
                  <Button
                    variant="yellow"
                    size="sm"
                    onClick={() => handleResolve(req.id)}
                    isLoading={resolveMutation.isPending}
                    leftIcon={<Check className="w-4 h-4 text-black font-extrabold" />}
                    className="shrink-0"
                  >
                    Done
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pendingRequests.length === 0 && (
          <div className="py-12 text-center bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-2">
            <Check className="w-8 h-8 text-green-400 mx-auto" />
            <h4 className="font-headline text-base font-bold text-white uppercase tracking-wider">
              All Tables Attended
            </h4>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
              No pending waiter calls right now. When customers seated at a table tap &ldquo;Call Waiter&rdquo; or &ldquo;Request Bill&rdquo;, requests will appear here with an audio chime.
            </p>
          </div>
        )}

        {/* Recently Attended History */}
        {completedRequests.length > 0 && (
          <div className="pt-4 border-t border-[#222222] space-y-2">
            <span className="font-headline text-[10px] uppercase tracking-wider text-[#71717A] font-bold block">
              Recently Attended Tables
            </span>
            <div className="space-y-1.5">
              {completedRequests.map((r) => (
                <div
                  key={r.id}
                  className="px-3 py-2 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] flex items-center justify-between text-xs text-[#71717A]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-400">Table #{r.tableNumber}</span>
                    <span>&bull;</span>
                    <span>{r.type === 'REQUEST_BILL' ? 'Bill Request' : 'Table Assistance'}</span>
                  </div>
                  <span className="text-[10px] text-green-500 font-semibold">Completed</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#222222]">
          <Button variant="secondary" onClick={onClose}>
            Close Board
          </Button>
        </div>
      </div>
    </Modal>
  );
};

