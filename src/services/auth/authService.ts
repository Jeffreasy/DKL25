/**
 * Authentication Service
 * Handles all authentication operations including login, logout, and profile management
 */

import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { tokenManager } from './tokenManager';
import type {
  LoginCredentials,
  LoginResponse,
  User,
  ProfileResponse,
  RefreshTokenResponse,
  ResetPasswordRequest,
} from '../../types/auth';

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        {
          email: credentials.email,
          wachtwoord: credentials.password,
        }
      );

      if (response.success && response.token && response.refresh_token) {
        // Store tokens and user data
        tokenManager.setTokens(response.token, response.refresh_token);
        tokenManager.setUserData(response.user);
        
        console.log('Login successful:', {
          user: response.user.email,
          permissions: response.user.permissions?.length || 0,
          roles: response.user.roles?.length || 0,
        });
      } else {
        throw new Error('Invalid login response from server');
      }

      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout - clear tokens and optionally notify backend
   */
  async logout(): Promise<void> {
    try {
      // Notify backend (optional, will clear session)
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
      console.log('Logout completed');
    }
  }

  /**
   * Get current user profile (with fresh permissions)
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        API_ENDPOINTS.auth.profile
      );

      // Update stored user data
      tokenManager.setUserData(response.user);
      
      console.log('Profile loaded:', {
        user: response.user.email,
        permissions: response.user.permissions?.length || 0,
      });

      return response.user;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.error || 'Failed to load profile');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string> {
    try {
      return await tokenManager.refreshToken();
    } catch (error: any) {
      console.error('Refresh token error:', error);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Reset/change password (requires authentication)
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.resetPassword, {
        current_password: request.current_password,
        new_password: request.new_password,
      });
      
      console.log('Password changed successfully');
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  /**
   * Get currently logged in user (from localStorage)
   * Note: This may be stale, use getProfile() for fresh data
   */
  getCurrentUser(): User | null {
    return tokenManager.getUserData();
  }

  /**
   * Get access token (for manual API calls)
   */
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  }

  /**
   * Check if current user has a specific permission
   * Note: This checks locally stored permissions, may be stale
   */
  hasPermission(resource: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;

    return user.permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  }

  /**
   * Check if current user has admin access
   */
  isAdmin(): boolean {
    return this.hasPermission('admin', 'access');
  }

  /**
   * Check if current user has staff access
   */
  isStaff(): boolean {
    return this.hasPermission('staff', 'access') || this.isAdmin();
  }

  /**
   * Get user's roles
   */
  getUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.roles?.map(r => r.name) || [];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(roleName: string): boolean {
    return this.getUserRoles().includes(roleName);
  }
}

// Export singleton instance
export const authService = new AuthService();