// src/components/Title/functions/useTitleSectionData.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { TitleSectionData } from './types'; // Assuming type is defined in types.ts

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

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = row not found, not necessarily an error here
        console.error("Supabase error fetching title section content:", dbError);
        throw new Error('Fout bij ophalen titel sectie data.');
      }

      if (data && typeof data.participant_count !== 'undefined') {
         setTitleData(data as TitleSectionData); // Cast needed if select isn't perfectly typed
      } else if (data === null) {
        setTitleData(null); // Handle case where no row is found
      } else {
        console.error("Fetched data is missing participant_count property.", data);
        throw new Error('Ontbrekende data voor titel sectie.');
      }

    } catch (err) {
      console.error("Error fetching title section content:", err);
      const message = err instanceof Error ? err.message : 'Kon titel sectie data niet laden.';
      setError(message);
      setTitleData(null); // Ensure null on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTitleData();
  }, [fetchTitleData]);

  // Allow refetching if needed
  return { titleData, isLoading, error, refetch: fetchTitleData };
}; 