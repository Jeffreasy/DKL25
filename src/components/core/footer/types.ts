import type { SocialIconName } from '@/components/icons/types';

export interface FooterProps {
  onInschrijfClick: () => void;
}

export interface QuickLinkType {
  text: string;
  to?: string;
  action?: () => void;
}

export interface SocialLinkType {
  platform: SocialIconName;
  url: string;
  hoverColor: string;
} 