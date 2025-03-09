import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { trackEvent } from '@/utils/googleAnalytics';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

interface SubmitResult {
  success: boolean;
  message?: string;
}

type ContactFormulier = Database['public']['Tables']['contact_formulieren']['Insert'];

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (formData: ContactFormData): Promise<SubmitResult> => {
    console.log('Contact Form - Starting submission');
    console.log('Contact Form - Form data: ', formData);
    
    setIsSubmitting(true);
    trackEvent('contact', 'submit_start', 'contact_form');

    try {
      // First save to Supabase
      const contactData: ContactFormulier = {
        naam: formData.naam,
        email: formData.email,
        bericht: formData.bericht,
        privacy_akkoord: formData.privacy_akkoord,
        email_verzonden: false,
        status: 'nieuw',
        behandeld_door: null,
        notities: null
      };

      const { error: supabaseError } = await supabase
        .from('contact_formulieren')
        .insert(contactData);

      if (supabaseError) {
        console.error('Contact Form - Supabase Error:', supabaseError);
        throw new Error('Er ging iets mis bij het opslaan van je bericht');
      }

      // Then send email
      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verzonden: false,
          status: 'nieuw'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Er ging iets mis bij het versturen van je bericht');
      }

      trackEvent('contact', 'submit_success', 'contact_form');
      return {
        success: true,
        message: 'Je bericht is succesvol opgeslagen en verzonden'
      };
    } catch (error) {
      console.error('Contact Form - Error:', error);
      trackEvent('contact', 'submit_error', error instanceof Error ? error.message : 'unknown_error');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er ging iets mis bij het versturen van je bericht. Probeer het later opnieuw.'
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