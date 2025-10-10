import React, { useEffect, Suspense, lazy, memo, useState, useRef } from 'react';
import { SEO } from '../../components/common/SEO';
import { trackEvent } from '@/utils/googleAnalytics';

// Lazy load components for better performance
const AboutHeader = lazy(() => import('./components/AboutHeader'));
const AboutImage = lazy(() => import('./components/AboutImage'));
const ContentGrid = lazy(() => import('./components/ContentGrid'));

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

const OverOns: React.FC = memo(() => {
  useEffect(() => {
    trackEvent('over_ons', 'page_view', 'over_ons_page');
  }, []);

  return (
    <>
      <SEO
        title="Over Ons | De Koninklijke Loop (DKL)"
        description="Leer meer over de organisatie achter De Koninklijke Loop (DKL), onze missie voor een toegankelijk wandelevenement en hoe we mensen met een beperking ondersteunen."
        route="/over-ons"
      />
      <div className="min-h-screen pt-20 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
          {/* High priority sections - load immediately */}
          <LazySection priority="high">
            <AboutHeader />
          </LazySection>

          {/* Medium priority sections */}
          <LazySection
            priority="medium"
            fallback={
              <div className="my-12 text-center max-w-4xl mx-auto">
                <div className="h-64 bg-gray-200 rounded-xl animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-32 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              </div>
            }
          >
            <AboutImage />
          </LazySection>

          {/* Low priority sections - load when scrolled into view */}
          <LazySection
            priority="low"
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 p-8 rounded-xl animate-pulse h-64"></div>
                ))}
              </div>
            }
          >
            <ContentGrid />
          </LazySection>
        </div>
      </div>
    </>
  );
});

OverOns.displayName = 'OverOns';

export default OverOns;