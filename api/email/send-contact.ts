import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialiseer Mailgun client
const mailgun = new Mailgun(FormData);
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = 'dekoninklijkeloop.nl';  // Gebruik het echte domain

// Debug logging
console.log('API Key Check:', {
  key: MAILGUN_API_KEY.replace(/./g, '*'),  // Mask the key
  length: MAILGUN_API_KEY.length,
  hasPrefix: MAILGUN_API_KEY.startsWith('key-'),
  domain: MAILGUN_DOMAIN
});

// Eén enkele client instantie
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY.startsWith('key-') 
    ? MAILGUN_API_KEY 
    : `key-${MAILGUN_API_KEY}`,
  url: 'https://api.eu.mailgun.net'
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, replyTo } = req.body;
    
    const result = await mg.messages.create(MAILGUN_DOMAIN, {
      from: `De Koninklijke Loop <noreply@${MAILGUN_DOMAIN}>`,
      to,
      subject,
      html,
      'h:Reply-To': replyTo
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
