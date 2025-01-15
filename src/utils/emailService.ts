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

export const sendEmail = async ({
  to,
  subject,
  html,
  replyTo
}: EmailParams) => {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        replyTo
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: EmailResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

export const sendContactForm = async (data: ContactFormData) => {
  try {
    const response = await fetch('/api/email/send-contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (data: RegistrationFormData) => {
  try {
    const response = await fetch('/api/email/send-confirmation', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Confirmation email error:', error);
    throw error;
  }
}; 