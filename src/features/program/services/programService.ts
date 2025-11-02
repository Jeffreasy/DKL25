/**
 * Program Service
 * API service for program schedule operations via backend
 */

import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type { ProgramItem } from '../types';

export const programService = {
  /**
   * Fetch all visible program items
   */
  fetchVisible: async (): Promise<ProgramItem[]> => {
    try {
      return await apiClient.get<ProgramItem[]>(`${API_ENDPOINTS.program}?visible=true&sortBy=order_number&sortOrder=asc`);
    } catch (error) {
      console.error('Error fetching visible program items:', error);
      throw new Error('Er ging iets mis bij het ophalen van het programma');
    }
  },

  /**
   * Fetch all program items (requires admin permission)
   */
  fetchAll: async (): Promise<ProgramItem[]> => {
    try {
      return await apiClient.get<ProgramItem[]>(`${API_ENDPOINTS.program}?sortBy=order_number&sortOrder=asc`);
    } catch (error) {
      console.error('Error fetching all program items:', error);
      throw new Error('Er ging iets mis bij het ophalen van alle programma items');
    }
  },

  /**
   * Fetch program item by ID
   */
  fetchById: async (id: string): Promise<ProgramItem | null> => {
    try {
      return await apiClient.get<ProgramItem>(`${API_ENDPOINTS.program}/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching program item by ID:', error);
      return null;
    }
  },

  /**
   * Fetch program items by category
   */
  fetchByCategory: async (category: string): Promise<ProgramItem[]> => {
    try {
      return await apiClient.get<ProgramItem[]>(`${API_ENDPOINTS.program}?category=${encodeURIComponent(category)}`);
    } catch (error) {
      console.error('Error fetching program items by category:', error);
      throw new Error('Er ging iets mis bij het ophalen van programma items per categorie');
    }
  },

  /**
   * Get program items with location data
   */
  fetchWithLocations: async (): Promise<ProgramItem[]> => {
    try {
      // Note: Backend should support filtering on non-null fields
      const allItems = await apiClient.get<ProgramItem[]>(API_ENDPOINTS.program);
      return allItems.filter(item => item.latitude != null && item.longitude != null);
    } catch (error) {
      console.error('Error fetching program items with locations:', error);
      throw new Error('Er ging iets mis bij het ophalen van programma items met locaties');
    }
  },

  /**
   * Group program items by category
   */
  groupByCategory: (items: ProgramItem[]): Record<string, ProgramItem[]> => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Overig';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ProgramItem[]>);
  }
};