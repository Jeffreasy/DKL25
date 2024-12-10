import type { SocialPlatform } from '../Socials/types';

export interface FooterProps {
  onInschrijfClick: () => void;
}

export interface QuickLinkType {
  text: string;
  to?: string;
  action?: () => void;
}

export interface SocialLinkType {
  platform: SocialPlatform;
  url: string;
  hoverColor: string;
} 