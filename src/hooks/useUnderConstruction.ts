import { useState, useEffect } from 'react';

interface UnderConstructionData {
  id: number;
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
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useUnderConstruction = () => {
  const [data, setData] = useState<UnderConstructionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnderConstruction = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/under-construction/active`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 404) {
          // No active under construction found - this is normal
          setData(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Transform backend data to match frontend interface
        const transformedData: UnderConstructionData = {
          id: result.id,
          is_active: result.is_active,
          title: result.title,
          message: result.message,
          footer_text: result.footer_text || '',
          logo_url: result.logo_url,
          expected_date: result.expected_date,
          progress_percentage: result.progress_percentage,
          social_links: result.social_links ? JSON.parse(result.social_links) : undefined,
          contact_email: result.contact_email,
          newsletter_enabled: result.newsletter_enabled,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

        setData(transformedData);
      } catch (err) {
        console.error('Failed to fetch under construction data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch under construction data');
        // Don't set data to null on error - keep existing data if available
      } finally {
        setLoading(false);
      }
    };

    fetchUnderConstruction();
  }, []);

  return { data, loading, error };
};