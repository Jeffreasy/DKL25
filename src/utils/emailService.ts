/**
 * Email Service
 * Wrapper around backend email service for backward compatibility
 */

import { emailService as backendEmailService } from '../services/email/emailService';
import type { ContactFormData } from '@/types/contact';
import type { RegistrationFormData } from '@/pages/Aanmelden/types/schema';

/**
 * Send contact form email via backend
 */
export const sendContactEmail = async (data: ContactFormData) => {
  return backendEmailService.sendContactEmail(data);
};

/**
 * Send registration confirmation email via backend
 */
export const sendAanmeldingEmail = async (data: RegistrationFormData) => {
  return backendEmailService.sendRegistrationEmail({
    naam: data.naam,
    email: data.email,
    rol: data.rol,
    afstand: data.afstand,
    ondersteuning: data.ondersteuning,
    bijzonderheden: data.bijzonderheden
  });
};

// Export backend email service for direct use
export { emailService } from '../services/email/emailService';