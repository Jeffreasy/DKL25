// src/components/Title/functions/useTitleSectionData.ts
import { useState, useEffect, useCallback } from 'react';
import { TitleSectionData } from './types';

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api';

export const useTitleSectionData = () => {
  const [titleData, setTitleData] = useState<TitleSectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTitleData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${POSTGREST_URL}/title_section_content`);

      if (!response.ok) {
        if (response.status === 404) {
          setTitleData(null);
          return;
        }
        throw new Error('Fout bij ophalen titel sectie data.');
      }

      const data = await response.json();

      if (data) {
        setTitleData(data as TitleSectionData);
      } else {
        setTitleData(null);
      }

    } catch (err) {
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
