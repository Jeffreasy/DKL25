import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getRegistrationEmailHtml } from './templates/registration';
import { z } from 'zod';

// Request body validatie schema
const RequestSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  rol: z.enum(['Deelnemer', 'Begeleider', 'Vrijwilliger']),
  afstand: z.string(),
  telefoon: z.string().optional(),
  ondersteuning: z.enum(['Ja', 'Nee', 'Anders']),
  bijzonderheden: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const validatedData = RequestSchema.parse(req.body);

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
      url: 'https://api.eu.mailgun.net'
    });

    // Stuur bevestigingsmail naar deelnemer
    await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'De Koninklijke Loop <noreply@dekoninklijkeloop.nl>',
      to: validatedData.email,
      subject: 'Bedankt voor je aanmelding - De Koninklijke Loop',
      html: getRegistrationEmailHtml({ ...validatedData, isConfirmation: true })
    });

    // Stuur notificatie naar admin
    await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'De Koninklijke Loop <noreply@dekoninklijkeloop.nl>',
      to: 'info@dekoninklijkeloop.nl',
      subject: `Nieuwe ${validatedData.rol.toLowerCase()} aanmelding: ${validatedData.naam}`,
      html: getRegistrationEmailHtml({ ...validatedData, isAdmin: true })
    });

    return res.status(200).json({
      success: true,
      message: 'Bevestigingsmail is verstuurd'
    });

  } catch (error) {
    console.error('Email error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validatie error',
        errors: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Er ging iets mis bij het versturen van de bevestigingsmail'
    });
  }
}