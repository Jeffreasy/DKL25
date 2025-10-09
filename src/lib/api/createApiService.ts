/**
 * API Service Factory
 * Creates reusable API service instances for CRUD operations
 */

import { supabase } from '../supabase'
import type { BaseEntity, QueryOptions } from '../../types/base'
import type { Database } from '../../types/supabase'

type TableName = keyof Database['public']['Tables']

export interface ApiServiceConfig<T> {
  endpoint: TableName
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
  filterBy?: Partial<T>
}

export interface ApiService<T> {
  fetchAll: (options?: QueryOptions) => Promise<T[]>
  fetchById: (id: string) => Promise<T | null>
  create: (data: Omit<T, keyof BaseEntity>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<void>
  fetchVisible: () => Promise<T[]>
}

/**
 * Creates a typed API service for a Supabase table
 */
export function createApiService<T extends BaseEntity>(
  config: ApiServiceConfig<T>
): ApiService<T> {
  const { endpoint, sortBy, sortDirection = 'asc', filterBy } = config

  /**
   * Fetch all records with optional filtering and sorting
   */
  const fetchAll = async (options?: QueryOptions): Promise<T[]> => {
    let query = supabase.from(endpoint as any).select('*')

    // Apply filters
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    } else if (filterBy) {
      Object.entries(filterBy).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply sorting
    if (options?.sort) {
      query = query.order(options.sort.field, {
        ascending: options.sort.direction === 'asc'
      })
    } else if (sortBy) {
      query = query.order(sortBy as string, {
        ascending: sortDirection === 'asc'
      })
    }

    // Apply pagination
    if (options?.pagination) {
      const { page, pageSize } = options.pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`)
    }

    return (data as unknown as T[]) || []
  }

  /**
   * Fetch a single record by ID
   */
  const fetchById = async (id: string): Promise<T | null> => {
    const { data, error } = await supabase
      .from(endpoint as any)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching ${endpoint} by ID:`, error)
      return null
    }

    return data as unknown as T
  }

  /**
   * Create a new record
   */
  const create = async (data: Omit<T, keyof BaseEntity>): Promise<T> => {
    const { data: newRecord, error } = await supabase
      .from(endpoint as any)
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error(`Error creating ${endpoint}:`, error)
      throw new Error(`Failed to create ${endpoint}: ${error.message}`)
    }

    return newRecord as unknown as T
  }

  /**
   * Update an existing record
   */
  const update = async (id: string, data: Partial<T>): Promise<T> => {
    const { data: updatedRecord, error } = await supabase
      .from(endpoint as any)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating ${endpoint}:`, error)
      throw new Error(`Failed to update ${endpoint}: ${error.message}`)
    }

    return updatedRecord as unknown as T
  }

  /**
   * Delete a record
   */
  const deleteRecord = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(endpoint as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting ${endpoint}:`, error)
      throw new Error(`Failed to delete ${endpoint}: ${error.message}`)
    }
  }

  /**
   * Fetch only visible records (if entity has visible field)
   */
  const fetchVisible = async (): Promise<T[]> => {
    const { data, error } = await supabase
      .from(endpoint as any)
      .select('*')
      .eq('visible', true)
      .order(sortBy as string || 'created_at', {
        ascending: sortDirection === 'asc'
      })

    if (error) {
      console.error(`Error fetching visible ${endpoint}:`, error)
      throw new Error(`Failed to fetch visible ${endpoint}: ${error.message}`)
    }

    return (data as unknown as T[]) || []
  }

  return {
    fetchAll,
    fetchById,
    create,
    update,
    delete: deleteRecord,
    fetchVisible
  }
}

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: any, context: string): never => {
  console.error(`API Error in ${context}:`, error)
  throw new Error(
    error?.message || `An error occurred in ${context}`
  )
}