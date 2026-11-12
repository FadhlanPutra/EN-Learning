import { Level } from '../types';

export function getLevel(price: number): Level {
  if (price < 100_000) return 1;
  if (price < 300_000) return 2;
  return 3;
}

export function getLevelLabel(level: Level): string {
  switch (level) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Challenge';
  }
}

export function getLevelColor(level: Level): string {
  switch (level) {
    case 1:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 2:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 3:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  }
}

export function getLevelIcon(level: Level): string {
  switch (level) {
    case 1:
      return '🌱';
    case 2:
      return '🌿';
    case 3:
      return '🌲';
  }
}