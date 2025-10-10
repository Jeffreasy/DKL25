import React, { memo, useMemo } from 'react';
import { ICONS } from '../../../icons';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import type { NavIconProps } from './types';
import { cn } from '@/styles/shared';

const NavIcon = memo<NavIconProps>(({ name, size = 20, className }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('NavIcon');

  // Memoize icon component and size styles to prevent recreation
  const iconData = useMemo(() => {
    const Icon = ICONS[name];
    const sizeStyles = `w-[${size}px] h-[${size}px]`;
    trackInteraction('render', `${name}_size_${size}`);
    return { Icon, sizeStyles };
  }, [name, size, trackInteraction]);

  return <iconData.Icon className={cn(iconData.sizeStyles, className)} />;
});

NavIcon.displayName = 'NavIcon';

export default NavIcon;