import { z } from 'zod';

const baseSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn').max(255, 'Naam mag maximaal 255 karakters bevatten'),
  email: z.string().email('Ongeldig email adres').max(255, 'Email mag maximaal 255 karakters bevatten'),
  rol: z.enum(['Deelnemer', 'Begeleider', 'Vrijwilliger'], {
    message: 'Selecteer een rol'
  }),
  afstand: z.enum(['2.5 KM', '6 KM', '10 KM', '15 KM'], {
    message: 'Selecteer een afstand'
  }),
  telefoon: z.string().max(50, 'Telefoonnummer mag maximaal 50 karakters bevatten').optional().or(z.literal('')),
  ondersteuning: z.enum(['Ja', 'Nee', 'Anders'], {
    message: 'Geef aan of je ondersteuning nodig hebt'
  }),
  bijzonderheden: z.string().max(1000, 'Bijzonderheden mag maximaal 1000 karakters bevatten').optional(),
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

// Additional validation for backend compatibility
export const validateForm = (data: RegistrationFormData) => {
  // Ensure afstand is selected for all roles (backend requirement)
  if (!data.afstand) {
    throw new Error('Selecteer een afstand');
  }

  // Ensure bijzonderheden when ondersteuning is needed
  if (data.ondersteuning !== 'Nee' && (!data.bijzonderheden || data.bijzonderheden.trim().length === 0)) {
    throw new Error('Vul de bijzonderheden in als je ondersteuning nodig hebt');
  }

  // Validate email format more strictly
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Ongeldig email adres');
  }

  // Validate phone number format if provided
  if (data.telefoon && data.telefoon.trim().length > 0) {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(data.telefoon.trim())) {
      throw new Error('Ongeldig telefoonnummer formaat');
    }
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