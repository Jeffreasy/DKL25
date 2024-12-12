import { supabase } from '@/lib/supabaseClient';
import type { TitleSectionContent, TitleSectionEmbed } from '@/types/titleSection';

export async function getTitleSectionContent(): Promise<TitleSectionContent> {
  const { data, error } = await supabase
    .from('title_sections')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getTitleSectionEmbeds(): Promise<TitleSectionEmbed[]> {
  const { data, error } = await supabase
    .from('social_embeds')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) throw error;
  return data;
} 