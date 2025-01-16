import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { getContactEmailHtml } from '@/utils/emailTemplates';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Genereer HTML voor beide emails
      const userHtml = getContactEmailHtml({
        naam: data.naam,
        email: data.email,
        bericht: data.bericht,
        isConfirmation: true
      });

      const adminHtml = getContactEmailHtml({
        naam: data.naam,
        email: data.email,
        bericht: data.bericht,
        isConfirmation: false
      });

      // Verstuur email naar gebruiker
      const userResponse = await fetch('/api/email/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          subject: 'Bedankt voor je bericht - De Koninklijke Loop',
          html: userHtml,
          replyTo: 'info@dekoninklijkeloop.nl'
        })
      });

      // Verstuur email naar admin
      const adminResponse = await fetch('/api/email/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@dekoninklijkeloop.nl',
          subject: `Nieuw contactformulier van ${data.naam}`,
          html: adminHtml,
          replyTo: data.email
        })
      });

      if (!userResponse.ok || !adminResponse.ok) {
        throw new Error('Failed to send email');
      }

      return { success: true };
    } catch (error) {
      console.error('Contact form error:', error);
      return { 
        success: false, 
        message: 'Er ging iets mis bij het versturen van het formulier' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContactForm, isSubmitting };
}; 