import React, { useState, lazy, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { useModal } from '../../contexts/ModalContext';
import { cc, cn } from '@/styles/shared';
import { LazySection } from './components';

// Lazy load heavy components for better performance
const PartnerCarrousel = lazy(() => import('../../features/partners/components/PartnerCarousel'));
const HeroSection = lazy(() => import('../../components/sections/Hero/HeroSection'));
const TitleSection = lazy(() => import('../../components/sections/Title/TitleSection'));
const CTACards = lazy(() => import('../../components/ui/CTACards/CTACards'));
const PhotoGallery = lazy(() => import('../../features/gallery/components/GalleryContainer'));
const DKLSocials = lazy(() => import('../../components/sections/Socials/SocialLinks'));
import { DKLSponsors, RadioGallery } from '../../components';
const VideoGallery = lazy(() => import('../../features/video/components').then(module => ({ default: module.VideoGallery })));
const ProgramSection = lazy(() => import('../../features/program/components').then(module => ({ default: module.ProgramSection })));
const InschDoneerButton = lazy(() => import('../../components/ui/buttons/RegisterDonateButton'));

const Home: React.FC = memo(() => {
  const { handleDonatieClick, handleOpenProgramModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  return (
    <>
      <SEO
        title="DKL 2026 - De Koninklijke Loop | Wandelevenement Apeldoorn 17 Mei"
        description="DKL (De Koninklijke Loop) 2026: uniek rolstoeltoegankelijk wandelevenement in Apeldoorn op 17 mei. Kies uit 2.5, 6, 10 of 15 KM over de historische Koninklijke Weg. Voor mensen met en zonder beperking. Schrijf je nu in!"
        route="/"
        type="website"
        images={[
          'https://www.dekoninklijkeloop.nl/images/hero.jpg',
          'https://www.dekoninklijkeloop.nl/images/dkl-social.jpg',
          'https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/671ff32e5e9bec64a207e3b2_route%20Koninklijke%20weg.jpg'
        ]}
        isEventPage={true}
        eventName="De Koninklijke Loop (DKL) 2026"
        eventStartDate="2026-05-17T09:00:00+02:00"
        eventEndDate="2026-05-17T15:00:00+02:00"
        eventDescription="DKL is een uniek, rolstoeltoegankelijk wandelevenement over de historische Koninklijke Weg in Apeldoorn. Mede georganiseerd door mensen met een beperking voor mensen met een beperking. Kies uit 2.5, 6, 10 of 15 kilometer en loop mee voor het goede doel."
        eventLocationName="Grote Kerk"
        eventLocationAddress={{
          streetAddress: "Loolaan 16",
          addressLocality: "Apeldoorn",
          postalCode: "7315 AB",
          addressCountry: "NL"
        }}
        eventUrl="https://www.dekoninklijkeloop.nl"
      />

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.dekoninklijkeloop.nl#organization",
          "name": "De Koninklijke Loop",
          "alternateName": ["DKL", "DKL 2026", "Koninklijke Loop", "De Koninklijke Loop 2026"],
          "url": "https://www.dekoninklijkeloop.nl",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.dekoninklijkeloop.nl/images/logo.png",
            "width": "200",
            "height": "200"
          },
          "description": "De Koninklijke Loop (DKL) is een uniek, rolstoeltoegankelijk wandelevenement mede georganiseerd door mensen met een beperking voor mensen met een beperking. We wandelen over de historische Koninklijke Weg voor het goede doel.",
          "foundingDate": "2024",
          "slogan": "Voor en door mensen met een beperking",
          "email": "info@dekoninklijkeloop.nl",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Loolaan 16",
            "addressLocality": "Apeldoorn",
            "postalCode": "7315 AB",
            "addressCountry": "NL"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "52.21163749694824",
            "longitude": "5.962539196014404"
          },
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
          },
          "makesOffer": {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Event",
              "@id": "https://www.dekoninklijkeloop.nl#event",
              "name": "De Koninklijke Loop (DKL) 2026"
            }
          }
        })}
      </script>

      {/* WebSite Schema with SearchAction */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://www.dekoninklijkeloop.nl#website",
          "url": "https://www.dekoninklijkeloop.nl",
          "name": "De Koninklijke Loop (DKL)",
          "alternateName": "DKL 2026",
          "description": "Officiële website van De Koninklijke Loop (DKL) - een uniek, rolstoeltoegankelijk wandelevenement in Apeldoorn",
          "publisher": {
            "@type": "Organization",
            "@id": "https://www.dekoninklijkeloop.nl#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.dekoninklijkeloop.nl/contact?query={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* WebPage Schema for Homepage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.dekoninklijkeloop.nl#webpage",
          "url": "https://www.dekoninklijkeloop.nl",
          "name": "DKL 2026 - De Koninklijke Loop | Wandelevenement Apeldoorn",
          "description": "Welkom bij De Koninklijke Loop (DKL) 2026. Schrijf je in voor dit unieke, rolstoeltoegankelijke wandelevenement op 17 mei in Apeldoorn.",
          "inLanguage": "nl-NL",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.dekoninklijkeloop.nl#website"
          },
          "about": {
            "@type": "Event",
            "@id": "https://www.dekoninklijkeloop.nl#event"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.dekoninklijkeloop.nl/images/hero.jpg",
            "width": "1920",
            "height": "1080"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.dekoninklijkeloop.nl"
              }
            ]
          }
        })}
      </script>
      <div className="bg-white">
        <main role="main" aria-label="Hoofdinhoud">
          {/* High priority sections - load immediately */}
          <LazySection priority="high">
            <section aria-labelledby="partners-heading">
              <h2 id="partners-heading" className={cc.a11y.srOnly}>Onze Partners</h2>
              <PartnerCarrousel />
            </section>
          </LazySection>

          <LazySection priority="high">
            <HeroSection />
          </LazySection>

          <LazySection priority="high">
            <TitleSection onInschrijfClick={handleInschrijven} />
          </LazySection>

          <LazySection priority="high">
            <section aria-labelledby="cta-heading">
              <h2 id="cta-heading" className={cc.a11y.srOnly}>Doe Mee met DKL</h2>
              <CTACards onInschrijfClick={handleInschrijven} />
            </section>
          </LazySection>

          {/* Medium priority sections */}
          <LazySection priority="medium">
            <section aria-labelledby="program-heading">
              <h2 id="program-heading" className={cc.a11y.srOnly}>Programma</h2>
              <ProgramSection />
            </section>
          </LazySection>

          <LazySection priority="medium" className="py-12 px-5">
            <section aria-labelledby="video-heading">
              <h2 id="video-heading" className={cc.a11y.srOnly}>Bekijk de Video's</h2>
              <VideoGallery />
            </section>
          </LazySection>

          {/* Low priority sections - load when scrolled into view */}
          <LazySection priority="low" className="py-12 px-5">
            <section aria-labelledby="photo-heading">
              <h2 id="photo-heading" className={cn(cc.text.h2, cc.typography.heading, 'text-center text-gray-900 mb-8')}>
                Foto Impressie
              </h2>
              <PhotoGallery onModalChange={setIsModalOpen} />
            </section>
          </LazySection>

          <LazySection priority="low" className="py-12 px-5">
            <section aria-labelledby="radio-heading">
              <h2 id="radio-heading" className={cn(cc.text.h2, cc.typography.heading, 'text-center text-gray-900 mb-8')}>
                Luister Terug
              </h2>
              <RadioGallery
                title="Radio Fragmenten"
                subtitle="Luister naar onze Radio Fragmenten"
                maxItems={2}
              />
            </section>
          </LazySection>

          <LazySection priority="low">
            <section aria-labelledby="socials-heading">
              <h2 id="socials-heading" className={cc.a11y.srOnly}>Volg Ons op Social Media</h2>
              <DKLSocials />
            </section>
          </LazySection>

          <LazySection priority="low" className="py-12 px-5">
            <section aria-labelledby="sponsors-heading">
              <h2 id="sponsors-heading" className={cn(cc.text.h2, cc.typography.heading, 'text-center text-gray-900 mb-8')}>
                Met Dank Aan Onze Sponsors
              </h2>
              <DKLSponsors />
            </section>
          </LazySection>

          <LazySection priority="low">
            <section aria-labelledby="action-heading">
              <h2 id="action-heading" className={cc.a11y.srOnly}>Schrijf Je In of Doneer</h2>
              <InschDoneerButton
                onInschrijfClick={handleInschrijven}
                isModalOpen={isModalOpen}
              />
            </section>
          </LazySection>
        </main>
      </div>
    </>
  );
});

Home.displayName = 'Home';

export default Home;