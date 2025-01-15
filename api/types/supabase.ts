import type { TextStyling } from '../../src/types/shared';

export interface Database {
  public: {
    Tables: {
      contact_formulieren: {
        Row: {
          id: string;
          naam: string;
          email: string;
          bericht: string;
          privacy_akkoord: boolean;
          created_at: string;
          updated_at: string;
          email_verzonden: boolean;
          email_verzonden_op: string | null;
          status: 'nieuw' | 'in_behandeling' | 'afgehandeld';
          behandeld_door: string | null;
          behandeld_op: string | null;
          notities: string | null;
        };
        Insert: Omit<Database['public']['Tables']['contact_formulieren']['Row'], 
          'id' | 'created_at' | 'updated_at' | 'email_verzonden_op' | 'behandeld_op'>;
        Update: Partial<Database['public']['Tables']['contact_formulieren']['Row']>;
      };
    };
  };
} 