import { supabase } from '@/lib/supabaseClient';
import type { CTACard } from '@/types/ctaCards';

export const getCTACards = async () => {
  const { data, error } = await supabase
    .from('cta_cards')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching CTA cards:', error);
    return [];
  }

  return data as CTACard[];
}; 