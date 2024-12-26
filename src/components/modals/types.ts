import { z } from 'zod';

// Base modal props
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Contact form schema
export const ContactFormSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  bericht: z.string()
    .min(10, 'Bericht moet minimaal 10 karakters zijn')
    .max(1000, 'Bericht mag maximaal 1000 karakters zijn'),
  privacy: z.boolean().refine((val) => val === true, 'Je moet akkoord gaan met het privacybeleid')
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// Contact modal props
export interface ContactModalProps extends BaseModalProps {
  onPrivacyClick: () => void;
}

// Privacy modal props
export interface PrivacyModalProps extends BaseModalProps {
  onAccept?: () => void;
}

// Partner modal props
export interface PartnerModalProps extends BaseModalProps {
  partnerId?: string;
}

// Donatie modal props
export interface DonatieModalProps extends BaseModalProps {
  initialAmount?: number;
} 