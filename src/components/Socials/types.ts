export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  bgColorClass: string | null;
  iconColorClass: string | null;
} 