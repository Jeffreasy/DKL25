import type { NavItemProps, SocialLinkProps } from './types';

export const NAV_ITEMS: Omit<NavItemProps, 'onClick'>[] = [
  {
    to: '/',
    icon: 'home',
    children: 'Home'
  },
  {
    to: '/media',
    icon: 'radio',
    children: 'Media'
  },
  {
    to: '/wat-is-de-koninklijkeloop',
    icon: 'info',
    children: 'DKL'
  },
  {
    to: '/aanmelden',
    icon: 'register',
    children: 'Inschrijven'
  },
  {
    to: '/over-ons',
    icon: 'about',
    children: 'Over Ons'
  },
  {
    to: '/faq',
    icon: 'contact',
    children: 'Contact'
  }
];

export const SOCIAL_LINKS: Omit<SocialLinkProps, 'onClick'>[] = [
  {
    href: 'https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/',
    icon: 'facebook',
    label: 'Volg ons op Facebook',
    hoverColor: 'hover:bg-social-facebook'
  },
  {
    href: 'https://www.instagram.com/koninklijkeloop/',
    icon: 'instagram',
    label: 'Volg ons op Instagram',
    hoverColor: 'hover:bg-social-instagram'
  },
  {
    href: 'https://www.youtube.com/@DeKoninklijkeLoop',
    icon: 'youtube',
    label: 'Bekijk ons YouTube kanaal',
    hoverColor: 'hover:bg-social-youtube'
  }
];

export const DEFAULT_LOGO = "https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png"; 