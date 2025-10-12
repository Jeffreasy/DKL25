import { useState, useEffect } from 'react';
import { SocialEmbedRow } from './types';

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || 'https://dklemailservice.onrender.com';

export const useSocialMediaData = () => {
  const [socialEmbeds, setSocialEmbeds] = useState<SocialEmbedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialEmbeds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${POSTGREST_URL}/api/social-embeds`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Type assertion to ensure data matches SocialEmbedRow type
        const typedData = (data || []).map((item: any) => ({
          ...item,
          platform: item.platform as 'facebook' | 'instagram',
          order_number: item.order_number || 0,
          visible: item.visible || false
        })) as SocialEmbedRow[];

        setSocialEmbeds(typedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er ging iets mis bij het ophalen van de social media berichten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialEmbeds();
  }, []);

  return { socialEmbeds, isLoading, error };
}; 