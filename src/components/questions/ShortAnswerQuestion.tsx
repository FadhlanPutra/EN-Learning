import { useState, FormEvent, KeyboardEvent } from 'react';
import { ItemWithAnswers } from '../../types';

interface ShortAnswerQuestionProps {
  item: ItemWithAnswers;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  result?: { isCorrect: boolean; correctAnswer: string } | null;
}

export function ShortAnswerQuestion({ onSubmit, disabled, result }: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || disabled || submitted) return;
    setSubmitted(true);
    onSubmit(answer.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="short-answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jawaban Anda
        </label>
        <textarea
          id="short-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || submitted}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors resize-none ${
            disabled || submitted
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          } ${result ? (result.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : ''}`}
          placeholder="Ketik jawaban Anda di sini..."
          aria-describedby={result ? 'result-message' : undefined}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Tekan Enter untuk mengirim (Shift+Enter untuk baris baru)
        </p>
      </div>

      <button
        type="submit"
        disabled={!answer.trim() || disabled || submitted}
        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:hover:bg-gray-300 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {submitted ? 'Dikirim' : 'Kirim Jawaban'}
      </button>

      {result && (
        <div
          id="result-message"
          className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}
          role="alert"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.isCorrect ? '🎉' : '😔'}</span>
            <h4 className={`font-semibold ${result.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {result.isCorrect ? 'Benar!' : 'Salah'}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jawaban yang benar: <strong>{result.correctAnswer}</strong>
          </p>
        </div>
      )}
    </form>
  );
}