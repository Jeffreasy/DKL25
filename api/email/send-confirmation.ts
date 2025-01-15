import { VercelRequest, VercelResponse } from '@vercel/node';
import { getConfirmationEmailTemplate } from './templates/confirmation';
import { RegistrationSchema } from '../../src/pages/Aanmelden/types/schema';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Type voor Mailgun error
interface MailgunError extends Error {
  message: string;
  details?: string;
}

// Valideer environment variables en log ze (verwijder logs in productie)
const requiredEnvVars = {
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY ?? '',
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN ?? '',
  MAILGUN_FROM: process.env.MAILGUN_FROM ?? ''
} as const;

// Check alle environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  console.log(`${key} is set`); // Verwijder in productie
});

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: requiredEnvVars.MAILGUN_API_KEY, // Nu is dit een string
  url: 'https://api.eu.mailgun.net'
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  console.log('Received request:', {
    method: request.method,
    headers: request.headers,
    url: request.url
  });

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
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

    try {
      // Test Mailgun connectie
      console.log('Testing Mailgun connection...');
      const domains = await mg.domains.list();
      console.log('Mailgun domains:', domains);

      // Verstuur email
      const result = await mg.messages.create(requiredEnvVars.MAILGUN_DOMAIN, {
        from: requiredEnvVars.MAILGUN_FROM,
        to: validatedData.email,
        subject: 'Bedankt voor je aanmelding - De Koninklijke Loop 2025',
        html: html,
        'h:Reply-To': 'info@dekoninklijkeloop.nl'
      });

      console.log('Email sent:', result);

      return response.status(200).json({
        success: true,
        message: 'Bevestigingsmail is verstuurd'
      });

    } catch (error) {
      const mailgunError = error as MailgunError;
      console.error('Mailgun error:', mailgunError);
      return response.status(500).json({
        success: false,
        message: 'Er ging iets mis bij het versturen van de bevestigingsmail',
        errors: [{
          message: mailgunError.message,
          details: mailgunError.toString()
        }]
      });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return response.status(500).json({
      success: false,
      message: 'Er ging iets mis bij het verwerken van je aanmelding',
      errors: error instanceof Error ? [{ 
        message: error.message,
        details: error.toString()
      }] : undefined
    });
  }
} 