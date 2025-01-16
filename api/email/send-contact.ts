import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialiseer Mailgun client
const mailgun = new Mailgun(FormData);
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = 'dekoninklijkeloop.nl';

// Debug logging
console.log('Mailgun Config:', {
  key: MAILGUN_API_KEY.slice(-12),  // Alleen laatste deel van key
  domain: MAILGUN_DOMAIN,
  region: 'EU'
});

const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net'
});

// Test de verbinding
console.log('Testing Mailgun connection:', {
  domain: 'dekoninklijkeloop.nl',
  hasKey: !!MAILGUN_API_KEY,
  keyLength: MAILGUN_API_KEY.length,
  region: 'EU'
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
