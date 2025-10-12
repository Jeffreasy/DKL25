import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { trackEvent } from '@/utils/googleAnalytics';

interface SubmitResult {
  success: boolean;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://dklemailservice.onrender.com';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (formData: ContactFormData): Promise<SubmitResult> => {
    console.log('Contact Form - Starting submission');
    console.log('Contact Form - Form data: ', formData);

    setIsSubmitting(true);
    trackEvent('contact', 'submit_start', 'contact_form');

    try {
      // Send email via Go backend API
      const response = await fetch(`${API_BASE_URL}/api/contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Contact Form - API Error:', response.status, errorData);
        throw new Error(errorData.error || 'Er ging iets mis bij het versturen van je bericht');
      }

      const result = await response.json();
      console.log('Contact Form - Success:', result);

      trackEvent('contact', 'submit_success', 'contact_form');
      return {
        success: true,
        message: result.message || 'Bericht succesvol verzonden'
      };
    } catch (error) {
      console.error('Contact Form - Error:', error);
      trackEvent('contact', 'submit_error', error instanceof Error ? error.message : 'unknown_error');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er ging iets mis bij het versturen van je bericht'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContactForm,
    isSubmitting
  };
};