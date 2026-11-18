import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomerMenu } from './pages/CustomerMenu';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('friends_live_menu_cache');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FFBD18] mb-4 text-xl">
            ☕
          </div>
          <h2 className="font-headline text-lg font-bold">Mereba Friends Garden</h2>
          <p className="text-xs text-[#A1A1AA] mt-1 mb-6">Reconnecting to digital menu...</p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2.5 bg-[#FFBD18] text-black font-headline text-xs uppercase font-extrabold rounded-full hover:brightness-110 cursor-pointer shadow-lg"
          >
            Reload Menu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer QR Mobile View */}
                <Route path="/" element={<CustomerMenu />} />

                {/* Admin Authentication Screen */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Management Dashboard (Strictly Protected) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
