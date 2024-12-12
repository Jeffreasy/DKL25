import type { IconName } from '@/components/icons/types';

export type ActionType = 'inschrijven' | 'doneren' | 'navigate';

export interface CTACardData {
  id?: string;
  title: string;
  description: string;
  icon: IconName;
  actionType: ActionType;
  path?: string;
  buttonText: string;
  onClick?: () => void;
} 