import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { getContactEmailHtml } from '@/utils/emailTemplates';
import { sendEmail } from '@/utils/emailService';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Genereer HTML
      const userHtml = getContactEmailHtml({ ...data, isConfirmation: true });
      const adminHtml = getContactEmailHtml({ ...data, isConfirmation: false });

      // Gebruik emailService
      await Promise.all([
        sendEmail({
          to: data.email,
          subject: 'Bedankt voor je bericht - De Koninklijke Loop',
          html: userHtml,
          replyTo: 'info@dekoninklijkeloop.nl'
        }),
        sendEmail({
          to: 'info@dekoninklijkeloop.nl',
          subject: `Nieuw contactformulier van ${data.naam}`,
          html: adminHtml,
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