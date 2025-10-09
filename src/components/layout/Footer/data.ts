import type { QuickLinkType } from './types';
import type { SocialLinkType } from './types';
import type { SocialPlatform } from '../Socials/types';

export const socialLinks: SocialLinkType[] = [
  {
    platform: 'facebook' as SocialPlatform,
    url: 'https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/',
    hoverColor: 'hover:bg-social-facebook',
    label: 'Volg ons op Facebook'
  },
  {
    platform: 'instagram' as SocialPlatform,
    url: 'https://www.instagram.com/koninklijkeloop/',
    hoverColor: 'hover:bg-social-instagram',
    label: 'Volg ons op Instagram'
  },
  {
    platform: 'youtube' as SocialPlatform,
    url: 'https://www.youtube.com/@DeKoninklijkeLoop',
    hoverColor: 'hover:bg-social-youtube',
    label: 'Bekijk onze YouTube kanaal'
  },
  {
    platform: 'linkedin' as SocialPlatform,
    url: 'https://www.linkedin.com/company/dekoninklijkeloop',
    hoverColor: 'hover:bg-social-linkedin',
    label: 'Volg ons op LinkedIn'
  }
];

export const createQuickLinks = (handlePrivacyClick: () => void): QuickLinkType[] => [
  {
    text: 'Home',
    to: '/',
    icon: '🏠',
    isExternal: false
  },
  {
    text: 'Inschrijven',
    to: '/aanmelden',
    icon: '✍️',
    isExternal: false
  },
  {
    text: 'Over Ons',
    to: '/over-ons',
    icon: 'ℹ️',
    isExternal: false
  },
  {
    text: 'Contact',
    to: '/faq',
    icon: '📞',
    isExternal: false
  },
  {
    text: 'Privacy Policy',
    action: handlePrivacyClick,
    icon: '🔒',
    isExternal: false
  },
]; 