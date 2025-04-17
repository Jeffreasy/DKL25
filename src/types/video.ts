export interface Video {
  id: string;
  video_id: string;
  url: string;
  title: string;
  description: string | null;
  visible: boolean | null;
  order_number: number | null;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
} 