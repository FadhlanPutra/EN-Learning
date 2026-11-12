import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { User } from '../types';
import { enterName, getCurrentUser, logout, subscribeAuth } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  enterName: (name: string) => Promise<User>;
  getCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u);
        setIsLoading(false);
      }
    });

    const unsubscribe = subscribeAuth((u) => {
      if (mounted) {
        if (!u && wasAuthenticated.current) {
          setSessionExpired(true);
        }
        if (u) wasAuthenticated.current = true;
        setUser(u);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleEnterName = useCallback(async (name: string): Promise<User> => {
    const newUser = await enterName(name);
    setUser(newUser);
    return newUser;
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    await logout();
    setUser(null);
    setSessionExpired(false);
    wasAuthenticated.current = false;
  }, []);

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessionExpired,
        enterName: handleEnterName,
        getCurrentUser,
        logout: handleLogout,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequiredUser(): User {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    throw new Error('useRequiredUser used during auth loading');
  }
  if (!user) {
    throw new Error('useRequiredUser used outside protected route');
  }
  return user;
}