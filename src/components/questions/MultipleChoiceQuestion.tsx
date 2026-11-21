import { useState, KeyboardEvent } from 'react';
import { Item, Choice } from '../../types';

interface MultipleChoiceQuestionProps {
  item: Item;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  result?: { isCorrect: boolean; correctAnswer: string } | null;
}

export function MultipleChoiceQuestion({ item, onSubmit, disabled, result }: MultipleChoiceQuestionProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoiceChange = (choiceId: string) => {
    if (disabled || result) return;
    setSelectedChoice(choiceId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChoice || disabled || result) return;
    onSubmit(selectedChoice);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, choiceId: string) => {
    if (disabled || result) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChoiceChange(choiceId);
    }
  };

  const choices = item.choices || [];

  const buttonLabel = result
    ? 'Submitted'
    : disabled
      ? 'Submitting...'
      : 'Submit Answer';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2" role="radiogroup" aria-label="Answer choices">
        {choices.map((choice: Choice) => (
          <button
            key={choice.id}
            type="button"
            role="radio"
            aria-checked={selectedChoice === choice.id}
            aria-disabled={disabled || !!result}
            onClick={() => handleChoiceChange(choice.id)}
            onKeyDown={(e) => handleKeyDown(e, choice.id)}
            disabled={disabled || !!result}
            className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              selectedChoice === choice.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${result && selectedChoice === choice.id ? (result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''} ${disabled && !result ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedChoice === choice.id
                  ? 'border-orange-500'
                  : 'border-gray-400'
              } ${result && selectedChoice === choice.id ? (result.isCorrect ? 'border-green-500' : 'border-red-500') : ''}`}>
                {selectedChoice === choice.id && (
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    result && selectedChoice === choice.id
                      ? (result.isCorrect ? 'bg-green-500' : 'bg-red-500')
                      : 'bg-orange-500'
                  }`} />
                )}
              </div>
              <span className="text-gray-900 flex-1">{choice.text}</span>
              {result && selectedChoice === choice.id && (
                <span className={`text-sm font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                  {result.isCorrect ? '✓' : '✗'}
                </span>
              )}
              {result && !selectedChoice && choice.text === result.correctAnswer && (
                <span className="text-sm font-medium text-green-700">✓ Correct</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={!selectedChoice || disabled || !!result}
        className="w-full py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {buttonLabel}
      </button>

      {result && (
        <div className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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