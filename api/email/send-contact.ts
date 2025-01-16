import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getContactEmailHtml } from '@/utils/emailTemplates';

// Initialiseer Mailgun client
const mailgun = new Mailgun(FormData);

// Voeg key- prefix toe als het ontbreekt
const apiKey = process.env.MAILGUN_API_KEY || '';
const formattedApiKey = apiKey.startsWith('key-') ? apiKey : `key-${apiKey}`;

const mg = mailgun.client({
  username: 'api',
  key: formattedApiKey,
  url: 'https://api.eu.mailgun.net',
  timeout: 30000
});

// Log de API key setup
console.log('API Key debug:', {
  original: process.env.MAILGUN_API_KEY?.slice(0, 5) + '...',
  hasPrefix: process.env.MAILGUN_API_KEY?.startsWith('key-'),
  length: process.env.MAILGUN_API_KEY?.length
});

// Voeg extra logging toe
console.log('API Key Debug:', {
  rawKey: process.env.MAILGUN_API_KEY?.slice(0, 10) + '...',
  formattedKey: formattedApiKey.slice(0, 10) + '...',
  hasKeyPrefix: formattedApiKey.startsWith('key-'),
  keyLength: formattedApiKey.length
});

// Log domein configuratie
console.log('Mailgun configuration:', {
  domain: process.env.MAILGUN_DOMAIN,
  endpoint: 'https://api.eu.mailgun.net',
  hasKey: !!process.env.MAILGUN_API_KEY,
  keyFormat: process.env.MAILGUN_API_KEY?.startsWith('key-') ? 'correct' : 'needs prefix'
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

const SANDBOX_DOMAIN = 'sandbox20ddf648b5ee4a13831d9d7bc2c512c6.mailgun.org';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Aan het begin van de handler
  console.log('Environment Check:', {
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY?.slice(0, 10) + '...',
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    NODE_ENV: process.env.NODE_ENV
  });

  // Valideer environment variables
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.error('Missing required environment variables:', {
      hasApiKey: !!process.env.MAILGUN_API_KEY,
      hasDomain: !!process.env.MAILGUN_DOMAIN,
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

    // Voor de API call
    console.log('Mailgun setup:', {
      apiKeyPrefix: process.env.MAILGUN_API_KEY?.startsWith('key-'),
      domainVerified: !!process.env.MAILGUN_DOMAIN,
      fromAddress: `postmaster@${process.env.MAILGUN_DOMAIN}`,
      endpoint: 'https://api.eu.mailgun.net'
    });

    const result = await mg.messages.create(SANDBOX_DOMAIN, {
      from: `De Koninklijke Loop <postmaster@${SANDBOX_DOMAIN}>`,
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
