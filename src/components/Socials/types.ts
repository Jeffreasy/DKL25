export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  bgColorClass: string;
  iconColorClass: string;
} 