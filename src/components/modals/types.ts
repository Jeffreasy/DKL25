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
  partner: Partner;
}

export interface PrivacyModalProps extends BaseModalProps {}

export interface TermsModalProps extends BaseModalProps {
  onScrollComplete?: () => void;
} 