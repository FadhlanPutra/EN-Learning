import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Item, Attempt, ItemWithAnswers } from '../types';
import { getItemById, getItems } from '../services/itemService';
import { formatPrice } from '../utils/format';
import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';
import { MultipleChoiceQuestion, ShortAnswerQuestion, WordArrangeQuestion, GuessQuestion } from '../components/questions';
import { useProgress } from '../context/ProgressContext';
import { useToast } from '../context/ToastContext';
import { FaArrowLeft, FaLock, FaArrowRight } from 'react-icons/fa';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { attempts, submitAnswer: submitAnswerProgress, refreshProgress, isLoading: progressLoading } = useProgress();
  const { showToast } = useToast();

  const [item, setItem] = useState<Item | null>(null);
  const [fullItem, setFullItem] = useState<ItemWithAnswers | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  useEffect(() => {
    if (!submitting && item) {
      const existing = attempts.find((a) => a.itemId === item.id) || null;
      setAttempt(existing);
      setResult(
        existing
          ? { isCorrect: existing.isCorrect, correctAnswer: existing.correctAnswer }
          : null
      );
    }
  }, [attempts, item, submitting]);

  const loadItem = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getItemById(id);
      if (!data) {
        setError('Barang tidak ditemukan.');
        return;
      }
      setItem(data);

      const fullItemData = await getItemById(id);
      if (fullItemData) {
        setFullItem(fullItemData as ItemWithAnswers);
      }

      const existingAttempt = attempts.find((a) => a.itemId === data.id);
      if (existingAttempt) {
        setAttempt(existingAttempt);
        setResult({
          isCorrect: existingAttempt.isCorrect,
          correctAnswer: existingAttempt.correctAnswer,
        });
      }
    } catch (err) {
      setError('Gagal memuat barang.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer: string | string[]) => {
    if (!item) return;

    setSubmitting(true);
    try {
      const newAttempt = await submitAnswerProgress(item.id, answer);
      setAttempt(newAttempt);
      setResult({
        isCorrect: newAttempt.isCorrect,
        correctAnswer: newAttempt.correctAnswer,
      });

      showToast(
        newAttempt.isCorrect
          ? `Benar! Anda mendapat ${formatPrice(newAttempt.pointsEarned)} poin!`
          : 'Salah. Tidak mendapat poin.',
        newAttempt.isCorrect ? 'success' : 'error'
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim jawaban.';
      showToast(msg, 'error');

      if (msg.includes('sudah dijawab')) {
        await refreshProgress();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getNextItem = async () => {
    const allItems = await getItems();
    const currentIndex = allItems.findIndex(i => i.id === item?.id);
    if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
      navigate(`/item/${allItems[currentIndex + 1].id}`);
    } else {
      navigate('/shop');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-4 md:py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Barang Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Barang yang diminta tidak ada.'}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
            <FaArrowLeft className="w-5 h-5" />
            Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  const level = getLevel(item.price);
  const isAnswered = !!attempt;
  const isCorrect = attempt?.isCorrect;

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

  const categoryLabels: Record<string, string> = {
    vocabulary: 'Kosa kata',
    grammar: 'Tata bahasa',
    arrange: 'Menyusun',
    translate: 'Terjemahan',
    complete: 'Pelengkap',
    guess: 'Menebak',
  };

  const renderQuestion = () => {
    if (isAnswered) {
      return (
        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{isCorrect ? '🎉' : '😔'}</span>
            <h3 className={`text-lg font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {isCorrect ? 'Benar!' : 'Salah'}
            </h3>
            <span className="ml-auto text-lg font-bold text-orange-700 dark:text-orange-400">
              +{formatPrice(attempt?.pointsEarned || 0)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jawaban yang benar: <strong>{result?.correctAnswer || attempt?.correctAnswer}</strong>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={getNextItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors text-sm"
            >
              Soal Selanjutnya
              <FaArrowRight className="w-4 h-4" />
            </button>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <FaLock className="w-3 h-3" />
              Sudah dijawab
            </span>
          </div>
        </div>
      );
    }

    if (progressLoading) {
      return (
        <div className="space-y-3" aria-hidden="true">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      );
    }

    switch (item.type) {
      case 'multiple_choice':
        return <MultipleChoiceQuestion item={item} onSubmit={handleSubmit} disabled={submitting} />;
      case 'short_answer':
        return <ShortAnswerQuestion item={fullItem!} onSubmit={handleSubmit} disabled={submitting} />;
      case 'word_arrange':
        return <WordArrangeQuestion item={item} onSubmit={handleSubmit} disabled={submitting} />;
      case 'guess':
        return <GuessQuestion item={item} onSubmit={handleSubmit} disabled={submitting} />;
      default:
        return <div className="text-center py-8 text-gray-500">Tipe soal tidak dikenal</div>;
    }
  };

  return (
    <div className="min-h-screen py-4 md:py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Kembali ke Toko
        </Link>

        {/* Unified item card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {/* Left: item info + question */}
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center text-2xl opacity-90" aria-hidden="true">
                  {typeIcons[item.type] || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{item.name}</h1>
                    <span className="text-lg md:text-xl font-bold text-orange-700 dark:text-orange-400 whitespace-nowrap">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
                      {getLevelIcon(level)} {getLevelLabel(level)}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                </div>
              </div>

              {item.question ? (
                <p className="mt-4 text-xl md:text-2xl font-semibold leading-snug text-gray-900 dark:text-white">
                  {item.question}
                </p>
              ) : item.clue && item.type !== 'guess' ? (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    <strong>Petunjuk:</strong> {item.clue}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Right: answers / result */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8">
              {renderQuestion()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}