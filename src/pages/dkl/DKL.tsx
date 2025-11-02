import React, { useEffect, lazy, memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';
import { LazySection } from '../../components/common/LazySection';

// Lazy load the RouteSection component
const RouteSection = lazy(() => import('./components/RouteSection'));

const DKL: React.FC = memo(() => {
  useEffect(() => {
    trackEvent('dkl', 'page_view', 'dkl_page');
  }, []);

  return (
    <>
      <SEO
        title="Wat is DKL? De Koninklijke Loop 2026 - Toegankelijk Wandelevenement"
        description="Ontdek DKL (De Koninklijke Loop) 2026: wandel over de historische Koninklijke Weg van Kootwijk naar Apeldoorn. Kies uit 2.5, 6, 10 of 15 KM. Volledig rolstoeltoegankelijk evenement op 16 mei 2026."
        route="/wat-is-de-koninklijkeloop"
        type="website"
        images={[
          'https://www.dekoninklijkeloop.nl/images/hero.jpg',
          'https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/671ff32e5e9bec64a207e3b2_route%20Koninklijke%20weg.jpg'
        ]}
        isEventPage={true}
        eventName="De Koninklijke Loop (DKL) 2026"
        eventStartDate="2026-05-16T09:00:00+02:00"
        eventEndDate="2026-05-16T15:00:00+02:00"
        eventDescription="DKL is een uniek, toegankelijk wandelevenement over de historische Koninklijke Weg. Wandel van Kootwijk naar Apeldoorn over een rolstoelvriendelijke route met keuze uit 2.5, 6, 10 of 15 kilometer."
        eventLocationName="Grote Kerk"
        eventLocationAddress={{
          streetAddress: "Loolaan 16",
          addressLocality: "Apeldoorn",
          postalCode: "7315 AB",
          addressCountry: "NL"
        }}
        eventUrl="https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop"
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
              "name": "Wat is DKL",
              "item": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop"
            }
          ]
        })}
      </script>

      {/* TouristAttraction Schema for Koninklijke Weg */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "@id": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop#route",
          "name": "De Koninklijke Weg - DKL Route",
          "description": "Een historische, rolstoelvriendelijke wandelroute van 170 km van Paleis Noordeinde naar Paleis Het Loo. DKL gebruikt het mooie laatste deel van Kootwijk naar Apeldoorn.",
          "image": "https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/671ff32e5e9bec64a207e3b2_route%20Koninklijke%20weg.jpg",
          "touristType": ["Wandelaars", "Rolstoelgebruikers", "Mensen met een beperking"],
          "isAccessibleForFree": true,
          "publicAccess": true,
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Rolstoeltoegankelijk",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "EHBO beschikbaar",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Routebegeleiding",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Pendelbusvervoer",
              "value": true
            }
          ],
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "52.21163749694824",
            "longitude": "5.962539196014404"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Apeldoorn",
            "addressRegion": "Gelderland",
            "addressCountry": "NL"
          },
          "url": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop"
        })}
      </script>

      {/* WebPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop#webpage",
          "url": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop",
          "name": "Wat is DKL? De Koninklijke Loop 2026",
          "description": "Ontdek alles over DKL (De Koninklijke Loop): de route over de Koninklijke Weg, toegankelijkheid, en praktische informatie over dit unieke wandelevenement.",
          "inLanguage": "nl-NL",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.dekoninklijkeloop.nl#website",
            "url": "https://www.dekoninklijkeloop.nl",
            "name": "De Koninklijke Loop"
          },
          "about": {
            "@type": "Event",
            "@id": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop#event",
            "name": "De Koninklijke Loop (DKL) 2026"
          },
          "mainEntity": {
            "@type": "TouristAttraction",
            "@id": "https://www.dekoninklijkeloop.nl/wat-is-de-koninklijkeloop#route",
            "name": "De Koninklijke Weg - DKL Route"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/671ff32e5e9bec64a207e3b2_route%20Koninklijke%20weg.jpg",
            "caption": "Route kaart van de Koninklijke Weg"
          }
        })}
      </script>

      {/* FAQPage Schema for route questions */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Wat is DKL of De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "DKL (De Koninklijke Loop) is een uniek, toegankelijk wandelevenement op 16 mei 2026 waarbij deelnemers over de historische Koninklijke Weg wandelen van Kootwijk naar Apeldoorn. Het evenement is speciaal ontworpen voor toegankelijkheid en inclusiviteit."
              }
            },
            {
              "@type": "Question",
              "name": "Wat is de Koninklijke Weg?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "De Koninklijke Weg is een historische route van 170 km die loopt van Paleis Noordeinde in Den Haag via Soestdijk naar Paleis Het Loo in Apeldoorn. DKL gebruikt het mooie laatste deel van deze route, van Kootwijk naar Apeldoorn."
              }
            },
            {
              "@type": "Question",
              "name": "Welke afstanden kan ik lopen tijdens DKL?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tijdens DKL kun je kiezen uit vier verschillende afstanden: 2.5 KM, 6 KM, 10 KM of 15 KM. Alle routes zijn rolstoeltoegankelijk en geschikt voor verschillende conditieniveaus."
              }
            },
            {
              "@type": "Question",
              "name": "Is de DKL route rolstoeltoegankelijk?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja, de gehele DKL route is volledig rolstoeltoegankelijk. Er zijn routebegeleiders, EHBO'ers en pendelbussen (inclusief een rolstoelbus) beschikbaar om deelnemers te ondersteunen en naar de verschillende startpunten te brengen."
              }
            },
            {
              "@type": "Question",
              "name": "Waar start en eindigt De Koninklijke Loop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Deelnemers melden zich bij de Grote Kerk in Apeldoorn (Loolaan 16, 7315 AB). Vanaf daar worden ze per pendel bus naar de verschillende startpunten gebracht (Kootwijk voor 15km, Assel voor 10km, Hoog Soeren voor 6km, of Berg en Bos voor 2.5km). Alle routes finishen bij de Grote Kerk in Apeldoorn."
              }
            }
          ]
        })}
      </script>
      <div className="min-h-screen pt-20">
        <LazySection
          priority="high"
          fallback={
            <div className="min-h-screen bg-white">
              <div className="relative py-20 px-6 text-center overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
                <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="h-24 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-16 max-w-4xl mx-auto"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 p-8 rounded-xl animate-pulse h-64"></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <RouteSection />
        </LazySection>
      </div>
    </>
  );
});

DKL.displayName = 'DKL';

export default DKL; 