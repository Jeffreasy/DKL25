import { VercelRequest, VercelResponse } from '@vercel/node';
import { getConfirmationEmailTemplate } from './templates/confirmation';
import { RegistrationSchema } from '../../src/pages/Aanmelden/types/schema';
import nodemailer from 'nodemailer';

// Maak een SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? '587'),
  secure: false,  // false voor STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2',  // Gebruik moderne TLS versie
    rejectUnauthorized: false
  }
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Valideer environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Missing required environment variables:', {
      hasHost: !!process.env.SMTP_HOST,
      hasUser: !!process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS
    });
    return response.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  console.log('Function started with config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    secure: process.env.SMTP_SECURE,
    hasPass: !!process.env.SMTP_PASS
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

    console.log('Attempting to send email to:', validatedData.email);

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
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
      stack: error instanceof Error ? error.stack : undefined
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