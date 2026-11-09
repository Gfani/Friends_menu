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
        <div className="text-center space-y-2 mb-6">
          <img
            src="https://lh3.googleusercontent.com/aida/ALJJyrDUr9Msf7Rqm_xrgJk3zZrkdpeOrE-c1lC2_A-j4OKxzMBp6I4bibtzvT_w1OqHHkn-0lziRaVWAxMZgxaB3oVgXL6k1LeiYXmNt9o6Hr_h032NTfUS2xfu3t3LdZqIY3S3ekiA1pgztls8hPtxmdMphFdw0Z51dI3Ge8rPUtHLT5qrnGDjRtNDhxVL_KzURJVH4eTEwkt_zStL7ldsBaW2F2KK4Kvq3tOkF65Xzbtq"
            alt="F.R.I.E.N.D.S Logo"
            className="h-10 w-auto object-contain mx-auto mb-2"
          />

          <div className="flex items-center justify-center gap-1">
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">F</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">R</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">I</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">E</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">N</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">D</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            <span className="font-headline text-2xl font-bold tracking-widest text-primary">S</span>
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
