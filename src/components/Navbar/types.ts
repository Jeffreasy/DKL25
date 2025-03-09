import { IconName } from '../../icons';

export interface NavItemProps {
  to?: string;
  icon: IconName;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export interface SocialLinkProps {
  href: string;
  icon: IconName;
  label: string;
  hoverColor?: string;
}

export interface NavIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavbarProps {
  className?: string;
  showSocials?: boolean;
  customLogo?: string;
  onNavigate?: (path: string) => void;
} 