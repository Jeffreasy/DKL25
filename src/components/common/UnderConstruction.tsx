import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaEnvelope, FaClock, FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { SEO } from './SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { cc, cn, colors, animations, icons } from '@/styles/shared';

// Define countdown renderer outside component to prevent re-renders
const countdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) {
    return <p className={cn(cc.text.muted, cc.typography.body)}>We zijn bijna klaar!</p>;
  }

  return (
    <div className={cn(cc.flex.center, 'gap-4 mb-4')} aria-label="Countdown tot lancering" aria-live="polite">
      <div className="text-center">
        <span className={cn(cc.text.bodyLarge, colors.primary.text)}>{days}</span>
        <span className={cn(cc.text.small, cc.text.muted)}>Dagen</span>
      </div>
      <div className="text-center">
        <span className={cn(cc.text.bodyLarge, colors.primary.text)}>{hours}</span>
        <span className={cn(cc.text.small, cc.text.muted)}>Uren</span>
      </div>
      <div className="text-center">
        <span className={cn(cc.text.bodyLarge, colors.primary.text)}>{minutes}</span>
        <span className={cn(cc.text.small, cc.text.muted)}>Minuten</span>
      </div>
      <div className="text-center">
        <span className={cn(cc.text.bodyLarge, colors.primary.text)}>{seconds}</span>
        <span className={cn(cc.text.small, cc.text.muted)}>Seconden</span>
      </div>
    </div>
  );
};

interface UnderConstructionData {
  id: number;
  is_active: boolean;
  title: string;
  message: string;
  footer_text: string;
  logo_url?: string;
  expected_date?: string;
  progress_percentage?: number;
  social_links?: { platform: string; url: string }[];
  contact_email?: string;
  newsletter_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

const UnderConstruction: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('UnderConstructionComponent');

  const { data, loading, error } = useUnderConstruction() as {
    data: UnderConstructionData | null;
    loading: boolean;
    error: Error | null;
  };

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
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
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
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
          noIndex={true}
        />
        <div className={cn('min-h-screen pt-20', colors.neutral.white)} role="alert">
          <div className={cn(cc.container.wide, cc.spacing.section, cc.typography.body)}>
            <div className={cn(cc.flex.center, 'min-h-[50vh]')}>
              <div className="text-center">
                <h1 className={cn(cc.text.h3, 'text-gray-900 mb-4')}>Fout bij laden</h1>
                <p className={cc.text.muted}>Er is een probleem opgetreden bij het laden van de pagina.</p>
                {process.env.NODE_ENV === 'development' && error && (
                  <p className={cn(cc.text.muted, 'mt-2')}>Fout: {error.message}</p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className={cn('mt-4 font-semibold', colors.primary.text, cc.typography.link, colors.primary.focusRing)}
                  aria-label="Probeer opnieuw"
                >
                  Probeer opnieuw
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
// Define social icon function outside component to prevent re-renders
const getSocialIcon = (platform: string) => {
  const iconClasses = cn(icons.lg, icons.primary, icons.interactive);
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <FaTwitter className={iconClasses} aria-hidden="true" />;
    case 'instagram':
      return <FaInstagram className={iconClasses} aria-hidden="true" />;
    case 'facebook':
      return <FaFacebook className={iconClasses} aria-hidden="true" />;
    case 'linkedin':
      return <FaLinkedin className={iconClasses} aria-hidden="true" />;
    default:
      return null;
  }
};

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
        title={`${data?.title || 'Onder Constructie'} - De Koninklijke Loop`}
        description={data?.message || 'Deze pagina is momenteel onder constructie.'}
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
              <FaTools className={mainStyles.icon} aria-label="Onder constructie" />
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
                  <FaClock className={mainStyles.sectionIcon} aria-hidden="true" />
                  <span className={mainStyles.sectionTitle}>
                    Verwachte lancering
                  </span>
                </div>
                <Countdown date={data.expected_date} renderer={countdownRenderer} />
              </div>
            )}
            {data?.progress_percentage !== undefined && data.progress_percentage > 0 && (
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
                  <FaEnvelope className={mainStyles.contactIcon} aria-hidden="true" />
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
                    alert('Nieuwsbrief signup nog te implementeren!');
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
            <p className={mainStyles.footer}>
              {data?.footer_text || 'Bedankt voor uw geduld!'}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
});

UnderConstruction.displayName = 'UnderConstruction';

export default UnderConstruction;