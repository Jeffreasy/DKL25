import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { supabase } from '../lib/supabase';
import { getContactEmailHtml } from './templates/contact';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env['MAILGUN_API_KEY'] || '',
  url: 'https://api.eu.mailgun.net'
});

const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  tags?: string[];
}) => {
  const { to, subject, html, replyTo, tags = [] } = options;
  
  return mg.messages.create(process.env['MAILGUN_DOMAIN'] || '', {
    from: `De Koninklijke Loop <${process.env['MAILGUN_FROM']}>`,
    to,
    subject,
    html,
    ...(replyTo && { 'h:Reply-To': replyTo }),
    'o:tag': tags,
    'o:tracking': 'yes',
    'o:dkim': 'yes',
    'h:X-Mailgun-Variables': JSON.stringify({ source: 'contact-form' })
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { naam, email, bericht, privacy_akkoord } = req.body;

    // 1. Database insert
    const { data: savedContact, error: dbError } = await supabase
      .from('contact_formulieren')
      .insert({
        naam,
        email,
        bericht,
        privacy_akkoord,
        email_verzonden: false,
        status: 'nieuw'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Send emails
    await Promise.all([
      // Admin notification
      sendEmail({
        to: 'info@dekoninklijkeloop.nl',
        subject: `Nieuw contact: ${naam}`,
        html: getContactEmailHtml({ naam, email, bericht }),
        replyTo: email,
        tags: ['contact-form', 'admin-notification']
      }),

      // User confirmation
      sendEmail({
        to: email,
        subject: 'Bedankt voor je bericht - De Koninklijke Loop',
        html: getContactEmailHtml({ naam, email, bericht, isConfirmation: true }),
        tags: ['contact-form', 'confirmation']
      })
    ]);

    // 3. Update database
    await supabase
      .from('contact_formulieren')
      .update({
        email_verzonden: true,
        email_verzonden_op: new Date().toISOString()
      })
      .eq('id', savedContact.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error'
    });
  }
}
