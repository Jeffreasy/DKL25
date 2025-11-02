/**
 * API Client
 * Centralized HTTP client with JWT authentication and automatic token refresh
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { tokenManager } from '../auth/tokenManager';

// Simple and reliable: localhost uses proxy, everything else uses backend
const API_BASE_URL =
  (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? '' // Localhost → Vite proxy
    : 'https://dklemailservice.onrender.com'; // Production → Direct backend

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor: Add JWT token to every request
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Handle token expired (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Check if we're already refreshing to avoid multiple refresh calls
          if (this.isRefreshing) {
            // Queue this request to be retried after token refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh the token
            const newToken = await tokenManager.refreshToken();
            this.isRefreshing = false;

            // Retry all queued requests with the new token
            this.refreshSubscribers.forEach((callback) => callback(newToken));
            this.refreshSubscribers = [];

            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Token refresh failed - clear tokens and redirect to login
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            tokenManager.clearTokens();

            console.error('Token refresh failed, redirecting to login');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle permission denied (403)
        if (error.response?.status === 403) {
          console.error('Permission denied:', {
            url: error.config?.url,
            method: error.config?.method,
          });
          // Could show a toast notification here
        }

        // Handle rate limit (429)
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded:', error.config?.url);
          // Could show a toast notification here
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Get the base URL
   */
  getBaseURL(): string {
    return API_BASE_URL;
  }

  /**
   * Get the underlying axios instance (for advanced usage)
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export type for external use
export type { AxiosRequestConfig, AxiosError };