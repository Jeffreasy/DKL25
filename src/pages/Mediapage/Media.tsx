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
        title="Media Archief | De Koninklijke Loop (DKL)"
        description="Bekijk en beluister media van De Koninklijke Loop. Herbeleef de sfeer en enthousiasme van voorgaande edities via radiofragmenten en meer."
        route="/media"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section - High Priority */}
        <LazySection priority="high">
          <div className="relative bg-orange-100 py-20 px-5">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={cn(cc.text.h1, 'font-bold text-gray-900 mb-4')} style={{fontFamily: "'Montserrat', sans-serif"}}>
                Media Archief
              </h1>
              <p className={cn(cc.text.h4, 'text-gray-700 max-w-3xl mx-auto')} style={{fontFamily: "'Open Sans', sans-serif"}}>
                Herbeleef de sfeer en enthousiasme van De Koninklijke Loop via onze media fragmenten.
              </p>
            </div>
          </div>
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
          <RadioGallery
            title="Radio Uitzendingen 2024"
            subtitle="Luister naar fragmenten van onze live radio-uitzending tijdens De Koninklijke Loop 2024"
          />
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
          <div className="max-w-4xl mx-auto py-16 px-5">
            <h2 className={cn(cc.text.h2, 'font-bold text-gray-900 mb-6')} style={{fontFamily: "'Montserrat', sans-serif"}}>
              Waarom Media?
            </h2>
            <div className="prose prose-lg max-w-none" style={{fontFamily: "'Open Sans', sans-serif"}}>
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
          </div>
        </LazySection>
      </div>
    </>
  );
});

MediaPage.displayName = 'MediaPage';

export default MediaPage; 