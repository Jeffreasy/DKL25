import { useState, useEffect } from 'react';

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

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || 'https://dklemailservice.onrender.com';

export const useUnderConstruction = () => {
  const [data, setData] = useState<UnderConstructionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Temporarily disabled under construction check to prevent console errors
    // when backend is unavailable
    setData({
      is_active: false,
      title: 'Onder Constructie',
      message: 'Deze website is momenteel onder constructie. We werken hard aan verbeteringen en zullen spoedig weer volledig online zijn.',
      footer_text: 'Bedankt voor uw geduld!',
    });
    setLoading(false);
  }, []);

  return { data, loading, error };
};