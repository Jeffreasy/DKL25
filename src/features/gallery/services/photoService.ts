/**
 * Photo Service
 * API service for photo operations via backend
 */

import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type { Photo } from '../types';

export const photoService = {
  /**
   * Fetch all visible photos
   */
  fetchVisible: async (): Promise<Photo[]> => {
    try {
      return await apiClient.get<Photo[]>(`${API_ENDPOINTS.photos}?visible=true`);
    } catch (error) {
      console.error('Error fetching visible photos:', error);
      throw new Error('Er ging iets mis bij het ophalen van de fotos');
    }
  },

  /**
   * Fetch all photos (requires admin permission)
   */
  fetchAll: async (): Promise<Photo[]> => {
    try {
      return await apiClient.get<Photo[]>(API_ENDPOINTS.photos);
    } catch (error) {
      console.error('Error fetching all photos:', error);
      throw new Error('Er ging iets mis bij het ophalen van alle fotos');
    }
  },

  /**
   * Fetch photo by ID
   */
  fetchById: async (id: string): Promise<Photo | null> => {
    try {
      return await apiClient.get<Photo>(`${API_ENDPOINTS.photos}/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching photo by ID:', error);
      return null;
    }
  },

  /**
   * Fetch photos by year
   */
  fetchByYear: async (year: number): Promise<Photo[]> => {
    try {
      return await apiClient.get<Photo[]>(`${API_ENDPOINTS.photos}?year=${year}`);
    } catch (error) {
      console.error('Error fetching photos by year:', error);
      throw new Error('Er ging iets mis bij het ophalen van fotos per jaar');
    }
  },

  /**
   * Fetch photos by album
   */
  fetchByAlbum: async (albumId: string): Promise<Photo[]> => {
    try {
      return await apiClient.get<Photo[]>(`${API_ENDPOINTS.albums}/${albumId}/photos?sortBy=order_number&sortOrder=asc`);
    } catch (error) {
      console.error('Error fetching photos by album:', error);
      throw new Error('Er ging iets mis bij het ophalen van fotos per album');
    }
  }
};