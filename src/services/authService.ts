import { supabase } from '../lib/supabase';
import { User } from '../types';

function mapProfileToUser(profile: { id: string; username: string }): User {
  return { id: profile.id, username: profile.username };
}

export async function enterName(name: string): Promise<User> {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 30) {
    throw new Error('Group name must be 2-30 characters.');
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { username: trimmedName } },
    });
    if (error) throw new Error(translateError(error.message));
    if (!data.user) throw new Error('Sign in failed.');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) throw new Error(translateError(profileError.message));
    if (!profile) {
      await supabase.auth.signOut();
      return enterName(trimmedName);
    }

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
  if (!profile) throw new Error('Profile not found.');

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

  if (error || !profile) {
    if (!error) await supabase.auth.signOut();
    return null;
  }
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