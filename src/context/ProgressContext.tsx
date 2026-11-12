import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Attempt } from '../types';
import { submitAnswer, getMyAttempts, getHistory } from '../services/itemService';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  attempts: Attempt[];
  totalPoints: number;
  accuracy: number;
  isLoading: boolean;
  submitAnswer: (itemId: string, answer: string | string[]) => Promise<Attempt>;
  getMyAttempts: () => Promise<Attempt[]>;
  getHistory: (userId: string) => Promise<Attempt[]>;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setAttempts([]);
      setTotalPoints(0);
      setAccuracy(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const history = await getHistory(user.id);
      setAttempts(history);

      const points = history.reduce((sum, a) => sum + a.pointsEarned, 0);
      setTotalPoints(points);

      if (history.length > 0) {
        const correct = history.filter((a) => a.isCorrect).length;
        setAccuracy(Math.round((correct / history.length) * 100));
      } else {
        setAccuracy(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const handleSubmitAnswer = useCallback(
    async (itemId: string, answer: string | string[]): Promise<Attempt> => {
      if (!user) throw new Error('User not authenticated');

      const { attempt } = await submitAnswer(user.id, itemId, answer);
      await refreshProgress();
      return attempt;
    },
    [user, refreshProgress]
  );

  const handleGetMyAttempts = useCallback(async (): Promise<Attempt[]> => {
    return getMyAttempts();
  }, []);

  const handleGetHistory = useCallback(
    async (userId: string): Promise<Attempt[]> => {
      return getHistory(userId);
    },
    []
  );

  return (
    <ProgressContext.Provider
      value={{
        attempts,
        totalPoints,
        accuracy,
        isLoading,
        submitAnswer: handleSubmitAnswer,
        getMyAttempts: handleGetMyAttempts,
        getHistory: handleGetHistory,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}