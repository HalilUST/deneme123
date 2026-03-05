import { createClient } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

// ensure these are defined in your environment (.env.local or Vercel dashboard)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

// generic client that can be used on server side
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// factory for browser client which handles cookies & local storage
export function createBrowserClient() {
  return createBrowserSupabaseClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}
