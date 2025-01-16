import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialiseer Mailgun client
const mailgun = new Mailgun(FormData);
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';

// Debug logging
console.log('Mailgun Setup:', {
  keyLength: MAILGUN_API_KEY.length,
  keyEnd: MAILGUN_API_KEY.slice(-12),
  domain: MAILGUN_DOMAIN,
  hasValidDomain: !!MAILGUN_DOMAIN
});

// Valideer environment variables
if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  console.error('Missing required environment variables');
  throw new Error('Invalid configuration');
}

// Initialiseer client met basis configuratie
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net'
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Log request details
    console.log('Sending email with:', {
      to: req.body.to,
      subject: req.body.subject,
      replyTo: req.body.replyTo,
      domain: MAILGUN_DOMAIN
    });

    const result = await mg.messages.create(MAILGUN_DOMAIN, {
      from: `De Koninklijke Loop <noreply@${MAILGUN_DOMAIN}>`,
      ...req.body
    });

    console.log('Email sent:', result);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Mailgun error:', {
      error,
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : String(error)
    });

    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
