import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SocialEmbedRow } from './types';

export const useSocialMediaData = () => {
  const [socialEmbeds, setSocialEmbeds] = useState<SocialEmbedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialEmbeds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('social_embeds')
          .select('*')
          .eq('visible', true)
          .order('order_number', { ascending: true });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Type assertion to ensure data matches SocialEmbedRow type
        const typedData = (data || []).map(item => ({
          ...item,
          platform: item.platform as 'facebook' | 'instagram',
          order_number: item.order_number || 0,
          visible: item.visible || false
        })) as SocialEmbedRow[];

        setSocialEmbeds(typedData);
      } catch (err) {
        console.error('Error fetching social embeds:', err);
        setError(err instanceof Error ? err.message : 'Er ging iets mis bij het ophalen van de social media berichten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialEmbeds();
  }, []);

  return { socialEmbeds, isLoading, error };
}; 