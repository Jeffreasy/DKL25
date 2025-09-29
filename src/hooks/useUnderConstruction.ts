import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UnderConstructionData {
  is_active: boolean;
  title: string;
  message: string;
  footer_text: string;
  logo_url?: string;
  expected_date?: string;
  progress_percentage?: number;
  social_links?: { platform: string; url: string }[];
  contact_email?: string;
  newsletter_enabled?: boolean;
}

export const useUnderConstruction = () => {
  const [data, setData] = useState<UnderConstructionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result, error } = await (supabase as any)
          .from('under_construction')
          .select('*')
          .limit(1)
          .single();

        if (error || !result) {
          // If table doesn't exist, no data, or error, use defaults
          console.warn('Under construction table not found, empty, or error:', error?.message);
          setData({
            is_active: false,
            title: 'Onder Constructie',
            message: 'Deze website is momenteel onder constructie. We werken hard aan verbeteringen en zullen spoedig weer volledig online zijn.',
            footer_text: 'Bedankt voor uw geduld!',
          });
        } else {
          setData(result);
        }
      } catch (err) {
        console.warn('Error fetching under construction data:', err);
        setData({
          is_active: false,
          title: 'Onder Constructie',
          message: 'Deze website is momenteel onder constructie. We werken hard aan verbeteringen en zullen spoedig weer volledig online zijn.',
          footer_text: 'Bedankt voor uw geduld!',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};