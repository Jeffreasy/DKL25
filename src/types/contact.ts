import { z } from 'zod';

// Contact formulier types
export type ContactStatus = 'nieuw' | 'in_behandeling' | 'afgehandeld';

// Base type voor het formulier (input)
export const contactSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  bericht: z.string()
    .min(10, 'Bericht moet minimaal 10 karakters zijn')
    .max(1000, 'Bericht mag maximaal 1000 karakters zijn'),
  privacy_akkoord: z.boolean().refine((val) => val === true, 'Je moet akkoord gaan met het privacybeleid')
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Database record type (inclusief alle velden)
export interface ContactFormulier extends ContactFormData {
  id: string;
  created_at: string;
  updated_at: string;
  email_verzonden: boolean;
  email_verzonden_op: string | null;
  status: ContactStatus;
  behandeld_door: string | null;
  behandeld_op: string | null;
  notities: string | null;
}

// Type voor API responses
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: ContactFormulier;
  errors?: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
}

// Database insert type
export type ContactFormInsert = Omit<
  ContactFormulier,
  'id' | 'created_at' | 'updated_at' | 'email_verzonden_op' | 'behandeld_op'
>;

// Database update type
export type ContactFormUpdate = Partial<Omit<ContactFormulier, 'id' | 'created_at' | 'updated_at'>>;

export interface ContactResponse {
  success: boolean;
  message?: string;
} 