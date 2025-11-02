/**
 * Album Service
 * API service for album operations via backend
 */

import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type { Album, Photo } from '../types';

export const albumService = {
  /**
   * Fetch all visible albums
   */
  fetchVisible: async (): Promise<Album[]> => {
    try {
      return await apiClient.get<Album[]>(`${API_ENDPOINTS.albums}?visible=true&sortBy=order_number&sortOrder=asc`);
    } catch (error) {
      console.error('Error fetching visible albums:', error);
      throw new Error('Er ging iets mis bij het ophalen van de albums');
    }
  },

  /**
   * Fetch all albums (requires admin permission)
   */
  fetchAll: async (): Promise<Album[]> => {
    try {
      return await apiClient.get<Album[]>(`${API_ENDPOINTS.albums}?sortBy=order_number&sortOrder=asc`);
    } catch (error) {
      console.error('Error fetching all albums:', error);
      throw new Error('Er ging iets mis bij het ophalen van alle albums');
    }
  },

  /**
   * Fetch album by ID
   */
  fetchById: async (id: string): Promise<Album | null> => {
    try {
      return await apiClient.get<Album>(`${API_ENDPOINTS.albums}/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching album by ID:', error);
      return null;
    }
  },

  /**
   * Fetch album with photos
   */
  fetchWithPhotos: async (albumId: string): Promise<Album | null> => {
    try {
      // Get album
      const album = await albumService.fetchById(albumId);
      if (!album) {
        return null;
      }

      // Get photos for this album via backend endpoint
      const photos = await apiClient.get<Photo[]>(`${API_ENDPOINTS.albums}/${albumId}/photos?sortBy=order_number&sortOrder=asc`);

      return {
        ...album,
        photos: photos
      };
    } catch (error) {
      console.error('Error fetching album with photos:', error);
      return null;
    }
  },

  /**
   * Fetch all albums with cover photos
   */
  fetchWithCovers: async (): Promise<Album[]> => {
    try {
      // Note: Backend should support filtering on non-null fields
      const allAlbums = await apiClient.get<Album[]>(API_ENDPOINTS.albums);
      return allAlbums.filter(album => album.cover_photo_id != null);
    } catch (error) {
      console.error('Error fetching albums with covers:', error);
      throw new Error('Er ging iets mis bij het ophalen van albums met covers');
    }
  }
};