import type { QuickLinkType, SocialLinkType } from './types';
import type { SocialPlatform } from '../Socials/types';

export const socialLinks: SocialLinkType[] = [
  {
    platform: 'facebook' as SocialPlatform,
    url: 'https://facebook.com/dekoninklijkeloop',
    hoverColor: 'hover:bg-[#4267B2]'
  },
  {
    platform: 'instagram' as SocialPlatform,
    url: 'https://instagram.com/dekoninklijkeloop',
    hoverColor: 'hover:bg-[#E1306C]'
  },
  {
    platform: 'youtube' as SocialPlatform,
    url: 'https://youtube.com/@dekoninklijkeloop',
    hoverColor: 'hover:bg-[#FF0000]'
  },
  {
    platform: 'linkedin' as SocialPlatform,
    url: 'https://linkedin.com/company/dekoninklijkeloop',
    hoverColor: 'hover:bg-[#0A66C2]'
  }
];

export const createQuickLinks = (onInschrijfClick: () => void): QuickLinkType[] => [
  {
    text: 'Home',
    to: '/'
  },
  {
    text: 'Over Ons',
    to: '/over-ons'
  },
  {
    text: 'Contact',
    to: '/faq'
  },
  {
    text: 'Inschrijven',
    action: onInschrijfClick
  },
  {
    text: 'Privacy Policy',
    to: '/privacy'
  }
]; 