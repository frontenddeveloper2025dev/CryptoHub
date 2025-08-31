import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { LoginModal } from './LoginModal';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Authentication Required</h3>
            <p className="text-muted-foreground max-w-md">
              Please sign in to access your portfolio and watchlist features.
            </p>
            <Button onClick={() => setShowLoginModal(true)} className="mt-4">
              Sign In
            </Button>
          </div>
        )}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return <>{children}</>;
}