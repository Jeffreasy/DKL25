import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { sendEmail } from '@/utils/emailService';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Verstuur beide emails
      await Promise.all([
        // Gebruiker bevestiging
        sendEmail({
          type: 'contact',
          to: data.email,
          subject: 'Bedankt voor je bericht - De Koninklijke Loop',
          data: {
            naam: data.naam,
            email: data.email,
            bericht: data.bericht
          },
          replyTo: 'info@dekoninklijkeloop.nl'
        }),
        // Admin notificatie
        sendEmail({
          type: 'contact',
          to: 'info@dekoninklijkeloop.nl',
          subject: `Nieuw contactformulier van ${data.naam}`,
          data: {
            naam: data.naam,
            email: data.email,
            bericht: data.bericht
          },
          replyTo: data.email
        })
      ]);

      return { success: true };
    } catch (error) {
      console.error('Contact form error:', error);
      return { success: false, message: 'Er ging iets mis bij het versturen' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContactForm, isSubmitting };
}; 