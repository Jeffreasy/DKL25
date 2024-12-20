import { z } from 'zod';

const formSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  rol: z.enum(['Deelnemer', 'Begeleider', 'Vrijwilliger']),
  afstand: z.enum(['2.5 KM', '6 KM', '10 KM', '15 KM']),
  ondersteuning: z.enum(['Ja', 'Nee', 'Anders']),
  telefoon: z.string().optional(),
  bijzonderheden: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Je moet akkoord gaan met de voorwaarden' })
  })
});

export const aanmeldSchema = formSchema.superRefine((val, ctx) => {
  if ((val.rol === 'Begeleider' || val.rol === 'Vrijwilliger') && !val.telefoon) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Telefoonnummer is verplicht voor begeleiders en vrijwilligers',
      path: ['telefoon']
    });
  }
});

export type AanmeldFormData = z.infer<typeof aanmeldSchema>;