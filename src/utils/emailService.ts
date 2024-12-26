interface EmailData {
  email: string;
  naam: string;
  rol: string;
  afstand: string;
}

interface ContactFormData {
  naam: string;
  email: string;
  bericht: string;
}

export const sendConfirmationEmail = async (data: EmailData) => {
  try {
    const response = await fetch('/api/email/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send confirmation email');
    }

    return response.json();
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send contact form');
    }

    return response.json();
  } catch (error) {
    console.error('Contact form error:', error);
    throw error;
  }
}; 