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
    name: item.name,
    price: item.price,
    level: item.level as 1 | 2 | 3,
    imageUrl: item.image_url || undefined,
    type: item.type as Item['type'],
    category: item.category as Item['category'],
    question: item.question,
    clue: item.clue || undefined,
    tiles: item.tiles || undefined,
    choices: item.item_choices
      ? [...item.item_choices].sort((a, b) => a.sort_order - b.sort_order).map((c) => ({
          id: c.id,
          text: c.label,
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
  return (data || []).map(mapItemFromDb);
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

  if (!data || data.length === 0) {
    throw new Error('Tidak ada respons dari server.');
  }

  const row = data[0];

  const attempt: Attempt = {
    id: row.id,
    userId: row.user_id,
    itemId: row.item_id,
    answer: answerText,
    isCorrect: row.is_correct,
    correctAnswer: row.correct_answer,
    pointsEarned: row.points_earned,
    createdAt: row.created_at,
  };

  const item = await getItemById(itemId);
  if (!item) throw new Error('Barang tidak ditemukan.');

  return { attempt, item };
}

export async function getMyAttempts(): Promise<Attempt[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapAttemptFromDb);
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
  return (data || []).map(mapAttemptFromDb);
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
  };
}): Attempt {
  return {
    id: row.id,
    userId: row.user_id,
    itemId: row.item_id,
    answer: row.answer,
    isCorrect: row.is_correct,
    correctAnswer: row.correct_answer,
    pointsEarned: row.points_earned,
    createdAt: row.created_at,
    item: row.items
      ? {
          id: row.items.id,
          name: row.items.name,
          price: row.items.price,
          level: row.items.level as 1 | 2 | 3,
          type: row.items.type as Item['type'],
          category: row.items.category as Item['category'],
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
  return (data || []).map((row: {
    rank: number | string;
    user_id: string;
    username: string;
    total_points: number | string;
    correct_count: number | string;
    answered_count: number | string;
  }) => ({
    rank: Number(row.rank),
    userId: row.user_id,
    username: row.username,
    totalPoints: Number(row.total_points),
    correctCount: Number(row.correct_count),
    answeredCount: Number(row.answered_count),
  }));
}

function translateError(message: string): string {
  const errorMap: Record<string, string> = {
    not_authenticated: 'Masukkan nama kelompok dulu.',
    already_answered: 'Soal ini sudah dijawab dan tidak bisa diulang.',
    invalid_choice: 'Pilihan jawaban tidak valid.',
    empty_answer: 'Jawaban tidak boleh kosong.',
    item_not_found: 'Barang tidak ditemukan.',
  };

  for (const [key, translated] of Object.entries(errorMap)) {
    if (message.includes(key)) return translated;
  }
  return message;
}