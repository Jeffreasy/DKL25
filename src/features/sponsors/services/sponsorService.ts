/**
 * Sponsors Service
 * API service for sponsor operations via backend
 */

import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type { SponsorRow } from '../types';

export const sponsorService = {
  /**
   * Fetch all visible and active sponsors
   */
  fetchActive: async (): Promise<SponsorRow[]> => {
    try {
      const data = await apiClient.get<SponsorRow[]>(API_ENDPOINTS.sponsors);
      
      // Filter for active sponsors only
      return data.filter(sponsor => sponsor.is_active === true);
    } catch (error) {
      console.error('Error fetching active sponsors:', error);
      throw new Error('Er ging iets mis bij het ophalen van de actieve sponsors');
    }
  },

  /**
   * Fetch all visible sponsors (active or inactive)
   */
  fetchVisible: async (): Promise<SponsorRow[]> => {
    try {
      return await apiClient.get<SponsorRow[]>(`${API_ENDPOINTS.sponsors}?visible=true`);
    } catch (error) {
      console.error('Error fetching visible sponsors:', error);
      throw new Error('Er ging iets mis bij het ophalen van de zichtbare sponsors');
    }
  },

  /**
   * Fetch all sponsors (requires admin permission)
   */
  fetchAll: async (): Promise<SponsorRow[]> => {
    try {
      return await apiClient.get<SponsorRow[]>(API_ENDPOINTS.sponsors);
    } catch (error) {
      console.error('Error fetching all sponsors:', error);
      throw new Error('Er ging iets mis bij het ophalen van alle sponsors');
    }
  },

  /**
   * Fetch sponsor by ID
   */
  fetchById: async (id: string): Promise<SponsorRow | null> => {
    try {
      return await apiClient.get<SponsorRow>(`${API_ENDPOINTS.sponsors}/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching sponsor by ID:', error);
      return null;
    }
  },

  /**
   * Transform SponsorRow to Sponsor type for components
   */
  transformToSponsor: (sponsorRow: SponsorRow): import('../types').Sponsor => {
    return {
      ...sponsorRow,
      logo: sponsorRow.logo_url,
      website: sponsorRow.website_url || null,
      visible: sponsorRow.visible ?? true
    };
  }
};