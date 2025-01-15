import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Gebruik de VITE_ versie als fallback
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log voor debugging
console.log('API Environment:', {
  url: supabaseUrl?.slice(0, 20) + '...',
  key: supabaseKey?.slice(0, 10) + '...',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseKey || ''
); 