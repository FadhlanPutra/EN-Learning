import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Item, Attempt, ItemWithAnswers } from '../types';
import { getItemById, getItems } from '../services/itemService';
import { formatPrice } from '../utils/format';
import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';
import { MultipleChoiceQuestion, ShortAnswerQuestion, WordArrangeQuestion, GuessQuestion } from '../components/questions';
import { PointsBadge } from '../components';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useToast } from '../context/ToastContext';
import { FaArrowLeft, FaLock, FaArrowRight } from 'react-icons/fa';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { attempts, submitAnswer: submitAnswerProgress, refreshProgress } = useProgress();
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
      
      // Get full item with answers for question components (short_answer)
      const fullItemData = await getItemById(id);
      // For short_answer, we need acceptedAnswers from server. 
      // We'll fetch from the service - but for now just use the item itself
      if (fullItemData) {
        // We can't get acceptedAnswers from public API, so we'll handle in component
        setFullItem(fullItemData as ItemWithAnswers);
      }
      
      if (isAuthenticated && user) {
        const existingAttempt = attempts.find((a) => a.itemId === data.id);
        if (existingAttempt) {
          setAttempt(existingAttempt);
          setResult({
            isCorrect: existingAttempt.isCorrect,
            correctAnswer: existingAttempt.correctAnswer,
          });
        }
      }
    } catch (err) {
      setError('Gagal memuat barang.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer: string | string[]) => {
    if (!user || !item) return;
    
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
      
      // If already answered, reload attempts to show locked state
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
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-pulse max-w-3xl mx-auto px-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Item Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The requested item does not exist.'}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <FaArrowLeft className="w-5 h-5" />
            Back to Shop
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

  const categoryLabels: Record<string, string> = {
    vocabulary: 'Kosa Kata',
    grammar: 'Tata Bahasa',
    arrange: 'Menyusun',
    translate: 'Menerjemahkan',
    complete: 'Melengkapi',
    guess: 'Menebak',
  };

  // Render question component based on type
  const renderQuestion = () => {
    if (isAnswered) {
      return (
        <div className={`p-6 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{isCorrect ? '🎉' : '😔'}</span>
            <div>
              <h3 className={`text-xl font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {isCorrect ? 'Benar!' : 'Salah'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Jawaban yang benar: <strong>{result?.correctAnswer || attempt?.correctAnswer}</strong>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatPrice(attempt?.pointsEarned || 0)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Poin Didapat</p>
            </div>
          </div>
        </div>
      );
    }

    // Not answered yet - show question component
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
        return <div className="text-center py-8 text-gray-500">Unknown question type</div>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
          Kembali ke Toko
        </Link>

        {/* Item Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
            <span className="text-8xl opacity-80">{typeIcons[item.type] || '📦'}</span>
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
                {getLevelIcon(level)} {getLevelLabel(level)}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatPrice(item.price)}</span>
                <PointsBadge points={item.price} showLabel={false} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                {categoryLabels[item.category] || item.category}
              </span>
              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                {item.type.replace('_', ' ')}
              </span>
            </div>

            {item.question && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{item.question}</p>
            )}

            {item.clue && !item.question && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Petunjuk:</strong> {item.clue}</p>
              </div>
            )}
          </div>
        </div>

        {/* Question Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {renderQuestion()}
        </div>

        {/* Next Item Button */}
        {isAnswered && (
          <div className="mt-6 text-center">
            <button
              onClick={getNextItem}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Soal Selanjutnya
              <FaArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Locked Message */}
        {isAnswered && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
            <FaLock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              Soal ini sudah dijawab dan terkunci. Anda tidak bisa menjawabnya lagi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}