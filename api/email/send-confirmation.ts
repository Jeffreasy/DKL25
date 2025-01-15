import { VercelRequest, VercelResponse } from '@vercel/node';
import { getConfirmationEmailTemplate } from './templates/confirmation';
import { RegistrationSchema } from '../../src/pages/Aanmelden/types/schema';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Valideer environment variables eerst
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_FROM) {
  console.error('Missing required environment variables:', {
    hasApiKey: !!process.env.MAILGUN_API_KEY,
    hasDomain: !!process.env.MAILGUN_DOMAIN,
    hasFrom: !!process.env.MAILGUN_FROM
  });
  throw new Error('Missing required environment variables');
}

// Initialiseer Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net',
  timeout: 30000
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
      hasFrom: !!process.env.MAILGUN_FROM
    });
    return response.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  console.log('Mailgun Config:', {
    domain: process.env.MAILGUN_DOMAIN,
    from: process.env.MAILGUN_FROM,
    hasApiKey: !!process.env.MAILGUN_API_KEY,
    endpoint: 'https://api.eu.mailgun.net'
  });

  // Log request details
  console.log('Received request:', {
    method: request.method,
    headers: request.headers,
    url: request.url
  });

  // Handle CORS preflight
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
    const validatedData = RegistrationSchema.parse(request.body);
    const html = getConfirmationEmailTemplate(validatedData);

    const fromEmail = process.env.MAILGUN_FROM;
    const domain = process.env.MAILGUN_DOMAIN;

    console.log('Attempting to send email with config:', {
      domain,
      from: fromEmail,
      to: validatedData.email,
      hasApiKey: !!process.env.MAILGUN_API_KEY
    });

    const result = await mg.messages.create(domain, {
      from: fromEmail,
      to: validatedData.email,
      subject: 'Bedankt voor je aanmelding - De Koninklijke Loop 2025',
      html: html
    });

    console.log('Email sent:', result);

    return response.status(200).json({
      success: true,
      message: 'Bevestigingsmail is verstuurd'
    });

  } catch (error) {
    console.error('Detailed error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        domain: process.env.MAILGUN_DOMAIN,
        from: process.env.MAILGUN_FROM
      }
    });

    return response.status(500).json({
      success: false,
      message: 'Er ging iets mis bij het versturen van de bevestigingsmail',
      errors: error instanceof Error ? [{ 
        message: error.message,
        details: error.toString()
      }] : undefined
    });
  }
} 