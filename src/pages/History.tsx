import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Attempt } from '../types';
import { getHistory } from '../services/itemService';
import { formatPrice, formatDate } from '../utils/format';
import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';
import { useRequiredUser } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { FaArrowLeft, FaCheckCircle, FaTimes } from 'react-icons/fa';

export function History() {
  const user = useRequiredUser();
  const { totalPoints, accuracy, isLoading: progressLoading } = useProgress();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(user.id);
      setAttempts(data);
    } catch (err) {
      setError('Gagal memuat riwayat.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded-xl" />
              <div className="h-20 bg-gray-200 rounded-xl" />
              <div className="h-20 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Riwayat</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={loadHistory} className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const typeIcons: Record<string, string> = {
    multiple_choice: '📝',
    short_answer: '✏️',
    word_arrange: '🔤',
    guess: '🔍',
  };

  const typeLabels: Record<string, string> = {
    multiple_choice: 'Pilihan ganda',
    short_answer: 'Isian singkat',
    word_arrange: 'Susun kata',
    guess: 'Tebak',
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Riwayat</h1>
              <p className="text-gray-600">Soal yang sudah dijawab</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                {progressLoading ? (
                  <div className="h-8 w-20 mx-auto bg-gray-200 rounded animate-pulse" aria-hidden="true" />
                ) : (
                  <p className="text-2xl font-bold text-orange-700">{formatPrice(totalPoints)}</p>
                )}
                <p className="text-sm text-gray-600">Total Poin</p>
              </div>
              <div className="w-px h-8 bg-gray-200 mx-2" />
              <div className="text-center">
                {progressLoading ? (
                  <div className="h-8 w-14 mx-auto bg-gray-200 rounded animate-pulse" aria-hidden="true" />
                ) : (
                  <p className="text-2xl font-bold text-green-700">{accuracy}%</p>
                )}
                <p className="text-sm text-gray-600">Akurasi</p>
              </div>
              <div className="w-px h-8 bg-gray-200 mx-2" />
              <div className="text-center">
                {progressLoading ? (
                  <div className="h-8 w-12 mx-auto bg-gray-200 rounded animate-pulse" aria-hidden="true" />
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{attempts.length}</p>
                )}
                <p className="text-sm text-gray-600">Soal</p>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        {attempts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Belum ada riwayat</h2>
            <p className="text-gray-600 mb-6">Mulai menjawab soal untuk melihat riwayat di sini.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
              Ke Toko
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const level = attempt.item?.level || getLevel(attempt.pointsEarned || 0);
              const isCorrect = attempt.isCorrect;

              return (
                <div
                  key={attempt.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Status & Type */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {isCorrect ? <FaCheckCircle className="text-green-700 w-6 h-6" /> : <FaTimes className="text-red-600 w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{attempt.item?.name || `Soal #${attempt.itemId}`}</p>
                          <p className="text-sm text-gray-500">{typeLabels[attempt.item?.type || ''] || 'Soal'}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Level</p>
                          <p className="font-medium text-gray-900">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getLevelColor(level)}`}>
                              {getLevelIcon(level)} {getLevelLabel(level)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tipe</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <span>{typeIcons[attempt.item?.type || ''] || '📝'}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Poin</p>
                          <p className="font-bold text-orange-700">{formatPrice(attempt.pointsEarned)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tanggal</p>
                          <p className="font-medium text-gray-900">{formatDate(attempt.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Correct answer display */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <strong>Jawaban yang benar:</strong> {attempt.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}