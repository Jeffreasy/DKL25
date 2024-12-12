export type IconType = 'calendar' | 'users' | 'medal';

export interface EventDetail {
  icon: IconType;
  title: string;
  description: string;
}

export interface TitleSectionContent {
  title: string;
  subtitle: string;
  cta_text: string;
  event_details: EventDetail[];
}

export interface TitleSectionEmbed {
  id: string;
  platform: 'instagram' | 'facebook';
  embed_code: string;
  post_url: string;
  likes_count?: number;
} 