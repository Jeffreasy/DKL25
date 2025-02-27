// useInitialData.ts
import { useState, useEffect } from 'react';
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
          supabase.from('social_embeds').select('*')
        ]);

        if (titleResponse.error) {
          console.error('Error fetching title section:', titleResponse.error);
          setError('Error fetching title section');
        } else {
          setData(titleResponse.data);
        }

        if (embedsResponse.error) {
          console.error('Error fetching social embeds:', embedsResponse.error);
          setError('Error fetching social embeds');
        } else {
          setSocialEmbeds(embedsResponse.data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Er is een onverwachte fout opgetreden.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, socialEmbeds, isLoading, error };
};
