import { supabase, createBrowserClient } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export async function getSession(): Promise<Session | null> {
  const client = createBrowserClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    console.error('getSession error', error);
    return null;
  }

  return session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function signOut() {
  const client = createBrowserClient();
  const { error } = await client.auth.signOut();
  if (error) {
    console.error('signOut error', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const client = createBrowserClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  options?: { data?: Record<string, any> }
) {
  const client = createBrowserClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options,
  });
  if (error) {
    throw error;
  }
  return data;
}

// register with username and insert into users table
export async function signUpWithUsername(
  email: string,
  password: string,
  username: string
) {
  // supabase auth user metadata
  const client = createBrowserClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    throw error;
  }

  // try to insert into `users` table; ignore if conflict
  const { error: insertError } = await supabase.from('users').insert({
    id: data.user?.id,
    username,
    email,
  }).select();

  if (insertError) {
    console.error('user table insert error', insertError);
    // don't throw; auth already succeeded
  }

  return data;
}
