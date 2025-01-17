import type { ContactFormData } from '@/types/contact';
import type { RegistrationFormData } from '@/pages/Aanmelden/types/schema';

interface EmailParams {
  type: 'contact' | 'registration';
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  data?: any;
}

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Gecombineerde email service
export const sendEmail = async (params: EmailParams) => {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N webhook URL not configured');
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) throw new Error(`Failed to send ${params.type} email`);
    return await response.json();
  } catch (error) {
    console.error(`${params.type} email error:`, error);
    throw error;
  }
};

// Helper functies
export const sendContactEmail = async (params: Omit<EmailParams, 'type'>) => {
  return sendEmail({ ...params, type: 'contact' });
};

export const sendConfirmationEmail = async (data: RegistrationFormData) => {
  return sendEmail({
    type: 'registration',
    to: data.email,
    subject: 'Bedankt voor je aanmelding - De Koninklijke Loop 2025',
    html: '', // N8n zal de template genereren
    data
  });
}; 