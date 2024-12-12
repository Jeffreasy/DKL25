import { supabase } from '@/lib/supabaseClient';
import type { HomeContent } from '@/types/homeContent';

export const getHomeContent = async (section: string) => {
  const { data, error } = await supabase
    .from('home_content')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching home content:', error);
    return null;
  }

  return data as HomeContent;
}; 