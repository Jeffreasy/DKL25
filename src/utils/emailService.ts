import type { ContactFormData } from '@/types/contact';
import type { RegistrationFormData } from '@/pages/Aanmelden/types/schema';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    message: string;
  }>;
}

export const sendEmail = async (params: EmailParams): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/email/send-contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email error:', {
        status: response.status,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (
  data: RegistrationFormData,
  endpoint: string = '/api/email/send-confirmation'
): Promise<EmailResponse> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Confirmation email error:', error);
    throw error;
  }
}; 