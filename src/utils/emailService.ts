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
    const fullUrl = `/api/email/send`;
    const apiUrl = fullUrl.startsWith('http') 
      ? fullUrl 
      : `${window.location.origin}${fullUrl}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        replyTo
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        origin: window.location.origin
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: EmailResponse = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

export const sendContactForm = async (data: ContactFormData) => {
  try {
    const fullUrl = `/api/email/send-contact`;
    const apiUrl = fullUrl.startsWith('http') 
      ? fullUrl 
      : `${window.location.origin}${fullUrl}`;

    console.log('Sending contact request to:', apiUrl, 'with data:', data);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        origin: window.location.origin
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error) {
    console.error('Contact form error:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (
  data: RegistrationFormData, 
  apiUrl = '/api/email/send-confirmation'
) => {
  try {
    const fullUrl = apiUrl.startsWith('http') 
      ? apiUrl 
      : `${window.location.origin}${apiUrl}`;

    console.log('Sending confirmation request to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error) {
    console.error('Confirmation email error:', error);
    throw error;
  }
}; 