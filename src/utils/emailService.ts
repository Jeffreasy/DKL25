interface EmailData {
  email: string;
  naam: string;
  rol: string;
  afstand: string;
}

export const sendConfirmationEmail = async (data: EmailData) => {
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
}; 