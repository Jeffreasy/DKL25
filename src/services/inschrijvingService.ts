import { supabase } from '@/lib/supabaseClient';
import type { Inschrijving } from '@/types/inschrijving';

export const createInschrijving = async (inschrijving: Omit<Inschrijving, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('inschrijvingen')
    .insert([
      { 
        ...inschrijving,
        status: 'pending'
      }
    ])
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getInschrijving = async (id: string) => {
  const { data, error } = await supabase
    .from('inschrijvingen')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }

  return data;
}; 