import type { QuickLinkType, SocialLinkType } from './types';
import type { SocialPlatform } from '../Socials/types';

export const socialLinks: SocialLinkType[] = [
  {
    platform: 'facebook' as SocialPlatform,
    url: 'https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/',
    hoverColor: 'hover:bg-[#1877F2]'
  },
  {
    platform: 'instagram' as SocialPlatform,
    url: 'https://www.instagram.com/koninklijkeloop/',
    hoverColor: 'hover:bg-[#E4405F]'
  },
  {
    platform: 'youtube' as SocialPlatform,
    url: 'https://www.youtube.com/@DeKoninklijkeLoop',
    hoverColor: 'hover:bg-[#FF0000]'
  },
  {
    platform: 'linkedin' as SocialPlatform,
    url: 'https://www.linkedin.com/company/dekoninklijkeloop',
    hoverColor: 'hover:bg-[#0A66C2]'
  }
];

export const createQuickLinks = (onInschrijfClick?: () => void, onPrivacyClick?: () => void): QuickLinkType[] => [
  { text: 'Home', to: '/' },
  { text: 'Over Ons', to: '/over-ons' },
  { text: 'Contact', to: '/faq' },
  { text: 'Inschrijven', action: onInschrijfClick },
  { text: 'Privacybeleid', action: onPrivacyClick },
  { text: 'DKL', to: '/wat-is-de-koninklijkeloop' }
]; 