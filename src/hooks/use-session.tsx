'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
};

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const session = localStorage.getItem('user-session');
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (error) {
        console.error("Failed to parse user session", error)
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-session');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    handleLogout,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
