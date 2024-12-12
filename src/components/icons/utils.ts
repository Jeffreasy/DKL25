import { ICONS } from '@/icons';
import type { IconName } from './types';

export const isValidIconName = (name: string): name is IconName => {
  return name in ICONS;
}; 