import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ContactFormData, ContactFormulier, ContactApiResponse } from '@/types/contact';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('Submitting form data:', formData); // Debug log

      // 1. Sla op in Supabase
      const { data, error: supabaseError } = await supabase
        .from('contact_formulieren')
        .insert([{
          naam: formData.naam,
          email: formData.email,
          bericht: formData.bericht,
          privacy_akkoord: formData.privacy_akkoord,
          status: 'nieuw',
          email_verzonden: false
        }])
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError); // Debug log
        throw new Error(
          supabaseError.message === 'JWT expired'
            ? 'Sessie verlopen, vernieuw de pagina'
            : 'Database error: ' + supabaseError.message
        );
      }

      // 2. Verstuur email via API
      const response = await fetch('/api/email/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('API error:', responseData); // Debug log
        throw new Error(responseData.message || 'Er ging iets mis bij het versturen van de email');
      }

      // 3. Update email status
      const { error: updateError } = await supabase
        .from('contact_formulieren')
        .update({ 
          email_verzonden: true,
          email_verzonden_op: new Date().toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Update error:', updateError); // Debug log
        // Niet blokkeren voor gebruiker
      }

      return {
        success: true,
        message: 'Contact formulier succesvol verzonden',
        data: data as ContactFormulier
      };

    } catch (err) {
      console.error('Submit error details:', err); // Debug log
      const message = err instanceof Error ? err.message : 'Er ging iets mis';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContactForm,
    isSubmitting,
    error
  };
}; 