import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { enterName, getCurrentUser, logout, subscribeAuth } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  enterName: (name: string) => Promise<User>;
  getCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u);
        setIsLoading(false);
      }
    });

    const unsubscribe = subscribeAuth((u) => {
      if (mounted) setUser(u);
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
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        enterName: handleEnterName,
        getCurrentUser,
        logout: handleLogout,
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