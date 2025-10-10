import { useState, Suspense, lazy, memo } from 'react';
import { RegistrationFormData } from './types/schema';
import { SEO } from '../../components/common/SEO';
import { cc, cn } from '@/styles/shared';

// Import components directly for now (lazy loading causing console override issues)
import FormContainer from './components/FormContainer';
import { SuccessMessage } from './components/SuccessMessage';

const Aanmelden = memo(() => {
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);

  if (registrationData) {
    return (
      <Suspense fallback={
        <div className={cn('bg-gray-50 py-12 sm:py-16')}>
          <div className={cn(cc.container.base)}>
            <div className={cn(cc.container.narrow)}>
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto mb-8"></div>
                <div className={cn('bg-white rounded-xl', cc.shadow.lg, 'p-8')}>
                  <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <SuccessMessage data={registrationData} />
      </Suspense>
    );
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
              <Suspense fallback={
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-8">
                    <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  </div>
                  <div className="space-y-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <div className="h-12 bg-gray-200 rounded animate-pulse w-full max-w-md mx-auto"></div>
                  </div>
                </div>
              }>
                <FormContainer onSuccess={setRegistrationData} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Aanmelden.displayName = 'Aanmelden';

export default Aanmelden;
