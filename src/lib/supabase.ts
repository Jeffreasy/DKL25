import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Types voor de database tabellen
export type Aanmelding = {
  id: string;
  created_at: string;
  updated_at: string;
  naam: string;
  email: string;
  telefoon?: string;
  rol: 'Deelnemer' | 'Begeleider' | 'Vrijwilliger';
  afstand: '2.5 KM' | '6 KM' | '10 KM' | '15 KM';
  ondersteuning: 'Ja' | 'Nee' | 'Anders';
  bijzonderheden?: string;
  email_verzonden: boolean;
  email_verzonden_op?: string;
}; 