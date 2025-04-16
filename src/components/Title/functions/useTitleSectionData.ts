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
      // Fetch the first (and likely only) row from the table
      const { data, error: dbError } = await supabase
        .from('title_section_content')
        .select('*')
        .limit(1)
        .single(); // .single() returns one object or null

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = row not found, not necessarily an error here
        console.error("Supabase error fetching title section content:", dbError);
        throw new Error('Fout bij ophalen titel sectie data.');
      }

      setTitleData(data); // Set data (can be null if no row found)

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