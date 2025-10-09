import { useState } from 'react';
import { FormContainer } from './components/FormContainer';
import { SuccessMessage } from './components/SuccessMessage';
import { RegistrationFormData } from './types/schema';
import { SEO } from '../../components/common/SEO';
import { cc, cn } from '@/styles/shared';

const Aanmelden = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);

  if (registrationData) {
    return <SuccessMessage data={registrationData} />;
  }

  return (
    <>
      <SEO 
        title="Aanmelden - De Koninklijke Loop (DKL)"
        description="Meld je aan om mee te lopen met De Koninklijke Loop (DKL) 2025. Registreer je als deelnemer, vrijwilliger of begeleider voor dit unieke wandelevenement."
        route="/aanmelden"
      />
      
      <div className={cn('bg-gray-50 py-12 sm:py-16')}>
        <div className={cn(cc.container.base)}>
          <div className={cn(cc.container.narrow)}>
            <h1 className={cn(cc.text.h1, 'font-bold text-gray-900 mb-8 text-center', cc.typography.heading)}>
              Aanmelden
            </h1>
            
            <div className={cn('bg-white rounded-xl', cc.shadow.lg)}>
              <FormContainer onSuccess={setRegistrationData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aanmelden;
