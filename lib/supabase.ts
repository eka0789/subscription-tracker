import { createClient } from '@supabase/supabase-js';

// Validate URL at init time; fall back to a valid placeholder during build.
// Real credentials must be set in .env.local for data operations to work.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseUrl = (() => {
  try {
    new URL(rawUrl);
    return rawUrl;
  } catch {
    return 'https://placeholder.supabase.co';
  }
})();

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
