import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getContactEmailHtml } from './templates/contact';
import { z } from 'zod';

// Request body validatie schema
const ContactSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  bericht: z.string()
    .min(10, 'Bericht moet minimaal 10 karakters zijn')
    .max(1000, 'Bericht mag maximaal 1000 karakters zijn'),
  privacy: z.boolean().refine((val) => val === true, 'Je moet akkoord gaan met het privacybeleid')
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
    const validatedData = ContactSchema.parse(req.body);

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
      url: 'https://api.eu.mailgun.net'
    });

    // Stuur notificatie naar admin
    await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'De Koninklijke Loop <noreply@dekoninklijkeloop.nl>',
      to: 'info@dekoninklijkeloop.nl',
      subject: `Nieuw contactformulier bericht van ${validatedData.naam}`,
      html: getContactEmailHtml({ ...validatedData, isConfirmation: false })
    });

    // Stuur bevestiging naar afzender
    await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'De Koninklijke Loop <noreply@dekoninklijkeloop.nl>',
      to: validatedData.email,
      subject: 'Bedankt voor je bericht - De Koninklijke Loop',
      html: getContactEmailHtml({ ...validatedData, isConfirmation: true })
    });

    return res.status(200).json({
      success: true,
      message: 'Bericht is succesvol verzonden'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validatie error',
        errors: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Er ging iets mis bij het versturen van je bericht'
    });
  }
} 