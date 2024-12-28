import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Log environment variables bij startup
console.log('API Supabase Config:', {
  hasUrl: !!process.env.VITE_SUPABASE_URL,
  hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  urlStart: process.env.VITE_SUPABASE_URL?.substring(0, 30)
});

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables for Supabase')
}

// API client met service role key
export const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Test de connectie
supabase.from('aanmeldingen')
  .select('count')
  .limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('API Supabase connection test failed:', error);
    } else {
      console.log('API Supabase connection test successful');
    }
  }); 