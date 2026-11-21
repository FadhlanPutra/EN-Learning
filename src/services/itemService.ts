import { supabase } from '../lib/supabase';
import { Item, Attempt } from '../types';

function mapItemFromDb(item: {
  id: string;
  name: string;
  price: number;
  level: number;
  image_url: string | null;
  type: string;
  category: string;
  question: string;
  clue: string | null;
  tiles: string[] | null;
  item_choices: Array<{ id: string; label: string; sort_order: number }> | null;
}): Item {
  return {
    id: item.id,
    name: item.name ?? '',
    price: Number(item.price ?? 0),
    level: (item.level ?? 1) as 1 | 2 | 3,
    imageUrl: item.image_url || undefined,
    type: (item.type ?? 'multiple_choice') as Item['type'],
    category: (item.category ?? 'vocabulary') as Item['category'],
    question: item.question ?? '',
    clue: item.clue || undefined,
    tiles: Array.isArray(item.tiles) ? item.tiles : undefined,
    choices: Array.isArray(item.item_choices)
      ? [...item.item_choices].sort((a, b) => a.sort_order - b.sort_order).map((c) => ({
          id: c.id,
          text: c.label ?? '',
        }))
      : undefined,
  };
}

export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      id,
      name,
      price,
      level,
      image_url,
      type,
      category,
      question,
      clue,
      tiles,
      item_choices (id, label, sort_order)
    `)
    .order('price', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapItemFromDb);
}

export async function getItemById(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      id,
      name,
      price,
      level,
      image_url,
      type,
      category,
      question,
      clue,
      tiles,
      item_choices (id, label, sort_order)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapItemFromDb(data);
}

export async function submitAnswer(
  _userId: string,
  itemId: string,
  answer: string | string[]
): Promise<{ attempt: Attempt; item: Item }> {
  const answerText = Array.isArray(answer) ? answer.join(' ') : answer;

  const { data, error } = await supabase.rpc('submit_answer', {
    p_item_id: itemId,
    p_answer: answerText,
  });

  if (error) {
    const msg = translateError(error.message);
    throw new Error(msg);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row || typeof row !== 'object') {
    throw new Error('No response from server.');
  }

  const attempt: Attempt = {
    id: row.id ?? '',
    userId: row.user_id ?? _userId,
    itemId: row.item_id ?? itemId,
    answer: answerText,
    isCorrect: Boolean(row.is_correct),
    correctAnswer: row.correct_answer ?? '',
    pointsEarned: Number(row.points_earned ?? 0),
    createdAt: row.created_at ?? new Date().toISOString(),
  };

  const item = await getItemById(itemId);
  if (!item) throw new Error('Item not found.');

  return { attempt, item };
}

export async function getMyAttempts(): Promise<Attempt[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAttemptFromDb);
}

export async function getHistory(_userId: string): Promise<Attempt[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select(`
      *,
      items (id, name, price, level, type, category)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAttemptFromDb);
}

function mapAttemptFromDb(row: {
  id: string;
  user_id: string;
  item_id: string;
  answer: string;
  is_correct: boolean;
  correct_answer: string;
  points_earned: number;
  created_at: string;
  items?: {
    id: string;
    name: string;
    price: number;
    level: number;
    type: string;
    category: string;
  } | Array<{
    id: string;
    name: string;
    price: number;
    level: number;
    type: string;
    category: string;
  }>;
}): Attempt {
  const itemRow = Array.isArray(row.items) ? row.items[0] : row.items;
  return {
    id: row.id,
    userId: row.user_id,
    itemId: row.item_id,
    answer: row.answer,
    isCorrect: Boolean(row.is_correct),
    correctAnswer: row.correct_answer ?? '',
    pointsEarned: Number(row.points_earned ?? 0),
    createdAt: row.created_at,
    item: itemRow
      ? {
          id: itemRow.id,
          name: itemRow.name ?? '',
          price: Number(itemRow.price ?? 0),
          level: (itemRow.level ?? 1) as 1 | 2 | 3,
          type: (itemRow.type ?? 'multiple_choice') as Item['type'],
          category: (itemRow.category ?? 'vocabulary') as Item['category'],
        }
      : undefined,
  };
}

export async function getLeaderboard(): Promise<{
  rank: number;
  userId: string;
  username: string;
  totalPoints: number;
  correctCount: number;
  answeredCount: number;
}[]> {
  const { data, error } = await supabase.rpc('get_leaderboard');

  if (error) throw new Error(error.message);
  return (data ?? []).map((row: {
    rank: number | string;
    user_id: string;
    username: string | null;
    total_points: number | string;
    correct_count: number | string;
    answered_count: number | string;
  }) => ({
    rank: Number(row.rank ?? 0),
    userId: row.user_id ?? '',
    username: row.username ?? '',
    totalPoints: Number(row.total_points ?? 0),
    correctCount: Number(row.correct_count ?? 0),
    answeredCount: Number(row.answered_count ?? 0),
  }));
}

function translateError(message: string): string {
  const errorMap: Record<string, string> = {
    not_authenticated: 'Enter your group name first.',
    already_answered: 'This question has already been answered and cannot be repeated.',
    invalid_choice: 'Invalid choice.',
    empty_answer: 'Answer cannot be empty.',
    item_not_found: 'Item not found.',
  };

  for (const [key, translated] of Object.entries(errorMap)) {
    if (message.includes(key)) return translated;
  }
  return message;
}