import { z } from 'zod';

const baseSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  rol: z.enum(['Deelnemer', 'Begeleider', 'Vrijwilliger'], {
    required_error: 'Selecteer een rol'
  }),
  afstand: z.string({
    required_error: 'Selecteer een afstand'
  }),
  telefoon: z.string().optional(),
  ondersteuning: z.enum(['Ja', 'Nee', 'Anders'], {
    required_error: 'Geef aan of je ondersteuning nodig hebt'
  }),
  bijzonderheden: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, 'Je moet akkoord gaan met de algemene voorwaarden')
});

export const RegistrationSchema = baseSchema.refine(
  (data) => {
    if ((data.ondersteuning === 'Ja' || data.ondersteuning === 'Anders') && 
        (!data.bijzonderheden || data.bijzonderheden.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Vul de bijzonderheden in als je ondersteuning nodig hebt',
    path: ['bijzonderheden'], // Dit zorgt ervoor dat de error bij het juiste veld komt
  }
);

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

// Voeg validatie toe voor afstand als rol Deelnemer is
export const validateForm = (data: RegistrationFormData) => {
  if (data.rol === 'Deelnemer' && !data.afstand) {
    throw new Error('Selecteer een afstand');
  }
  if (data.ondersteuning !== 'Nee' && !data.bijzonderheden) {
    throw new Error('Vul de bijzonderheden in');
  }
  return data;
};

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
}