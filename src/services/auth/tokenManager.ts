/**
 * Token Manager
 * Handles JWT token storage, retrieval, and automatic refresh
 */

import { STORAGE_KEYS, TOKEN_EXPIRY } from '../../types/auth';
import type { User } from '../../types/auth';

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  /**
   * Get the current access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get the current refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store both access and refresh tokens
   * Also schedules automatic token refresh
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    // Schedule auto-refresh at 15 minutes (5 min before 20min expiry)
    this.scheduleTokenRefresh();
  }

  /**
   * Clear all tokens and user data from storage
   */
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    this.isRefreshing = false;
  }

  /**
   * Get stored user data
   */
  getUserData(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  /**
   * Store user data in localStorage
   */
  setUserData(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Check if user is currently authenticated (has access token)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Schedule automatic token refresh
   * Refreshes at 15 minutes (5 min before 20min expiry)
   */
  private scheduleTokenRefresh(): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Schedule refresh at 15 minutes (before 20min expiry)
    const refreshTime = TOKEN_EXPIRY.ACCESS_TOKEN - TOKEN_EXPIRY.REFRESH_BEFORE;
    
    this.refreshTimer = setTimeout(async () => {
      try {
        console.log('Auto-refreshing access token...');
        await this.refreshToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        this.clearTokens();
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }, refreshTime);
  }

  /**
   * Manually refresh the access token using the refresh token
   * This is called automatically or when a 401 is received
   */
  async refreshToken(): Promise<string> {
    // Prevent concurrent refresh requests
    if (this.isRefreshing) {
      throw new Error('Token refresh already in progress');
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;

    try {
      // Match apiClient logic: localhost uses proxy, production uses full backend URL
      const getBaseUrl = () => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          return ''; // Use Vite proxy
        }
        return import.meta.env.VITE_API_BASE_URL || 'https://dklemailservice.onrender.com';
      };
      
      const baseUrl = getBaseUrl();
      
      const response = await fetch(
        `${baseUrl}/api/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.token || !data.refresh_token) {
        throw new Error('Invalid refresh response');
      }

      // Store new tokens
      this.setTokens(data.token, data.refresh_token);
      
      console.log('Token refreshed successfully');
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Cancel the scheduled token refresh
   */
  cancelRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();