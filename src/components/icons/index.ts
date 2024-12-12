import HomeIcon from '@mui/icons-material/Home';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GroupsIcon from '@mui/icons-material/Groups';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export type IconName = 
  | 'home'
  | 'register'
  | 'about'
  | 'contact'
  | 'info'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'linkedin';

export const ICONS = {
  home: HomeIcon,
  register: HowToRegIcon,
  about: GroupsIcon,
  contact: ContactSupportIcon,
  info: InfoIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
} as const; 