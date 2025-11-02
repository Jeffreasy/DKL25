/**
 * Partners Service
 * API service for partner operations via backend
 */

import { createDataService } from '../../../services/api/dataService';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type { Partner } from '../types';

// Create data service for partners
const dataService = createDataService<Partner>(API_ENDPOINTS.partners);

export const partnerService = {
  /**
   * Fetch all visible partners
   */
  fetchVisible: async (): Promise<Partner[]> => {
    return dataService.fetchVisible({ sortBy: 'order_number', sortOrder: 'asc' });
  },

  /**
   * Fetch all partners
   */
  fetchAll: async (): Promise<Partner[]> => {
    return dataService.fetchAll({ sortBy: 'order_number', sortOrder: 'asc' });
  },

  /**
   * Fetch partner by ID
   */
  fetchById: async (id: string): Promise<Partner | null> => {
    try {
      return await dataService.fetchById(id);
    } catch (error) {
      return null;
    }
  },

  /**
   * Fetch partners by tier
   */
  fetchByTier: async (tier: string): Promise<Partner[]> => {
    // Note: This requires backend support for tier filtering
    // Alternative: fetch all visible and filter client-side
    const partners = await dataService.fetchVisible();
    return partners.filter(p => p.tier === tier);
  },

  /**
   * Group partners by tier
   */
  groupByTier: (partners: Partner[]): Record<string, Partner[]> => {
    return partners.reduce((acc, partner) => {
      const tier = partner.tier;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(partner);
      return acc;
    }, {} as Record<string, Partner[]>);
  }
};