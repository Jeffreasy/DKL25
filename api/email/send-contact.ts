import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialiseer Mailgun client
const mailgun = new Mailgun(FormData);
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const SANDBOX_DOMAIN = 'sandbox20ddf648b5ee4a13831d9d7bc2c512c6.mailgun.org';

// Simpele logging voor debugging
console.log('Mailgun Setup:', {
  key: MAILGUN_API_KEY.slice(0, 5) + '...',
  keyLength: MAILGUN_API_KEY.length,
  domain: SANDBOX_DOMAIN
});

// Eén enkele client instantie
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net'
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, replyTo } = req.body;
    
    const result = await mg.messages.create(SANDBOX_DOMAIN, {
      from: `De Koninklijke Loop <postmaster@${SANDBOX_DOMAIN}>`,
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
