export interface ProgramItemData {
  id: string;
  time: string;
  event_description: string;
  category?: string | null; // Allow null from DB
  icon_name?: string | null; // Allow null from DB
  order_number: number;
}
