import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// Haal het 'Row' type op uit de 'sponsors' tabel definitie
type SponsorRow = Database['public']['Tables']['sponsors']['Row'];

// Maak een nieuw type 'Sponsor' met de gemapte (camelCase) velden
type Sponsor = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export const useSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // We gebruiken SponsorRow niet direct voor de query, maar het type is nu beschikbaar
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('visible', true)
          .eq('is_active', true)
          .order('order_number', { ascending: true });

        if (error) throw error;

        // Map de database rows (SponsorRow) naar ons gewenste Sponsor type
        const mappedSponsors: Sponsor[] = (data || []).map((item: SponsorRow) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          logoUrl: item.logo_url,
          websiteUrl: item.website_url || '',
          order: item.order_number,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        setSponsors(mappedSponsors);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
        setError('Er ging iets mis bij het ophalen van de sponsors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  return { sponsors, isLoading, error };
}; 