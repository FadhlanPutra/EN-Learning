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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || disabled || submitted) return;
    setSubmitted(true);
    onSubmit(answer.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Clue */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 mt-1">💡</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Clue</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-wrap">{item.clue}</p>
          </div>
        </div>
      </div>

      {/* Answer input */}
      <div>
        <label htmlFor="guess-answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Guess
        </label>
        <input
          id="guess-answer"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || submitted}
          className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
            disabled || submitted
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          } ${result ? (result.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : ''}`}
          placeholder="Type your guess..."
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>

      <button
        type="submit"
        disabled={!answer.trim() || disabled || submitted}
        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:hover:bg-gray-300 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {submitted ? 'Submitted' : 'Submit Guess'}
      </button>

      {result && (
        <div
          className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}
          role="alert"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.isCorrect ? '🎉' : '😔'}</span>
            <h4 className={`font-semibold ${result.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {result.isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The answer was: <strong>{result.correctAnswer}</strong>
          </p>
        </div>
      )}
    </form>
  );
}