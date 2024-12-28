import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Partner } from '@/types/partner';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('visible', 'true')
          .order('order_number', { ascending: true });

        if (error) throw error;

        const mappedPartners: Partner[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          logo: item.logo,
          website: item.website,
          description: item.description,
          tier: item.tier,
          since: item.since,
          visible: item.visible,
          order_number: item.order_number,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));

        setPartners(mappedPartners);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Er ging iets mis bij het ophalen van de partners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, isLoading, error };
}; 