export interface SocialMediaEmbed {
  id: number;
  platform: 'instagram' | 'facebook' | 'linkedin';
  title: string | null;
  embed_code: string;
  post_url: string;
  section: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 