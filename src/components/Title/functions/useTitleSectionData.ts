// src/components/Title/functions/useTitleSectionData.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { TitleSectionData } from './types';

export const useTitleSectionData = () => {
  const [titleData, setTitleData] = useState<TitleSectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTitleData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('title_section_content')
        .select(`
          id,
          event_title,
          event_subtitle,
          image_url,
          image_alt,
          detail_1_title,
          detail_1_description,
          detail_2_title,
          detail_2_description,
          detail_3_title,
          detail_3_description,
          participant_count,
          created_at,
          updated_at
        `)
        .limit(1)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        console.error("Supabase error fetching title section content:", dbError);
        throw new Error('Fout bij ophalen titel sectie data.');
      }

      if (data) {
        setTitleData(data as TitleSectionData);
      } else {
        setTitleData(null);
      }

    } catch (err) {
      console.error("Error fetching title section content:", err);
      const message = err instanceof Error ? err.message : 'Kon titel sectie data niet laden.';
      setError(message);
      setTitleData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTitleData();
  }, [fetchTitleData]);

  return { titleData, isLoading, error, refetch: fetchTitleData };
};
