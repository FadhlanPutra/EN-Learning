import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../services/itemService';
import { formatPrice } from '../utils/format';
import { useRequiredUser } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { FaTrophy, FaMedal, FaCrown, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Leaderboard() {
  const user = useRequiredUser();
  const { totalPoints, isLoading: progressLoading } = useProgress();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      // Mark current user
      const updatedData = data.map((entry) => ({
        ...entry,
        isCurrentUser: entry.userId === user.id,
      }));
      setLeaderboard(updatedData);
    } catch (err) {
      setError('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-amber-600 w-6 h-6" />;
      case 2:
        return <FaMedal className="text-gray-500 w-6 h-6" />;
      case 3:
        return <FaTrophy className="text-amber-700 w-6 h-6" />;
      default:
        return <span className="text-gray-500 font-bold w-6 text-right">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Leaderboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={loadLeaderboard} className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaTrophy className="text-amber-500" />
                Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Top groups by total balance</p>
            </div>
          </div>
        </div>

        {/* Current User Stats */}
        {user && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <FaUsers className="text-orange-700 dark:text-orange-400 w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Group</p>
                </div>
              </div>
              <div className="text-right">
                {progressLoading ? (
                  <div className="h-8 w-24 ml-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" aria-hidden="true" />
                ) : (
                  <p className="text-2xl font-bold text-orange-700">{formatPrice(totalPoints)}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    <FaUsers className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p>No groups yet. Be the first to play!</p>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => (
                  <tr
                    key={entry.userId || entry.username}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      entry.isCurrentUser ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      {getRankIcon(entry.rank)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
                          {(entry.username || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-medium ${entry.isCurrentUser ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                            {entry.username}
                            {entry.isCurrentUser && <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">You</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatPrice(entry.totalPoints)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty state message if user not in leaderboard */}
        {user && !leaderboard.some(e => e.username === user.username) && leaderboard.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Your group will appear here after answering the first question.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}