import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
} else {
  // Create a mock client that supports method chaining
  const createQueryBuilder = () => {
    const queryBuilder = {
      select: () => queryBuilder,
      eq: () => queryBuilder,
      order: () => queryBuilder,
      limit: () => queryBuilder,
      single: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: any) => resolve({ data: [], error: null })
    };
    return queryBuilder;
  };

  supabase = {
    from: () => createQueryBuilder(),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
}

export { supabase };

// We kunnen deze type exporteren vanuit types/supabase.ts in plaats van hier te definiëren
export type Aanmelding = Database['public']['Tables']['aanmeldingen']['Row'];