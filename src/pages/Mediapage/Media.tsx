import React, { useEffect, Suspense, lazy, memo, useState, useRef } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';
import { cc, cn, colors } from '@/styles/shared';

import { RadioGallery } from '@/components/sections/Radio';

// Optimized section component with intersection observer
const LazySection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}> = memo(({ children, fallback, className, priority = 'medium' }) => {
  const [isVisible, setIsVisible] = useState(priority === 'high');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high') return; // High priority loads immediately

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Load once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: priority === 'medium' ? '100px' : '200px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={sectionRef} className={className}>
      <Suspense fallback={fallback || <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />}>
        {isVisible ? children : (fallback || <div className="h-32 bg-gray-50 rounded-lg" />)}
      </Suspense>
    </div>
  );
});

LazySection.displayName = 'LazySection';

const MediaPage: React.FC = memo(() => {
  useEffect(() => {
    trackEvent('media', 'page_view', 'media_page');
  }, []);

  return (
    <>
      <SEO
        title="DKL Media Archief 2024 & 2025 - Foto's, Video's & Radio | De Koninklijke Loop"
        description="Herbeleef DKL (De Koninklijke Loop) via ons media archief. Luister naar live radio-uitzendingen 2024 & 2025, bekijk foto's en video's van dit unieke rolstoeltoegankelijke wandelevenement in Apeldoorn."
        route="/media"
        type="website"
        images={[
          'https://www.dekoninklijkeloop.nl/images/media-hero.jpg',
          'https://www.dekoninklijkeloop.nl/images/hero.jpg'
        ]}
      />

      {/* BreadcrumbList Schema */}
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
              "name": "Media Archief",
              "item": "https://www.dekoninklijkeloop.nl/media"
            }
          ]
        })}
      </script>

      {/* CollectionPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://www.dekoninklijkeloop.nl/media#webpage",
          "url": "https://www.dekoninklijkeloop.nl/media",
          "name": "DKL Media Archief - Foto's, Video's & Radio",
          "description": "Media archief van De Koninklijke Loop met foto's, video's en radio-uitzendingen van voorgaande edities",
          "inLanguage": "nl-NL",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.dekoninklijkeloop.nl#website"
          },
          "about": {
            "@type": "Event",
            "name": "De Koninklijke Loop (DKL)",
            "url": "https://www.dekoninklijkeloop.nl"
          },
          "hasPart": [
            {
              "@type": "MediaGallery",
              "name": "Radio Uitzendingen 2024 & 2025",
              "description": "Live radio-uitzendingen tijdens De Koninklijke Loop 2024 & 2025"
            }
          ]
        })}
      </script>

      <div className="min-h-screen bg-white">
        {/* Hero Section - High Priority */}
        <LazySection priority="high">
          <header className="relative bg-orange-100 py-20 px-5">
            <div className="max-w-4xl mx-auto text-center">
              <h1 id="media-heading" className={cn(cc.text.h1, 'text-gray-900 mb-4', cc.typography.heading)}>
                DKL Media Archief
              </h1>
              <p className={cn(cc.typography.lead, 'text-gray-700 max-w-3xl mx-auto')}>
                Herbeleef de sfeer en enthousiasme van De Koninklijke Loop via onze media fragmenten.
              </p>
            </div>
          </header>
        </LazySection>

        {/* Radio Gallery - Medium Priority */}
        <LazySection
          priority="medium"
          fallback={
            <div className="py-16 px-5">
              <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-8 w-3/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <section aria-labelledby="radio-heading">
            <h2 id="radio-heading" className={cn(cc.a11y.srOnly)}>Radio Fragmenten</h2>
            <RadioGallery
              title="Radio Uitzendingen 2024 & 2025"
              subtitle="Luister naar fragmenten van onze live radio-uitzending tijdens De Koninklijke Loop 2024"
            />
          </section>
        </LazySection>

        {/* Additional Content - Low Priority */}
        <LazySection
          priority="low"
          fallback={
            <div className="max-w-4xl mx-auto py-16 px-5">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-6 w-1/3"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          }
        >
          <article className="max-w-4xl mx-auto py-16 px-5" aria-labelledby="why-media-heading">
            <h2 id="why-media-heading" className={cn(cc.text.h2, 'text-gray-900 mb-6', cc.typography.heading)}>
              Waarom Media?
            </h2>
            <div className={cn('prose prose-lg max-w-none', cc.typography.body)}>
              <p>
                Waarom hoor je De Koninklijke Loop op de radio? We gebruiken de ether om iedereen te laten weten waarom we dit bijzondere evenement organiseren: een sponsorloop vóór en dóór mensen met een beperking. We hopen hiermee natuurlijk ook jou enthousiast te maken om volgend jaar mee te lopen!
              </p>
              <p>
                Daarnaast is het een ontzettend toffe ervaring voor de cliënten van 's Heeren Loo. Zij krijgen de kans om live op de radio verslag te doen van hun eigen evenement – een unieke belevenis die perfect past bij de gedachte achter De Koninklijke Loop.
              </p>
              <p>
                Dit media archief is een plek waar we die mooie herinneringen bewaren. Luister terug naar de fragmenten en herbeleef de energie en het enthousiasme van de uitzendingen.
              </p>
              <p>
                Heb je vragen over onze media-uitingen of wil je meer weten? Neem dan <a href="/contact" className={cn(colors.primary.text, 'hover:text-primary-dark underline', cc.transition.colors)}>contact</a> met ons op!
              </p>
            </div>
          </article>
        </LazySection>
      </div>
    </>
  );
});

MediaPage.displayName = 'MediaPage';

export default MediaPage; 