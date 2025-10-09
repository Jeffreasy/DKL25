/**
 * API Request Handler
 * Centralized error handling and response processing
 */

export interface RequestOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  showToast?: boolean
  retries?: number
  retryDelay?: number
}

/**
 * Handle API requests with error handling
 */
export const handleApiRequest = async <T>(
  request: Promise<T>,
  options?: RequestOptions<T>
): Promise<T | null> => {
  const { onSuccess, onError, showToast = false } = options || {}

  try {
    const data = await request
    onSuccess?.(data)
    return data
  } catch (error) {
    const err = error as Error
    console.error('API Request Error:', err)
    onError?.(err)
    
    if (showToast && typeof window !== 'undefined') {
      // Toast notification would be shown here if toast library is available
      console.error('Error:', err.message)
    }
    
    return null
  }
}

/**
 * Retry failed requests
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}

/**
 * Batch multiple requests
 */
export const batchRequests = async <T>(
  requests: Array<Promise<T>>
): Promise<Array<T | null>> => {
  const results = await Promise.allSettled(requests)
  
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      console.error('Batch request failed:', result.reason)
      return null
    }
  })
}

/**
 * Create abort controller for cancellable requests
 */
export const createAbortController = () => {
  const controller = new AbortController()
  
  return {
    signal: controller.signal,
    abort: () => controller.abort(),
    isAborted: () => controller.signal.aborted
  }
}

/**
 * Debounce API calls
 */
export const debounceRequest = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeoutId: NodeJS.Timeout | null = null
  let latestResolve: ((value: any) => void) | null = null
  let latestReject: ((reason?: any) => void) | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        latestReject?.(new Error('Request cancelled'))
      }

      latestResolve = resolve
      latestReject = reject

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          latestResolve?.(result)
        } catch (error) {
          latestReject?.(error)
        }
      }, delay)
    })
  }
}

/**
 * Transform API error to user-friendly message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'Er is een onbekende fout opgetreden'
}

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('NetworkError')
    )
  }
  return false
}

/**
 * Check if error is timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('timeout') ||
      error.message.includes('timed out')
    )
  }
  return false
}