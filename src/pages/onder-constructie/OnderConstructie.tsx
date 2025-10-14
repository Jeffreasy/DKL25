import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/common/SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors, animations, icons } from '@/styles/shared';

const OnderConstructie: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('OnderConstructiePage');

  const { data, loading, error } = useUnderConstruction();

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      prefersReducedMotion,
      motionProps: prefersReducedMotion
        ? {}
        : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }
    };
  }, [trackInteraction]);

  // Memoize SEO props to prevent recreation
  const seoProps = useMemo(() => ({
    route: "/onder-constructie",
    title: data ? `${data.title} - De Koninklijke Loop` : "Onder Constructie - De Koninklijke Loop",
    description: data?.message || "Deze pagina is momenteel onder constructie.",
    noIndex: false
  }), [data]);

  // Memoize the main content rendering logic
  const content = useMemo(() => {
    if (loading) {
      trackInteraction('loading_state', 'under_construction_data');
      return (
        <>
          <SEO {...seoProps} />
          <div className="min-h-screen pt-20 bg-white">
            <div className={cn('w-full max-w-[1400px] mx-auto px-6 py-12', cc.typography.body)}>
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-56 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (error || !data) {
      trackInteraction('error_state', 'under_construction_data_failed');
      return (
        <>
          <SEO {...seoProps} />
          <div className="min-h-screen pt-20 bg-white">
            <div className={cn('w-full max-w-[1400px] mx-auto px-6 py-12', cc.typography.body)}>
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                  <h1 className={cn(cc.text.h2, 'text-gray-900 mb-4', cc.typography.heading)}>De Koninklijke Loop 2026</h1>
                  <p className={cn(cc.text.body, 'text-gray-600 mb-4')}>
                    DKL 2026 - De Koninklijke Loop is een uniek sponsorloop in Nederland, mede georganiseerd door mensen met een beperking voor mensen met een beperking.
                  </p>
                  <p className={cn(cc.text.muted, 'mb-4')}>
                    De website is momenteel in ontwikkeling. Neem contact op voor meer informatie.
                  </p>
                  <a
                    href="mailto:info@dekoninklijkeloop.nl"
                    className={cn('inline-flex items-center gap-2 font-semibold', colors.primary.text, cc.typography.link, colors.primary.focusRing)}
                    aria-label="Neem contact op via email"
                  >
                    Neem contact op
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    trackInteraction('success_state', 'under_construction_data_loaded');
    return (
      <>
        <SEO {...seoProps} />
        <div className={cn('min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50', cc.flex.center, cc.typography.body)}>
          <div className={cn(cc.container.narrow, 'px-6 py-12 text-center')}>
            <motion.div
              {...accessibilityPrefs.motionProps}
              className="space-y-8"
            >
              <div className={cn(cc.flex.center, 'mb-6')}>
                <span className={cn(icons['2xl'], colors.primary.text)} aria-label="Onder constructie">🔧</span>
              </div>
              <h1 className={cn(cc.text.h1, 'text-gray-900 tracking-tight leading-tight', cc.typography.heading)}>
                {data.title}
              </h1>
              <p className={cn(cc.typography.lead, cc.text.muted, 'max-w-2xl mx-auto')}>
                {data.message}
              </p>
              <p className={cn(cc.text.bodyLarge, colors.primary.text, cc.typography.body)}>
                {data.footer_text}
              </p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }, [data, loading, error, accessibilityPrefs, seoProps, trackInteraction]);

  return content;
});

OnderConstructie.displayName = 'OnderConstructie';

export default OnderConstructie;