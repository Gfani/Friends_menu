import React, { useState } from 'react';
import { Shield, KeyRound, Mail, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUpdateAdminProfile } from '../../hooks/useMenu';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AccountSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSecurityModal: React.FC<AccountSecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateAdminProfile();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initial state when modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setSuccessMessage('Account details updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update account';
      setErrorMessage(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Account & Security"
      subtitle="Update your administrator email address and change login password"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-green-950/40 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-green-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Name & Email */}
        <div className="space-y-3">
          <Input
            label="Display Name"
            placeholder="e.g. Friends Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4 text-[#A1A1AA]" />}
          />

          <Input
            label="Admin Email Address"
            type="email"
            placeholder="admin@friends.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4 text-[#A1A1AA]" />}
          />
        </div>

        {/* Password Change Section */}
        <div className="pt-3 border-t border-[#222222] space-y-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FFBD18]" />
            <span className="font-headline text-xs uppercase tracking-wider text-white font-bold">
              Change Password (Optional)
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            Leave password fields blank if you only want to change your name or email.
          </p>

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password to verify"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222222]">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="yellow"
            type="submit"
            isLoading={updateProfileMutation.isPending}
            leftIcon={<Shield className="w-4 h-4 text-black" />}
          >
            Save Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};

