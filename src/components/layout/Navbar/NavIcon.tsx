import React, { memo } from 'react';
import { ICONS } from '../../../icons';
import type { NavIconProps } from './types';

const NavIcon = memo(({ name, size = 20, className }: NavIconProps) => {
  const Icon = ICONS[name];
  return <Icon sx={{ fontSize: size }} className={className} />;
});

NavIcon.displayName = 'NavIcon';

export default NavIcon; 