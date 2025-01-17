import type { ContactFormData } from '@/types/contact';
import type { RegistrationFormData } from '@/pages/Aanmelden/types/schema';

interface EmailParams {
  type: 'contact' | 'registration';
  to: string;
  subject: string;
  data: {
    naam: string;
    email: string;
    bericht?: string;
    rol?: string;
    afstand?: string;
    ondersteuning?: string;
    bijzonderheden?: string;
  };
  replyTo?: string;
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
      mode: 'no-cors',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (response.type === 'opaque') {
      console.log(`Email sent (${params.type}):`, {
        to: params.to,
        subject: params.subject
      });
    }

    return { success: true };
  } catch (error) {
    console.error(`${params.type} email error:`, error);
    throw error;
  }
};

// Helper functies
export const sendContactEmail = async (data: ContactFormData) => {
  return sendEmail({
    type: 'contact',
    to: data.email,
    subject: 'Bedankt voor je bericht - De Koninklijke Loop',
    data: {
      naam: data.naam,
      email: data.email,
      bericht: data.bericht
    },
    replyTo: 'info@dekoninklijkeloop.nl'
  });
};

export const sendConfirmationEmail = async (data: RegistrationFormData) => {
  return sendEmail({
    type: 'registration',
    to: data.email,
    subject: 'Bedankt voor je aanmelding - De Koninklijke Loop 2025',
    data: {
      naam: data.naam,
      email: data.email,
      rol: data.rol,
      afstand: data.afstand,
      ondersteuning: data.ondersteuning,
      bijzonderheden: data.bijzonderheden
    },
    replyTo: 'info@dekoninklijkeloop.nl'
  });
}; 