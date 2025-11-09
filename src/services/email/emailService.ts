/**
 * Email Service
 * Handles email sending via backend API
 */

import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type { ContactFormData } from '../../types/contact';

export interface RegistrationEmailData {
  naam: string;
  email: string;
  rol: string;
  afstand: string;
  ondersteuning: string;
  bijzonderheden?: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
}

class EmailService {
  /**
   * Send contact form email
   */
  async sendContactEmail(data: ContactFormData): Promise<EmailResponse> {
    try {
      const response = await apiClient.post<EmailResponse>(
        API_ENDPOINTS.email.contact,
        {
          naam: data.naam,
          email: data.email,
          bericht: data.bericht,
        }
      );

      console.log('Contact email sent successfully');
      return response;
    } catch (error: unknown) {
      console.error('Contact email error:', error);
      const errorMessage = error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'error' in error.response.data &&
        typeof error.response.data.error === 'string'
          ? error.response.data.error
          : 'Kon email niet verzenden';
      throw new Error(errorMessage);
    }
  }

  /**
   * Send registration confirmation email
   */
  async sendRegistrationEmail(data: RegistrationEmailData): Promise<EmailResponse> {
    try {
      const response = await apiClient.post<EmailResponse>(
        API_ENDPOINTS.email.registration,
        {
          naam: data.naam,
          email: data.email,
          rol: data.rol,
          afstand: data.afstand,
          ondersteuning: data.ondersteuning,
          bijzonderheden: data.bijzonderheden,
          privacy_akkoord: true, // Backend requires this field
        }
      );

      console.log('Registration email sent successfully');
      return response;
    } catch (error: unknown) {
      console.error('Registration email error:', error);
      const errorMessage = error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'error' in error.response.data &&
        typeof error.response.data.error === 'string'
          ? error.response.data.error
          : 'Kon bevestigingsmail niet verzenden';
      throw new Error(errorMessage);
    }
  }

  /**
   * Send custom email (requires authentication and permission)
   */
  async sendCustomEmail(params: {
    to: string;
    subject: string;
    body: string;
  }): Promise<EmailResponse> {
    try {
      const response = await apiClient.post<EmailResponse>(
        API_ENDPOINTS.email.send,
        params
      );

      console.log('Custom email sent successfully');
      return response;
    } catch (error: unknown) {
      console.error('Send email error:', error);
      const errorMessage = error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'error' in error.response.data &&
        typeof error.response.data.error === 'string'
          ? error.response.data.error
          : 'Kon email niet verzenden';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();