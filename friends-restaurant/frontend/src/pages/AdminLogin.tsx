import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MerebaLogo } from '../components/common/MerebaLogo';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@friends.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] flex flex-col justify-center items-center p-4 selection:bg-[#FFBD18] selection:text-black">
      {/* Return to menu link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-headline text-xs uppercase tracking-wider text-zinc-400 hover:text-[#FFBD18] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Menu</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#16161b] border border-[#2b2b34] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F32636] via-[#16B9E8] to-[#FFBD18]" />

        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <MerebaLogo variant="full" className="w-40 sm:w-48" />
          </div>

          <h1 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
            Menu Manager Console
          </h1>
          <p className="font-body text-xs text-zinc-300">
            Sign in to manage dishes, live pricing, sections, and table QR codes.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@friends.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            variant="yellow"
            size="lg"
            type="submit"
            className="w-full mt-2 font-bold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-4 border-t border-[#2b2b34] text-center space-y-1.5">
          <span className="font-headline text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
            Default Credentials
          </span>
          <div className="inline-block bg-[#18181f] border border-[#383844] rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200">
            <span className="text-[#FFBD18] font-bold">admin@friends.com</span> / <span>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
