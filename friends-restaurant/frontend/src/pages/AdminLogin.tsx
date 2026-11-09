import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 selection:bg-primary-container selection:text-on-primary-container">
      {/* Return to menu link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-headline text-xs uppercase tracking-wider text-outline hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Menu</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden">
        {/* Glow accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-tertiary-container to-primary-container" />

        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,189,24,0.15)_0%,transparent_70%)] blur-xl pointer-events-none" />
            <img
              src="/assets/friends-logo-white.png"
              alt="F.R.I.E.N.D.S - መረባ ፍሬንድስ"
              className="relative z-10 w-44 sm:w-52 h-auto object-contain mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
            />
          </div>

          <h1 className="font-headline text-lg font-bold text-on-surface uppercase tracking-wider">
            Staff &amp; Manager Console
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Sign in to manage dishes, live pricing, table QR codes, and customer requests.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-secondary-container/20 border border-secondary-container/40 rounded flex items-center gap-2 text-xs text-secondary">
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
            className="w-full text-on-primary-container mt-2 font-bold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center space-y-1.5">
          <span className="font-headline text-[10px] text-outline uppercase tracking-wider block">
            Default Seed Credentials
          </span>
          <div className="inline-block bg-surface-container border border-outline-variant/30 rounded px-3 py-1.5 text-xs font-mono text-on-surface">
            <span className="text-primary-container font-bold">admin@friends.com</span> / <span>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
