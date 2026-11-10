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
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-[#FFBD18] selection:text-black">
      {/* Return to menu link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-headline text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Menu</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#121212] border border-[#222222] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <MerebaLogo variant="full" className="w-40 sm:w-48" />
          </div>

          <h1 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
            Menu Manager Console
          </h1>
          <p className="font-body text-xs text-[#A1A1AA]">
            Sign in to manage dishes, live pricing, sections, and table QR codes.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-xs text-[#FFA4AB]">
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
            className="w-full mt-2 font-extrabold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-4 border-t border-[#222222] text-center space-y-1.5">
          <span className="font-headline text-[10px] text-[#71717A] uppercase tracking-widest font-bold block">
            Default Credentials
          </span>
          <div className="inline-block bg-[#0a0a0a] border border-[#222222] rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-300">
            <span className="text-white font-bold">admin@friends.com</span> / <span>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
