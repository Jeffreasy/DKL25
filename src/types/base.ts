/**
 * Base TypeScript types for DKL25 application
 * Provides reusable entity interfaces for consistent data modeling
 */

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

/**
 * Entity with visibility control
 */
export interface VisibleEntity extends BaseEntity {
  visible: boolean
}

/**
 * Entity with ordering capability
 */
export interface OrderedEntity extends VisibleEntity {
  order_number: number
}

/**
 * Entity with name field
 */
export interface NamedEntity extends BaseEntity {
  name: string
}

/**
 * Entity with logo and website
 */
export interface LogoEntity extends NamedEntity {
  logo: string
  website: string | null
}

/**
 * Entity with description
 */
export interface DescribedEntity extends NamedEntity {
  description: string
}

/**
 * Media entity with URL
 */
export interface MediaEntity extends BaseEntity {
  url: string
  alt?: string
  caption?: string
}

/**
 * Timestamped entity
 */
export interface TimestampedEntity {
  created_at: string
  updated_at: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * Filter options
 */
export interface FilterOptions {
  [key: string]: any
}

/**
 * Query options for API calls
 */
export interface QueryOptions {
  sort?: SortOptions
  filter?: FilterOptions
  pagination?: {
    page: number
    pageSize: number
  }
  // Simple query parameters
  visible?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
  search?: string
}