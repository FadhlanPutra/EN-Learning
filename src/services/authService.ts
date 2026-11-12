import { supabase } from '../lib/supabase';
import { User } from '../types';

function mapProfileToUser(profile: { id: string; username: string }): User {
  return { id: profile.id, username: profile.username };
}

export async function enterName(name: string): Promise<User> {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 30) {
    throw new Error('Nama kelompok harus 2-30 karakter.');
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { username: trimmedName } },
    });
    if (error) throw new Error(translateError(error.message));
    if (!data.user) throw new Error('Gagal masuk.');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) throw new Error(translateError(profileError.message));
    if (!profile) throw new Error('Profil tidak ditemukan.');

    return mapProfileToUser(profile);
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username: trimmedName })
    .eq('id', session.user.id);

  if (error) throw new Error(translateError(error.message));

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profileError) throw new Error(translateError(profileError.message));
  if (!profile) throw new Error('Profil tidak ditemukan.');

  return mapProfileToUser(profile);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile) return null;
  return mapProfileToUser(profile);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(translateError(error.message));
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!error && profile) {
          setTimeout(() => callback(mapProfileToUser(profile)), 0);
        } else {
          setTimeout(() => callback(null), 0);
        }
      } else {
        setTimeout(() => callback(null), 0);
      }
    } else if (event === 'SIGNED_OUT') {
      setTimeout(() => callback(null), 0);
    }
  });

  return () => subscription.unsubscribe();
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