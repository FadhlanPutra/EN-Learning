import { formatPrice } from '../utils/format';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function PointsBadge({ points, size = 'md', showLabel = true }: PointsBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 rounded-full ${sizeClasses[size]}`}>
      {formatPrice(points)}
      {showLabel && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Balance</span>}
    </span>
  );
}