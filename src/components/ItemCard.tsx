import { Link } from 'react-router-dom';
import { Item, Attempt } from '../types';
import { formatPrice } from '../utils/format';
import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';

interface ItemCardProps {
  item: Item;
  attempt?: Attempt | null;
  statusLoading?: boolean;
}

export function ItemCard({ item, attempt, statusLoading }: ItemCardProps) {
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
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    arrange: 'Arrange',
    translate: 'Translation',
    complete: 'Complete',
    guess: 'Guess',
  };

  const getStatusBadge = () => {
    if (!isAnswered) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
          Not answered
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
        isCorrect
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      }`}>
        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </span>
    );
  };

  return (
    <Link
      to={`/item/${item.id}`}
      className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow h-full"
    >
      <div className="p-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center text-2xl" aria-hidden="true">
          {typeIcons[item.type] || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
            <span className="text-sm font-bold text-orange-700 dark:text-orange-400 whitespace-nowrap">
              {formatPrice(item.price)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
              {getLevelIcon(level)} {getLevelLabel(level)}
            </span>
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
              {categoryLabels[item.category] || item.category}
            </span>
            <span className="ml-auto">
              {statusLoading ? (
                <span className="block h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" aria-hidden="true" />
              ) : (
                getStatusBadge()
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}