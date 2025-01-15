import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { sendContactForm } from '@/utils/emailService';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await sendContactForm(data);
      return result;
    } catch (error) {
      console.error('Contact form error:', error);
      return { 
        success: false, 
        message: 'Er ging iets mis bij het versturen van je bericht'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContactForm, isSubmitting };
}; 