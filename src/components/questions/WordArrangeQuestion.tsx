import { useState, KeyboardEvent, FormEvent } from 'react';
import { Item } from '../../types';

interface WordArrangeQuestionProps {
  item: Item;
  onSubmit: (answer: string[]) => void;
  disabled?: boolean;
  result?: { isCorrect: boolean; correctAnswer: string } | null;
}

export function WordArrangeQuestion({ item, onSubmit, disabled, result }: WordArrangeQuestionProps) {
  const [availableTiles, setAvailableTiles] = useState<string[]>([]);
  const [answerTiles, setAnswerTiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const tiles = item.tiles || [];

  if (availableTiles.length === 0 && tiles.length > 0) {
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
  }

  const moveToAnswer = (index: number) => {
    if (disabled || submitted) return;
    const tile = availableTiles[index];
    setAvailableTiles((prev) => prev.filter((_, i) => i !== index));
    setAnswerTiles((prev) => [...prev, tile]);
  };

  const moveToAvailable = (index: number) => {
    if (disabled || submitted) return;
    const tile = answerTiles[index];
    setAnswerTiles((prev) => prev.filter((_, i) => i !== index));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleUndo = () => {
    if (disabled || submitted || answerTiles.length === 0) return;
    const lastTile = answerTiles[answerTiles.length - 1];
    setAnswerTiles((prev) => prev.slice(0, -1));
    setAvailableTiles((prev) => [...prev, lastTile]);
  };

  const handleReset = () => {
    if (disabled || submitted) return;
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setAnswerTiles([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (answerTiles.length === 0 || disabled || submitted) return;
    setSubmitted(true);
    onSubmit(answerTiles);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, _tile: string, source: 'available' | 'answer', index: number) => {
    if (disabled || submitted) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (source === 'available') {
        moveToAnswer(index);
      } else {
        moveToAvailable(index);
      }
    }
  };

  const isComplete = answerTiles.length === tiles.length && tiles.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jawaban Anda (ketuk tile di bawah untuk menambah)
        </label>

        <div
          className={`min-h-[56px] p-2.5 border-2 rounded-lg flex flex-wrap gap-1.5 items-start transition-colors ${
            disabled || submitted
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : 'border-dashed border-gray-400 dark:border-gray-500 hover:border-orange-500'
          } ${result ? (result.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : ''}`}
          role="list"
          aria-label="Jawaban Anda"
        >
          {answerTiles.length === 0 && !disabled && !submitted && (
            <p className="text-gray-500 text-center w-full py-4 text-sm">
              Ketuk tile di bawah untuk menyusun jawaban
            </p>
          )}
          {answerTiles.map((tile, index) => (
            <button
              key={`${tile}-${index}`}
              type="button"
              onClick={() => moveToAvailable(index)}
              onKeyDown={(e) => handleKeyDown(e, tile, 'answer', index)}
              disabled={disabled || submitted}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                disabled || submitted
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-900/50'
              } ${result ? (result.isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200') : ''}`}
              role="listitem"
              aria-pressed="true"
            >
              {tile}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={disabled || submitted || answerTiles.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↩ Urungkan
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || submitted || answerTiles.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↻ Atur Ulang
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kata tersedia
        </label>
        <div
          className="flex flex-wrap gap-1.5"
          role="list"
          aria-label="Kata tersedia"
        >
          {availableTiles.map((tile, index) => (
            <button
              key={`${tile}-${index}`}
              type="button"
              onClick={() => moveToAnswer(index)}
              onKeyDown={(e) => handleKeyDown(e, tile, 'available', index)}
              disabled={disabled || submitted}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                disabled || submitted
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
              role="listitem"
              aria-pressed="false"
            >
              {tile}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isComplete || disabled || submitted}
        className="w-full py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {submitted ? 'Terkirim' : 'Kirim Jawaban'}
      </button>

      {result && (
        <div
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