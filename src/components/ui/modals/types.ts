import { z } from 'zod';
import { Sponsor } from '@/features/sponsors/types';

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
export interface ContactModalProps extends BaseModalProps {}

// Privacy modal props
export interface PrivacyModalProps extends BaseModalProps {
  onAccept?: () => void;
}

// Partner modal props
export interface PartnerModalProps extends BaseModalProps {
  partnerId?: string;
  partner?: {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
    description: string | null;
    tier: string;
    since: string;
    created_at: string;
    updated_at: string;
    visible: boolean;
    order_number: number;
  };
}

// Donatie modal props
export interface DonatieModalProps extends BaseModalProps {
  initialAmount?: number;
}

// Inschrijf modal props
export interface InschrijfModalProps extends BaseModalProps {
  // Voeg hier eventuele extra props toe die je nodig hebt
}

export interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsor: Sponsor | null;
} 