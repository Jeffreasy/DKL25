/**
 * Data Service
 * Generic data fetching service to replace Supabase queries
 */

import { apiClient } from './apiClient';
import { buildQueryString } from './endpoints';
import type { BaseEntity, QueryOptions } from '../../types/base';

/**
 * Create a data service for a specific endpoint
 * Provides CRUD operations and query functionality
 * 
 * @example
 * const partnerService = createDataService<Partner>('/api/partners');
 * const partners = await partnerService.fetchAll({ visible: true });
 */
export function createDataService<T extends BaseEntity>(endpoint: string) {
  return {
    /**
     * Fetch all records with optional filtering and sorting
     */
    async fetchAll(options?: QueryOptions): Promise<T[]> {
      try {
        const queryString = options ? buildQueryString({
          visible: options.visible,
          sortBy: options.sortBy,
          sortOrder: options.sortOrder,
          limit: options.limit,
          offset: options.offset,
          search: options.search,
        }) : '';

        const url = `${endpoint}${queryString}`;
        return await apiClient.get<T[]>(url);
      } catch (error: any) {
        console.error(`Fetch all error for ${endpoint}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon gegevens niet ophalen'
        );
      }
    },

    /**
     * Fetch a single record by ID
     */
    async fetchById(id: string): Promise<T> {
      try {
        return await apiClient.get<T>(`${endpoint}/${id}`);
      } catch (error: any) {
        console.error(`Fetch by ID error for ${endpoint}/${id}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon record niet vinden'
        );
      }
    },

    /**
     * Create a new record
     */
    async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
      try {
        return await apiClient.post<T>(endpoint, data);
      } catch (error: any) {
        console.error(`Create error for ${endpoint}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon record niet aanmaken'
        );
      }
    },

    /**
     * Update an existing record
     */
    async update(id: string, data: Partial<T>): Promise<T> {
      try {
        return await apiClient.put<T>(`${endpoint}/${id}`, data);
      } catch (error: any) {
        console.error(`Update error for ${endpoint}/${id}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon record niet bijwerken'
        );
      }
    },

    /**
     * Partially update an existing record
     */
    async patch(id: string, data: Partial<T>): Promise<T> {
      try {
        return await apiClient.patch<T>(`${endpoint}/${id}`, data);
      } catch (error: any) {
        console.error(`Patch error for ${endpoint}/${id}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon record niet bijwerken'
        );
      }
    },

    /**
     * Delete a record
     */
    async delete(id: string): Promise<void> {
      try {
        await apiClient.delete<void>(`${endpoint}/${id}`);
      } catch (error: any) {
        console.error(`Delete error for ${endpoint}/${id}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon record niet verwijderen'
        );
      }
    },

    /**
     * Fetch only visible records (convenience method)
     */
    async fetchVisible(options?: Omit<QueryOptions, 'visible'>): Promise<T[]> {
      return this.fetchAll({ ...options, visible: true });
    },

    /**
     * Count records (if backend supports it)
     */
    async count(options?: Pick<QueryOptions, 'visible' | 'search'>): Promise<number> {
      try {
        const queryString = options ? buildQueryString(options) : '';
        const response = await apiClient.get<{ count: number }>(
          `${endpoint}/count${queryString}`
        );
        return response.count;
      } catch (error: any) {
        console.error(`Count error for ${endpoint}:`, error);
        // Return 0 if count endpoint doesn't exist
        return 0;
      }
    },

    /**
     * Bulk create (if backend supports it)
     */
    async bulkCreate(data: Array<Omit<T, keyof BaseEntity>>): Promise<T[]> {
      try {
        return await apiClient.post<T[]>(`${endpoint}/bulk`, data);
      } catch (error: any) {
        console.error(`Bulk create error for ${endpoint}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon records niet aanmaken'
        );
      }
    },

    /**
     * Bulk delete (if backend supports it)
     */
    async bulkDelete(ids: string[]): Promise<void> {
      try {
        await apiClient.post<void>(`${endpoint}/bulk-delete`, { ids });
      } catch (error: any) {
        console.error(`Bulk delete error for ${endpoint}:`, error);
        throw new Error(
          error.response?.data?.error || 'Kon records niet verwijderen'
        );
      }
    },
  };
}

/**
 * Type for service instance
 */
export type DataService<T extends BaseEntity> = ReturnType<typeof createDataService<T>>;