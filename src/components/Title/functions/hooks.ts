import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TitleSectionRow, SocialEmbedRow } from './types';

export const useInitialData = () => {
  const [data, setData] = useState<TitleSectionRow | null>(null);
  const [socialEmbeds, setSocialEmbeds] = useState<SocialEmbedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [titleResponse, embedsResponse] = await Promise.all([
          supabase.from('title_sections').select('*').single(),
          supabase.from('social_embeds').select('*').order('created_at', { ascending: false })
        ]);

        console.log('Social embeds response:', embedsResponse); // Debug log

        if (titleResponse.error) {
          throw new Error('Error fetching title section: ' + titleResponse.error.message);
        }

        if (embedsResponse.error) {
          throw new Error('Error fetching social embeds: ' + embedsResponse.error.message);
        }

        setData(titleResponse.data);
        setSocialEmbeds(embedsResponse.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er ging iets mis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, socialEmbeds, isLoading, error };
}; 