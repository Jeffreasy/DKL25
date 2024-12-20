export interface AanmeldFormData {
  naam: string;
  email: string;
  telefoon: string;
  rol: 'Deelnemer' | 'Begeleider' | 'Vrijwilliger';
  afstand: '2.5 KM' | '6 KM' | '10 KM' | '15 KM';
  ondersteuning: 'Ja' | 'Nee' | 'Anders';
  bijzonderheden?: string;
  terms: boolean;
}

export interface Inschrijving extends Omit<AanmeldFormData, 'terms'> {
  id?: string;
  created_at?: string;
  status: 'pending' | 'approved' | 'rejected';
} 