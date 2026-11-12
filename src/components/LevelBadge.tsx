import { getLevel, getLevelLabel, getLevelColor, getLevelIcon } from '../utils/level';

interface LevelBadgeProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ price, size = 'md' }: LevelBadgeProps) {
  const level = getLevel(price);
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-0.5',
    md: 'px-2 py-1 text-sm gap-1',
    lg: 'px-3 py-1.5 text-base gap-1.5',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${getLevelColor(level)} ${sizeClasses[size]}`}>
      {getLevelIcon(level)} {getLevelLabel(level)}
    </span>
  );
}