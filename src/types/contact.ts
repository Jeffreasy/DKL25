// Contact formulier types
export type ContactStatus = 'nieuw' | 'in_behandeling' | 'afgehandeld';

// Base type voor het formulier (input)
export interface ContactFormData {
  naam: string;
  email: string;
  bericht: string;
  privacy_akkoord: boolean;
}

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