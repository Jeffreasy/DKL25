export interface Inschrijving {
  id?: string;
  created_at?: string;
  naam: string;
  email: string;
  rol: 'Deelnemer' | 'Begeleider' | 'Vrijwilliger';
  telefoon?: string;
  afstand: '2.5 KM' | '6 KM' | '10 KM' | '15 KM';
  ondersteuning: 'Ja' | 'Nee' | 'Anders';
  bijzonderheden?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
} 