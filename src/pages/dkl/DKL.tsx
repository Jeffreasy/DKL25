import React, { useEffect, Suspense, lazy, memo, useState, useRef } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';

// Lazy load the RouteSection component
const RouteSection = lazy(() => import('./components/RouteSection'));

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

const DKL: React.FC = memo(() => {
  useEffect(() => {
    trackEvent('dkl', 'page_view', 'dkl_page');
  }, []);

  return (
    <>
      <SEO
        title="Wat is De Koninklijke Loop (DKL)?"
        description="Ontdek alles over De Koninklijke Loop (DKL): een uniek, toegankelijk wandelevenement waar mensen met een beperking lopen voor het goede doel in Apeldoorn."
        route="/wat-is-de-koninklijkeloop"
      />
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