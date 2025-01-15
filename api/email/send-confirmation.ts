import { VercelRequest, VercelResponse } from '@vercel/node';
import { getConfirmationEmailTemplate } from './templates/confirmation';
import { RegistrationSchema } from '../../src/pages/Aanmelden/types/schema';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Valideer environment variables en definieer ze als string
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY as string;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN as string;
const MAILGUN_FROM = process.env.MAILGUN_FROM as string;

// Runtime checks blijven behouden
if (!MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is not set in environment variables');
}

if (!MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN is not set in environment variables');
}

if (!MAILGUN_FROM) {
  throw new Error('MAILGUN_FROM is not set in environment variables');
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net'
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Log environment variables (verwijder dit in productie)
    console.log('MAILGUN_DOMAIN:', MAILGUN_DOMAIN);
    console.log('MAILGUN_FROM:', MAILGUN_FROM);
    
    // Valideer de input data
    const validatedData = RegistrationSchema.parse(request.body);
    
    // Genereer email HTML
    const html = getConfirmationEmailTemplate(validatedData);

    // Verstuur email naar deelnemer
    try {
      await mg.messages.create(MAILGUN_DOMAIN, {
        from: MAILGUN_FROM,
        to: validatedData.email,
        subject: 'Bedankt voor je aanmelding - De Koninklijke Loop 2025',
        html: html,
        'h:Reply-To': 'info@dekoninklijkeloop.nl'
      });
    } catch (emailError) {
      console.error('Error sending participant email:', emailError);
      throw emailError;
    }

    // Verstuur kopie naar administratie
    try {
      await mg.messages.create(MAILGUN_DOMAIN, {
        from: MAILGUN_FROM,
        to: 'administratie@dekoninklijkeloop.nl',
        subject: `Nieuwe aanmelding: ${validatedData.naam} (${validatedData.rol})`,
        html: html
      });
    } catch (adminEmailError) {
      console.error('Error sending admin email:', adminEmailError);
      // Niet blokkeren voor gebruiker als admin mail mislukt
    }

    return response.status(200).json({
      success: true,
      message: 'Bevestigingsmail is verstuurd'
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    
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