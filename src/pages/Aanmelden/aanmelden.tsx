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
        title="Aanmelden voor De Koninklijke Loop 2026 - DKL Registratie"
        description="Schrijf je nu in voor De Koninklijke Loop 2026! Doe mee als deelnemer, vrijwilliger of begeleider. Kies uit 2.5, 6, 10 of 15 KM routes. Inclusief ondersteuning voor mensen met een beperking. Registreer direct online."
        route="/aanmelden"
        type="website"
        images={[
          'https://www.dekoninklijkeloop.nl/images/hero.jpg',
          'https://www.dekoninklijkeloop.nl/images/registration-og.jpg'
        ]}
        isEventPage={true}
        eventName="De Koninklijke Loop 2026"
        eventStartDate="2026-05-17T09:00:00+02:00"
        eventEndDate="2026-05-17T15:00:00+02:00"
        eventDescription="Meld je aan voor De Koninklijke Loop 2026 - een uniek sponsorloop evenement mede georganiseerd door mensen met een beperking voor mensen met een beperking. Kies je afstand en rol, en doe mee aan dit inspirerende wandelevenement."
        eventLocationName="Grote Kerk"
        eventLocationAddress={{
          streetAddress: "Loolaan 16",
          addressLocality: "Apeldoorn",
          postalCode: "7315 AB",
          addressCountry: "NL"
        }}
        eventUrl="https://www.dekoninklijkeloop.nl/aanmelden"
      />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.dekoninklijkeloop.nl"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Aanmelden",
              "item": "https://www.dekoninklijkeloop.nl/aanmelden"
            }
          ]
        })}
      </script>

      {/* WebPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.dekoninklijkeloop.nl/aanmelden#webpage",
          "url": "https://www.dekoninklijkeloop.nl/aanmelden",
          "name": "Aanmelden voor De Koninklijke Loop 2026",
          "description": "Schrijf je in voor De Koninklijke Loop 2026. Registreer als deelnemer, vrijwilliger of begeleider voor dit unieke wandelevenement.",
          "inLanguage": "nl-NL",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.dekoninklijkeloop.nl#website",
            "url": "https://www.dekoninklijkeloop.nl",
            "name": "De Koninklijke Loop"
          },
          "about": {
            "@type": "Event",
            "@id": "https://www.dekoninklijkeloop.nl/aanmelden#event",
            "name": "De Koninklijke Loop 2026"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.dekoninklijkeloop.nl/images/hero.jpg"
          }
        })}
      </script>

      {/* FAQPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Hoe meld ik me aan voor De Koninklijke Loop 2026?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt je aanmelden door het registratieformulier op deze pagina in te vullen. Kies je rol (deelnemer, begeleider of vrijwilliger), selecteer je gewenste afstand (2.5, 6, 10 of 15 KM), en geef aan of je ondersteuning nodig hebt. Na het accepteren van de algemene voorwaarden kun je je inschrijving voltooien."
              }
            },
            {
              "@type": "Question",
              "name": "Welke afstanden kan ik lopen tijdens De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt kiezen uit vier verschillende afstanden: 2.5 KM, 6 KM, 10 KM of 15 KM. Elke afstand is geschikt voor verschillende conditieniveaus en je kunt de afstand kiezen die het beste bij jou past."
              }
            },
            {
              "@type": "Question",
              "name": "Kan ik meedoen als ik ondersteuning nodig heb?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja, absoluut! De Koninklijke Loop is mede georganiseerd door mensen met een beperking voor mensen met een beperking. Tijdens de aanmelding kun je aangeven of je ondersteuning nodig hebt en welke vorm van ondersteuning je nodig hebt. We zorgen ervoor dat iedereen kan meedoen."
              }
            },
            {
              "@type": "Question",
              "name": "Wanneer en waar vindt De Koninklijke Loop 2026 plaats?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "De Koninklijke Loop 2026 vindt plaats op 16 mei 2026. De startlocatie is bij de Grote Kerk, Loolaan 16, 7315 AB Apeldoorn. Zorg dat je op tijd aanwezig bent voor je start."
              }
            },
            {
              "@type": "Question",
              "name": "Wat is het verschil tussen deelnemer, begeleider en vrijwilliger?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Als deelnemer loop je zelf mee voor het goede doel. Als begeleider help je een deelnemer die ondersteuning nodig heeft tijdens het lopen. Als vrijwilliger help je met de organisatie van het evenement, bijvoorbeeld bij de start/finish, waterposten of route-begeleiding."
              }
            },
            {
              "@type": "Question",
              "name": "Ontvang ik een bevestiging na mijn aanmelding?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja, direct na je aanmelding ontvang je een bevestigingsmail met alle details van je registratie. Je kunt ook een printbare bevestiging downloaden met een QR-code en alle evenementinformatie."
              }
            }
          ]
        })}
      </script>

      <div className={cn('bg-gray-50 py-12 sm:py-16')}>
        <div className={cn(cc.container.base)}>
          <div className={cn(cc.container.narrow)}>
            <h1 className={cn(cc.text.h1, 'text-gray-900 mb-4 text-center', cc.typography.heading)}>
              Aanmelden voor De Koninklijke Loop 2026
            </h1>
            <p className={cn(cc.text.body, 'text-gray-600 text-center max-w-2xl mx-auto mb-8')}>
              Schrijf je nu in voor De Koninklijke Loop 2026. Kies je rol, selecteer je afstand en doe mee aan dit inspirerende wandelevenement op 16 mei 2026.
            </p>

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
