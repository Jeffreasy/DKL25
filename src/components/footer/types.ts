import type { SocialPlatform } from '../Socials/types';

export interface FooterProps {
  className?: string;
  showSocials?: boolean;
  showQuickLinks?: boolean;
  customLogo?: string;
}

export interface QuickLinkType {
  text: string;
  to?: string;
  action?: () => void;
  icon?: string;
  isExternal?: boolean;
}

export interface SocialLinkType {
  platform: SocialPlatform;
  url: string;
  hoverColor: string;
  label: string;
} 