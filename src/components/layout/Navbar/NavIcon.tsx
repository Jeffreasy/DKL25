import React, { memo } from 'react';
import { ICONS } from '../../../icons';
import type { NavIconProps } from './types';
import { cn } from '@/styles/shared';

const NavIcon = memo<NavIconProps>(({ name, size = 20, className }) => {
  const Icon = ICONS[name];
  return <Icon className={cn(`w-[${size}px] h-[${size}px]`, className)} />;
});

NavIcon.displayName = 'NavIcon';

export default NavIcon;