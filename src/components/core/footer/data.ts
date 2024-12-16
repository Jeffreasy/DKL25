import type { QuickLinkType, SocialLinkType } from './types';

export const socialLinks: SocialLinkType[] = [
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/',
    hoverColor: 'hover:bg-[#4267B2]'
  },
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/koninklijkeloop/',
    hoverColor: 'hover:bg-[#E4405F]'
  },
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/@DeKoninklijkeLoop',
    hoverColor: 'hover:bg-[#FF0000]'
  },
  {
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/dekoninklijkeloop',
    hoverColor: 'hover:bg-[#0A66C2]'
  }
];

export const createQuickLinks = (
  _handleInschrijfClick: () => void,
  handlePrivacyClick: () => void
): QuickLinkType[] => [
  { text: 'Home', to: '/' },
  { text: 'Over Ons', to: '/over-ons' },
  { text: 'Contact', to: '/contact' },
  { text: 'Inschrijven', to: '/inschrijving' },
  { text: 'Privacy Policy', action: handlePrivacyClick }
]; 