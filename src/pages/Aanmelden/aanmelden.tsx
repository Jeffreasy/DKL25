import { useState } from 'react';
import { FormContainer } from './components/FormContainer';
import { SuccessMessage } from './components/SuccessMessage';
import { RegistrationFormData } from './types/schema';
import { SEO } from '../../components/SEO';
import { supabase } from '../../lib/supabase';

export const Aanmelden: React.FC = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationSuccess = async (data: RegistrationFormData) => {
    try {
      // Sla op in Supabase
      const { error: supabaseError } = await supabase
        .from('aanmeldingen')
        .insert([{
          naam: data.naam,
          email: data.email,
          telefoon: data.telefoon,
          rol: data.rol,
          afstand: data.afstand,
          ondersteuning: data.ondersteuning,
          bijzonderheden: data.bijzonderheden
        }]);

      if (supabaseError) throw supabaseError;

      // Verstuur bevestigingsmail
      const response = await fetch('/api/email/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send confirmation email');
      }

      // Toon success message
      setRegistrationData(data);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Er ging iets mis bij je aanmelding');
    }
  };

  if (registrationData) {
    return <SuccessMessage data={registrationData} />;
  }

  return (
    <>
      <SEO 
        title="Aanmelden - De Koninklijke Loop"
        description="Meld je aan voor De Koninklijke Loop 2025. Of je nu wilt deelnemen, vrijwilliger wilt worden of begeleider wilt zijn, hier kun je je registreren."
      />
      
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 font-heading text-center">
              Aanmelden
            </h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg">
              <FormContainer onSuccess={handleRegistrationSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aanmelden;
