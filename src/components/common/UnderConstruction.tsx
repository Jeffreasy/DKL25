import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SEO } from './SEO';
import { useUnderConstruction, type UnderConstructionData } from '../../hooks/useUnderConstruction';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors, animations, icons } from '@/styles/shared';

/**
 * Get social media icon for platform
 * Returns appropriate emoji icon for social media platform
 */
const getSocialIcon = (platform: string): JSX.Element | null => {
  const iconClasses = cn(icons.lg, icons.primary, icons.interactive);
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <span className={iconClasses} aria-hidden="true">🐦</span>;
    case 'instagram':
      return <span className={iconClasses} aria-hidden="true">📷</span>;
    case 'youtube':
      return <span className={iconClasses} aria-hidden="true">▶️</span>;
    case 'facebook':
      return <span className={iconClasses} aria-hidden="true">📘</span>;
    case 'linkedin':
      return <span className={iconClasses} aria-hidden="true">💼</span>;
    default:
      return <span className={iconClasses} aria-hidden="true">🔗</span>;
  }
};

/**
 * Format date string to Dutch locale
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

/**
 * UnderConstruction Component
 * Displays maintenance mode page when backend API returns active maintenance status
 */
const UnderConstruction: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('UnderConstructionComponent');

  const { data, loading, error } = useUnderConstruction();

  // Memoize accessibility checks to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      prefersReducedMotion,
      pulseClass: prefersReducedMotion ? '' : animations.pulse,
      motionProps: prefersReducedMotion
        ? {}
        : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }
    };
  }, [trackInteraction]);

  // Memoize loading skeleton styles
  const loadingSkeleton = useMemo(() => ({
    container: cn('min-h-screen pt-20', colors.neutral.white),
    wrapper: cn(cc.container.wide, cc.spacing.section, cc.typography.body),
    center: cn(cc.flex.center, 'min-h-[50vh]'),
    pulse: cn(accessibilityPrefs.pulseClass),
    skeleton: cn(cc.loading.skeleton, 'h-8 w-48 mx-auto mb-4'),
    skeletonSmall: cn(cc.loading.skeleton, 'h-4 w-64 mx-auto mb-2'),
    skeletonTiny: cn(cc.loading.skeleton, 'h-4 w-56 mx-auto'),
  }), [accessibilityPrefs.pulseClass]);

  if (loading) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - DKL (De Koninklijke Loop) 2026"
          description="Deze pagina is momenteel onder constructie. DKL 2026 komt eraan!"
          noIndex={true}
        />
        <div className={loadingSkeleton.container} aria-busy="true">
          <div className={loadingSkeleton.wrapper}>
            <div className={loadingSkeleton.center}>
              <div className="text-center">
                <div className={loadingSkeleton.pulse}>
                  <div className={loadingSkeleton.skeleton}></div>
                  <div className={loadingSkeleton.skeletonSmall}></div>
                  <div className={loadingSkeleton.skeletonTiny}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - DKL (De Koninklijke Loop) 2026"
          description="Deze pagina is momenteel onder constructie. DKL 2026 komt eraan!"
          noIndex={true}
        />
        <div className={cn('min-h-screen pt-20', colors.neutral.white)} role="alert">
          <div className={cn(cc.container.wide, cc.spacing.section, cc.typography.body)}>
            <div className={cn(cc.flex.center, 'min-h-[50vh]')}>
              <div className="text-center">
                <h1 className={cn(cc.text.h3, 'text-gray-900 mb-4')}>DKL 2026 - De Koninklijke Loop</h1>
                <p className={cn(cc.text.body, 'text-gray-600 mb-4')}>
                  DKL (De Koninklijke Loop) is een uniek sponsorloop in Nederland, mede georganiseerd door mensen met een beperking voor mensen met een beperking.
                </p>
                <p className={cn(cc.text.muted, 'mb-4')}>
                  De website is momenteel in ontwikkeling. Neem contact op voor meer informatie.
                </p>
                <a
                  href="mailto:info@dekoninklijkeloop.nl"
                  className={cn('inline-flex items-center gap-2 font-semibold', colors.primary.text, cc.typography.link, colors.primary.focusRing)}
                  aria-label="Neem contact op via email"
                >
                  <span className={cn(icons.lg)} aria-hidden="true">✉️</span>
                  Neem contact op
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Define main content styles
  const mainStyles = {
    container: cn('min-h-screen', colors.gradient.construction, cc.flex.center, cc.typography.body),
    wrapper: cn(cc.container.narrow, cc.spacing.section, 'text-center'),
    motion: 'space-y-8',
    logoContainer: 'flex justify-center mb-6',
    logo: 'h-20 w-auto',
    iconContainer: cn(cc.flex.center, 'mb-6'),
    icon: cn(icons['2xl'], colors.primary.text),
    title: cn(cc.text.h1, 'text-gray-900 tracking-tight', cc.typography.heading, 'leading-tight'),
    message: cn(cc.text.h5, cc.text.muted, cc.typography.body, 'max-w-2xl mx-auto leading-relaxed'),
    section: 'mb-6',
    sectionHeader: cn(cc.flex.center, 'gap-2 mb-4'),
    sectionIcon: cn(icons.lg, colors.primary.text),
    sectionTitle: cn(cc.text.h5, 'font-semibold text-gray-700'),
    progressContainer: 'max-w-md mx-auto',
    progressText: cn(cc.text.body, cc.text.muted, 'mt-2'),
    socialTitle: cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4'),
    socialContainer: cn(cc.flex.center, 'gap-6'),
    contactTitle: cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4'),
    contactLink: cn('inline-flex items-center gap-2', colors.primary.text, 'hover:text-indigo-700', cc.transition.colors, cc.text.h5),
    contactIcon: cn(icons.lg),
    newsletterTitle: cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4'),
    newsletterForm: 'flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto',
    newsletterInput: cn(cc.input.base, 'py-3'),
    newsletterButton: cn(cc.button.primary, 'py-3', colors.primary.focusRing),
    newsletterDescription: cn(cc.text.muted, 'text-sm mt-2'),
    footer: cn(cc.text.h5, colors.primary.text, 'font-semibold', cc.typography.body),
  };

  return (
    <>
      <SEO
        route="/onder-constructie"
        title={`${data?.title || 'Onder Constructie'} - DKL 2026`}
        description={data?.message || 'Deze pagina is momenteel onder constructie. DKL 2026 komt eraan!'}
        noIndex={true}
      />
      <div className={mainStyles.container}>
        <div className={mainStyles.wrapper}>
          <motion.div {...accessibilityPrefs.motionProps} className={mainStyles.motion}>
            {data?.logo_url && (
              <div className={mainStyles.logoContainer}>
                <img src={data.logo_url} alt="De Koninklijke Loop Logo" className={mainStyles.logo} />
              </div>
            )}
            <div className={mainStyles.iconContainer}>
              <span className={mainStyles.icon} aria-label="Onder constructie">🔧</span>
            </div>
            <h1 className={mainStyles.title}>
              {data?.title || 'Onder Constructie'}
            </h1>
            <p className={mainStyles.message}>
              {data?.message || 'Deze pagina is momenteel onder constructie.'}
            </p>
            {data?.expected_date && (
              <div className={mainStyles.section}>
                <div className={mainStyles.sectionHeader}>
                  <span className={mainStyles.sectionIcon} aria-hidden="true">⏰</span>
                  <span className={mainStyles.sectionTitle}>
                    Verwachte terugkeer
                  </span>
                </div>
                <p className={cn(cc.text.body, colors.primary.text, 'font-semibold')}>
                  {formatDate(data.expected_date)}
                </p>
              </div>
            )}
            {data?.progress_percentage !== null && data.progress_percentage !== undefined && data.progress_percentage > 0 && (
              <div className={mainStyles.section}>
                <div className={mainStyles.progressContainer}>
                  <div className={cc.progress.container}>
                    <div
                      className={cc.progress.bar}
                      style={{ width: `${data.progress_percentage}%` }}
                      role="progressbar"
                      aria-valuenow={data.progress_percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <p className={mainStyles.progressText}>
                    Voortgang: {data.progress_percentage}%
                  </p>
                </div>
              </div>
            )}
            {data?.social_links && data.social_links.length > 0 && (
              <div className={mainStyles.section}>
                <p className={mainStyles.socialTitle}>Volg ons</p>
                <div className={mainStyles.socialContainer}>
                  {data.social_links.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(colors.primary.text, 'hover:text-indigo-700', cc.transition.colors)}
                      aria-label={`Volg ons op ${link.platform}`}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data?.contact_email && (
              <div className={mainStyles.section}>
                <p className={mainStyles.contactTitle}>Neem contact op</p>
                <a
                  href={`mailto:${data.contact_email}`}
                  className={mainStyles.contactLink}
                  aria-label="Contacteer ons via email"
                >
                  <span className={mainStyles.contactIcon} aria-hidden="true">✉️</span>
                  <span>{data.contact_email}</span>
                </a>
              </div>
            )}
            {data?.newsletter_enabled && (
              <div className={mainStyles.section}>
                <p className={mainStyles.newsletterTitle}>
                  Blijf op de hoogte
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    trackInteraction('newsletter_submit', 'attempted');
                    alert('Nieuwsbrief aanmelding wordt binnenkort geactiveerd!');
                  }}
                  className={mainStyles.newsletterForm}
                >
                  <input
                    type="email"
                    placeholder="Vul je emailadres in"
                    className={mainStyles.newsletterInput}
                    aria-label="Emailadres voor nieuwsbrief"
                    aria-describedby="newsletter-description"
                    required
                  />
                  <button
                    type="submit"
                    className={mainStyles.newsletterButton}
                    aria-label="Aanmelden voor nieuwsbrief"
                  >
                    Aanmelden
                  </button>
                </form>
                <p id="newsletter-description" className={mainStyles.newsletterDescription}>
                  Ontvang updates over de lancering van De Koninklijke Loop.
                </p>
              </div>
            )}
            {data?.footer_text && (
              <p className={mainStyles.footer}>
                {data.footer_text}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
});

UnderConstruction.displayName = 'UnderConstruction';

export default UnderConstruction;