import type { VercelRequest, VercelResponse } from '@vercel/node';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, naam, rol, afstand } = req.body;

    // Mailgun setup binnen de function voor betere serverless performance
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env['MAILGUN_API_KEY']!
    });

    // Verstuur email
    await mg.messages.create(process.env['MAILGUN_DOMAIN']!, {
      from: process.env['MAILGUN_FROM'],
      to: email,
      subject: 'Bedankt voor je aanmelding - De Koninklijke Loop',
      template: 'dkl-registration',
      'h:X-Mailgun-Variables': JSON.stringify({
        naam,
        rol,
        afstand,
        eventDate: '17 mei 2025'
      })
    });

    return res.status(200).json({ 
      success: true,
      message: 'Bevestigingsmail is verstuurd'
    });

  } catch (error) {
    console.error('Mailgun error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env['NODE_ENV'] === 'development' ? error : undefined
    });
  }
} 