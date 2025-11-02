/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '../services/auth/authService';
import type { User, LoginCredentials } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      // Check if user has valid token
      if (authService.isAuthenticated()) {
        try {
          // Load user profile from backend
          const userData = await authService.getProfile();
          setUser(userData);
          setError(null);
        } catch (error: any) {
          console.error('Failed to load user profile:', error);
          // Token is invalid, clear it
          await authService.logout();
          setUser(null);
          setError(null); // Don't show error on init
        }
      } else {
        // Check if we have cached user data but no valid token
        const cachedUser = authService.getCurrentUser();
        if (cachedUser) {
          // User data exists but token is gone - clear it
          await authService.logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Login mislukt. Controleer je gegevens.';
      setError(errorMessage);
      throw error; // Re-throw so caller can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear user even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data from backend
   */
  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      return;
    }

    try {
      const userData = await authService.getProfile();
      setUser(userData);
      setError(null);
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      setError('Kon gebruikersgegevens niet verversen');
      // Don't logout on refresh error, token might still be valid
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}