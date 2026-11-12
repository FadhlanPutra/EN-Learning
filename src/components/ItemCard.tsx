import { Link } from 'react-router-dom';
import { Item, Attempt } from '../types';
import { formatPrice } from '../utils/format';
import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';

interface ItemCardProps {
  item: Item;
  attempt?: Attempt | null;
}

export function ItemCard({ item, attempt }: ItemCardProps) {
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
    translate: 'Translate',
    complete: 'Complete',
    guess: 'Guess',
  };

  const getStatusBadge = () => {
    if (!isAnswered) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
          Not Attempted
        </span>
      );
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isCorrect
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      }`}>
        {isCorrect ? 'Correct' : 'Incorrect'}
      </span>
    );
  };

  return (
    <Link
      to={`/item/${item.id}`}
      className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
    >
      <div className="relative aspect-square bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
        <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform">{typeIcons[item.type] || '📦'}</span>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
            {getLevelIcon(level)} {getLevelLabel(level)}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
            {categoryLabels[item.category] || item.category}
          </span>
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
            {item.type.replace('_', ' ')}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-3">
          {item.question || (item.clue ? `Clue: ${item.clue}` : 'No description available')}
        </p>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          {getStatusBadge()}
        </div>
      </div>
    </Link>
  );
}