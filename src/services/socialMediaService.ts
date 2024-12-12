import { supabase } from '@/lib/supabaseClient';
import type { SocialMediaEmbed } from '@/types/socialMedia';

export const getSocialMediaPosts = async (section: string) => {
  const { data, error } = await supabase
    .from('social_media_embeds')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching social media posts:', error);
    return [];
  }

  return data as SocialMediaEmbed[];
}; 