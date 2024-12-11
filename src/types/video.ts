export interface Video {
  id: string;
  video_id: string;
  url: string;
  title: string;
  description: string | null;
  visible: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
} 