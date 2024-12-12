import React from 'react';
import { MemoizedNavIcon } from '@/components/core/Navbar/Navbar';
import type { IconName } from '@/components/icons/types';

interface SocialIconProps {
  platform: Extract<IconName, 'facebook' | 'instagram' | 'youtube' | 'linkedin'>;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = '' }) => {
  return <MemoizedNavIcon name={platform} className={className} />;
};

export default React.memo(SocialIcon); 