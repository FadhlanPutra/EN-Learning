import { useState, FormEvent, KeyboardEvent } from 'react';
import { Item } from '../../types';

interface GuessQuestionProps {
  item: Item;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  result?: { isCorrect: boolean; correctAnswer: string } | null;
}

export function GuessQuestion({ item, onSubmit, disabled, result }: GuessQuestionProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || disabled || result) return;
    onSubmit(answer.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const buttonLabel = result
    ? 'Submitted'
    : disabled
      ? 'Submitting...'
      : 'Submit Guess';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">💡</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-amber-800 mb-1">Clue</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{item.clue}</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="guess-answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Guess
        </label>
        <input
          id="guess-answer"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || !!result}
          className={`w-full px-4 py-3 border-2 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
            disabled || result
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400'
          } ${result ? (result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}`}
          placeholder="Type your guess..."
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>

      <button
        type="submit"
        disabled={!answer.trim() || disabled || !!result}
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