import { useState } from 'react';
import { FormContainer } from './components/FormContainer';
import { SuccessMessage } from './components/SuccessMessage';
import { RegistrationFormData } from './types/schema';
import { SEO } from '../../components/SEO';

const Aanmelden = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);

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
            
            <div className="bg-white rounded-xl shadow-lg">
              <FormContainer onSuccess={setRegistrationData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aanmelden;
