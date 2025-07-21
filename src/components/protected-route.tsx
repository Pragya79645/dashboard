"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Authenticating...
            </h2>
            <p className="text-muted-foreground font-medium">
              Please wait while we verify your session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
