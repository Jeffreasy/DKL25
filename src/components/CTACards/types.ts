import { IconName } from '../../icons';

export type ActionType = 'inschrijven' | 'doneren' | 'navigate';

export interface CTACardData {
  title: string;
  description: string;
  icon: IconName;
  actionType: ActionType;
  path?: string;
  buttonText: string;
} 