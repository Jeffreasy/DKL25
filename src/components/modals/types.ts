import type { Partner } from '@/types/partner';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ContactModalProps extends BaseModalProps {
  onPrivacyClick: () => void;
}

export interface DonatieModalProps extends BaseModalProps {}

export interface InschrijfModalProps extends BaseModalProps {}

export interface PartnerModalProps extends BaseModalProps {
  partner: Partner | null;
}

export interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
} 