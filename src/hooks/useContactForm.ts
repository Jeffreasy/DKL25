import { useState } from 'react';
import type { ContactFormData } from '@/types/contact';
import { supabase } from '@/lib/supabase';

const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Debug log om te zien of de URL correct wordt geladen
console.log('Contact Form - N8N Webhook URL:', n8nWebhookUrl);

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);

      // Debug logs
      console.log('Contact Form - Starting submission');
      console.log('Contact Form - Form data:', data);

      // 1. Sla op in Supabase
      const { data: contact, error: supabaseError } = await supabase
        .from('contact_formulieren')
        .insert([{
          naam: data.naam,
          email: data.email,
          bericht: data.bericht,
          privacy_akkoord: data.privacy_akkoord,
          email_verzonden: false,
          status: 'nieuw'
        }])
        .select()
        .single();

      if (supabaseError) {
        console.error('Contact Form - Supabase error:', supabaseError);
        throw supabaseError;
      }

      // 2. Stuur naar n8n webhook
      const webhookData = {
        type: 'contact',
        contactId: contact.id,
        naam: data.naam,
        email: data.email,
        bericht: data.bericht,
        timestamp: new Date().toISOString()
      };

      let response: Response;
      response = await fetch(n8nWebhookUrl?.trim() ?? '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      const responseText = await response.text();
      console.log('Contact Form - N8N Response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${responseText}`);
      }

      // 3. Update status
      await supabase
        .from('contact_formulieren')
        .update({ 
          email_verzonden: true,
          email_verzonden_op: new Date().toISOString()
        })
        .eq('id', contact.id);

      return { success: true };
    } catch (error) {
      console.error('Contact Form - Error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Er ging iets mis'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContactForm, isSubmitting };
}; 