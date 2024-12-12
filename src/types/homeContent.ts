export interface EventDetail {
  icon: 'calendar' | 'map-pin' | 'users';
  title: string;
  description: string;
}

export interface HomeContent {
  id: number;
  section: string;
  title: string;
  subtitle: string;
  cta_text: string;
  event_details: EventDetail[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 