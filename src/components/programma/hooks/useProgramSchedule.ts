import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; // Zorg dat dit pad klopt
import type { ProgramItemData } from '../types';
import { trackEvent } from '@/utils/googleAnalytics'; // Optioneel: tracking

export const useProgramSchedule = () => {
  const [scheduleItems, setScheduleItems] = useState<ProgramItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Haal items op die zichtbaar zijn, gesorteerd op volgorde
      const { data, error: dbError } = await supabase
        .from('program_schedule')
        .select('id, time, event_description, category, icon_name, order_number, visible, latitude, longitude')
        .eq('visible', true)
        .order('order_number', { ascending: true });

      if (dbError) {
        trackEvent('program_section', 'error', 'fetch_failed'); // Optioneel
        console.error("Supabase error fetching program schedule:", dbError);
        throw new Error('Fout bij ophalen programma uit database.'); // Duidelijkere foutmelding
      }

      setScheduleItems(data || []);
      trackEvent('program_section', 'loaded', `count:${data?.length || 0}`); // Optioneel

    } catch (err) {
      // Simplified error handling: the thrown error or a generic message
      const errorMessage = err instanceof Error ? err.message : 'Kon het programma niet laden.';
      console.error("Error fetching program schedule:", err); 
      setError(errorMessage); 
      setScheduleItems([]); // Leegmaken bij fout
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Bied ook een refetch functie aan voor eventuele updates
  return { scheduleItems, isLoading, error, refetch: fetchSchedule };
};
