import HomeIcon from '@mui/icons-material/Home'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import InfoIcon from '@mui/icons-material/Info'
import GroupIcon from '@mui/icons-material/Group'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import RadioIcon from '@mui/icons-material/Radio'

export const ICONS = {
  home: HomeIcon,
  register: HowToRegIcon,
  info: InfoIcon,
  about: GroupIcon,
  contact: ContactSupportIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  radio: RadioIcon,
} as const

export type IconName = keyof typeof ICONS 