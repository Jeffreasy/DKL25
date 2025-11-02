import { useState, useEffect } from 'react';
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';

/**
 * Social link interface matching backend API
 */
export interface SocialLink {
  platform: string;
  url: string;
}

/**
 * UnderConstruction data interface matching backend API response
 * @see https://dklemailservice.onrender.com/api/under-construction/active
 */
export interface UnderConstructionData {
  id: number;
  is_active: boolean;
  title: string;
  message: string;
  footer_text: string | null;
  logo_url: string | null;
  expected_date: string | null;
  social_links: SocialLink[] | null;
  progress_percentage: number | null;
  contact_email: string | null;
  newsletter_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook return type
 */
export interface UseUnderConstructionReturn {
  data: UnderConstructionData | null;
  loading: boolean;
  error: Error | null;
}


/**
 * Custom hook to fetch active maintenance mode status from backend API
 *
 * @returns {UseUnderConstructionReturn} Object containing data, loading state, and error
 *
 * @example
 * ```typescript
 * const { data, loading, error } = useUnderConstruction();
 *
 * if (loading) return <LoadingScreen />;
 * if (error) return <ErrorPage />;
 * if (data && data.is_active) return <MaintenancePage data={data} />;
 * return <NormalApp />;
 * ```
 */
export const useUnderConstruction = (): UseUnderConstructionReturn => {
  const [data, setData] = useState<UnderConstructionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnderConstruction = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.underConstruction}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout for better UX
          signal: AbortSignal.timeout(API_CONFIG.timeout),
        });

        if (response.status === 404) {
          // No active maintenance mode - this is expected and normal
          setData(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: UnderConstructionData = await response.json();

        // Backend now returns data in correct format, no transformation needed
        setData(result);
      } catch (err) {
        console.error('Failed to fetch under construction data:', err);
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch under construction data');
        setError(errorObj);
        // On error, assume site is available (fail open)
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUnderConstruction();

    // Optional: Poll for changes every minute
    const interval = setInterval(fetchUnderConstruction, 60000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};