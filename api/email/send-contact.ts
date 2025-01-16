import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getContactEmailHtml } from '@/utils/emailTemplates';

// Initialiseer Mailgun client
console.log('Initializing Mailgun client with:', {
  url: 'https://api.eu.mailgun.net',
  hasKey: !!process.env.MAILGUN_API_KEY,
  keyLength: process.env.MAILGUN_API_KEY?.length
});

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY?.trim() || '',
  url: 'https://api.eu.mailgun.net'
});

// Log domein configuratie
console.log('Mailgun configuration:', {
  domain: process.env.MAILGUN_DOMAIN,
  from: process.env.MAILGUN_FROM,
  endpoint: 'https://api.eu.mailgun.net'
});

// Log alle environment variables bij startup
console.log('Available environment variables:', {
  allKeys: Object.keys(process.env),
  mailgunKeys: Object.keys(process.env).filter(key => key.includes('MAILGUN')),
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunFrom: process.env.MAILGUN_FROM,
  // Niet de API key loggen voor veiligheid
  hasApiKey: !!process.env.MAILGUN_API_KEY
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Valideer environment variables
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_FROM) {
    console.error('Missing required environment variables:', {
      hasApiKey: !!process.env.MAILGUN_API_KEY,
      hasDomain: !!process.env.MAILGUN_DOMAIN,
      hasFrom: !!process.env.MAILGUN_FROM,
      envKeys: Object.keys(process.env).filter(key => key.includes('MAILGUN'))
    });
    return response.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', 'https://www.dekoninklijkeloop.nl');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Max-Age', '86400');
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false, 
      message: `Method ${request.method} not allowed` 
    });
  }

  try {
    const { to, subject, html, replyTo } = request.body;

    // Log de request details
    console.log('Processing request:', {
      method: request.method,
      headers: request.headers,
      bodyKeys: Object.keys(request.body)
    });

    // Log de request body
    console.log('Request body:', {
      to,
      subject: subject?.slice(0, 50),
      htmlLength: html?.length,
      replyTo
    });

    // Valideer verplichte velden
    if (!to || !subject || !html) {
      console.error('Missing required fields:', { 
        hasTo: !!to, 
        hasSubject: !!subject, 
        hasHtml: !!html 
      });
      return response.status(400).json({
        success: false,
        message: 'Verplichte velden ontbreken'
      });
    }

    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN?.trim() || '', {
      from: `De Koninklijke Loop <noreply@${process.env.MAILGUN_DOMAIN?.trim() || ''}>`,
      to,
      subject,
      html,
      'h:Reply-To': replyTo
    });

    console.log('Email sent:', result);

    return response.status(200).json({
      success: true,
      message: 'Email is verstuurd'
    });

  } catch (error) {
    console.error('Email error:', error);
    return response.status(500).json({
      success: false,
      message: 'Er ging iets mis bij het versturen van de email',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
