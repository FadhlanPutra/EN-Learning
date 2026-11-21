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
  const [tilesInitialized, setTilesInitialized] = useState(false);

  const tiles = item.tiles || [];

  if (!tilesInitialized && tiles.length > 0) {
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setTilesInitialized(true);
  }

  const moveToAnswer = (index: number) => {
    if (disabled || result) return;
    const tile = availableTiles[index];
    setAvailableTiles((prev) => prev.filter((_, i) => i !== index));
    setAnswerTiles((prev) => [...prev, tile]);
  };

  const moveToAvailable = (index: number) => {
    if (disabled || result) return;
    const tile = answerTiles[index];
    setAnswerTiles((prev) => prev.filter((_, i) => i !== index));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleUndo = () => {
    if (disabled || result || answerTiles.length === 0) return;
    const lastTile = answerTiles[answerTiles.length - 1];
    setAnswerTiles((prev) => prev.slice(0, -1));
    setAvailableTiles((prev) => [...prev, lastTile]);
  };

  const handleReset = () => {
    if (disabled || result) return;
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setAnswerTiles([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (answerTiles.length === 0 || disabled || result) return;
    onSubmit(answerTiles);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, _tile: string, source: 'available' | 'answer', index: number) => {
    if (disabled || result) return;
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

  const buttonLabel = result
    ? 'Submitted'
    : disabled
      ? 'Submitting...'
      : 'Submit Answer';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer (tap tiles below to add)
        </label>

        <div
          className={`min-h-[56px] p-2.5 border-2 rounded-lg flex flex-wrap gap-1.5 items-start transition-colors ${
            disabled || result
              ? 'bg-gray-100 border-gray-200'
              : 'border-dashed border-gray-400 hover:border-orange-500'
          } ${result ? (result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}`}
          role="list"
          aria-label="Your answer"
        >
          {answerTiles.length === 0 && !disabled && !result && (
            <p className="text-gray-500 text-center w-full py-4 text-sm">
              Tap tiles below to arrange your answer
            </p>
          )}
          {answerTiles.map((tile, index) => (
            <button
              key={`${tile}-${index}`}
              type="button"
              onClick={() => moveToAvailable(index)}
              onKeyDown={(e) => handleKeyDown(e, tile, 'answer', index)}
              disabled={disabled || !!result}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                disabled || result
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              } ${result ? (result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}
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
            disabled={disabled || !!result || answerTiles.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↩ Undo
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || !!result || answerTiles.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available words
        </label>
        <div
          className="flex flex-wrap gap-1.5"
          role="list"
          aria-label="Available words"
        >
          {availableTiles.map((tile, index) => (
            <button
              key={`${tile}-${index}`}
              type="button"
              onClick={() => moveToAnswer(index)}
              onKeyDown={(e) => handleKeyDown(e, tile, 'available', index)}
              disabled={disabled || !!result}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                disabled || result
                  ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-900 border border-gray-300 hover:border-orange-500 hover:bg-orange-50'
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
        disabled={!isComplete || disabled || !!result}
        className="w-full py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {buttonLabel}
      </button>

      {result && (
        <div
          className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          role="alert"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.isCorrect ? '🎉' : '😔'}</span>
            <h4 className={`font-semibold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {result.isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
          </div>
          <p className="text-sm text-gray-600">
            Correct answer: <strong>{result.correctAnswer}</strong>
          </p>
        </div>
      )}
    </form>
  );
}