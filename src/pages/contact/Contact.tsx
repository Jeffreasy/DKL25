import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';
import { LazySection } from '../../components/common/LazySection';
import { cn, colors } from '@/styles/shared';

// Lazy load heavy components for better performance
const FAQ = lazy(() => import('./components/FAQ'));
const ContactModal = lazy(() =>
  import('../../components/ui/modals/ContactModal').then(module => ({ default: module.ContactModal }))
);

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = memo(({ onInschrijfClick }) => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('contact', 'page_view', 'contact_page');
  }, []);

  const handleInschrijfClick = () => {
    trackEvent('contact', 'inschrijf_click', 'from_contact_page');
    navigate('/aanmelden');
  };

  const handleContactClick = () => {
    trackEvent('contact', 'modal_open', 'contact_form');
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    trackEvent('contact', 'modal_close', 'contact_form');
    setIsContactModalOpen(false);
  };

  return (
    <>
      <SEO
        title="Contact & Veelgestelde Vragen - De Koninklijke Loop (DKL) 2026"
        description="Heb je vragen over De Koninklijke Loop 2026? Vind antwoorden in onze uitgebreide FAQ over inschrijven, routes, ondersteuning en praktische informatie. Of neem direct contact op via ons formulier."
        route="/contact"
        type="website"
        images={[
          'https://www.dekoninklijkeloop.nl/images/hero.jpg',
          'https://www.dekoninklijkeloop.nl/images/contact-og.jpg'
        ]}
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
              "name": "Contact",
              "item": "https://www.dekoninklijkeloop.nl/contact"
            }
          ]
        })}
      </script>

      {/* ContactPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": "https://www.dekoninklijkeloop.nl/contact#webpage",
          "url": "https://www.dekoninklijkeloop.nl/contact",
          "name": "Contact & Veelgestelde Vragen - De Koninklijke Loop",
          "description": "Neem contact op met De Koninklijke Loop of vind antwoorden in onze FAQ sectie",
          "inLanguage": "nl-NL",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.dekoninklijkeloop.nl#website",
            "url": "https://www.dekoninklijkeloop.nl",
            "name": "De Koninklijke Loop"
          },
          "mainEntity": {
            "@type": "Organization",
            "name": "De Koninklijke Loop",
            "alternateName": ["DKL", "DKL 2026", "Koninklijke Loop"],
            "url": "https://www.dekoninklijkeloop.nl",
            "logo": "https://www.dekoninklijkeloop.nl/images/logo.png",
            "description": "Een uniek sponsorloop evenement mede georganiseerd door mensen met een beperking voor mensen met een beperking",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Loolaan 16",
              "addressLocality": "Apeldoorn",
              "postalCode": "7315 AB",
              "addressCountry": "NL"
            },
            "email": "info@dekoninklijkeloop.nl",
            "sameAs": [
              "https://facebook.com/dekoninklijkeloop",
              "https://instagram.com/dekoninklijkeloop",
              "https://youtube.com/@dekoninklijkeloop",
              "https://linkedin.com/company/dekoninklijkeloop"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "info@dekoninklijkeloop.nl",
              "availableLanguage": ["nl"],
              "areaServed": "NL"
            }
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
              "name": "Wat maakt De Koninklijke Loop zo bijzonder?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "De Koninklijke Loop is een sponsorloop mede georganiseerd door mensen met een beperking voor mensen met een beperking. We lopen de route over de Koninklijke weg, een rolstoelvriendelijke wandelroute."
              }
            },
            {
              "@type": "Question",
              "name": "Wanneer vindt de Koninklijke Loop 2026 plaats?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "De Koninklijke Loop vindt op zaterdag 16 mei 2026 plaats."
              }
            },
            {
              "@type": "Question",
              "name": "Waar vindt de Koninklijke Loop plaats?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "De Koninklijke Loop vindt plaats op de Koninklijke Weg, een rolstoelvriendelijke route. We lopen verschillende afstanden tussen Assel en Paleis het Loo, Apeldoorn. De deelnemers worden vanaf de Grote Kerk in Apeldoorn naar de startpunten van de verschillende afstanden gebracht."
              }
            },
            {
              "@type": "Question",
              "name": "Hoe kan ik meedoen met De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt je inschrijven voor De Koninklijke Loop 2026 via het registratieformulier op onze website. Vul het formulier in en je ontvangt direct een bevestiging."
              }
            },
            {
              "@type": "Question",
              "name": "Welke afstanden kan ik kiezen bij De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt kiezen uit de 15, 10, 6 of 2,5 km. Elke afstand heeft zijn eigen karakter en moeilijkheidsgraad."
              }
            },
            {
              "@type": "Question",
              "name": "Moet je betalen om mee te doen met DKL 25?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Deelname aan de loop is helemaal gratis. Wel moet je jezelf van tevoren opgeven via het inschrijfformulier."
              }
            },
            {
              "@type": "Question",
              "name": "Wat als je hulp of begeleiding nodig hebt tijdens de loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Een begeleider of iemand die je helpt, kan zich ook via het formulier opgeven. Heb je niemand die je kan begeleiden of helpen en heb je dit wel nodig, geef dit even aan bij de bijzonderheden, dan kijken we of we je vanuit de organisatie kunnen helpen."
              }
            },
            {
              "@type": "Question",
              "name": "Hoeveel mensen kunnen er maximaal meelopen tijdens DKL 25?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Er kunnen maximaal 75 mensen meedoen met de Koninklijke Loop. Zorg dus dat je op tijd inschrijft!"
              }
            },
            {
              "@type": "Question",
              "name": "Hoe kan ik contact opnemen met De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt direct contact met ons opnemen via het contactformulier op deze pagina of stuur een email naar info@dekoninklijkeloop.nl. We reageren zo snel mogelijk op je bericht."
              }
            },
            {
              "@type": "Question",
              "name": "Waar moet ik me melden als deelnemer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Je kunt je melden bij het coördinatiepunt bij de Grote Kerk in Apeldoorn. Het adres is Loolaan 16, 7315 AB Apeldoorn."
              }
            }
          ]
        })}
      </script>
      <div className={cn('min-h-screen pt-20', colors.neutral.white)}>
        <LazySection
          priority="high"
          fallback={
            <div className="w-full bg-white text-gray-800 antialiased p-8 rounded-xl shadow-lg">
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse mt-8 w-1/2 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse h-64"></div>
                ))}
              </div>
            </div>
          }
        >
          <FAQ
            onContactClick={handleContactClick}
            onInschrijfClick={handleInschrijfClick}
          />
        </LazySection>

        {isContactModalOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <ContactModal
              isOpen={isContactModalOpen}
              onClose={handleContactModalClose}
            />
          </Suspense>
        )}
      </div>
    </>
  );
});

Contact.displayName = 'Contact';

export default Contact; 