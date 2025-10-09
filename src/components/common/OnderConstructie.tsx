import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaEnvelope, FaClock, FaTwitter, FaInstagram } from 'react-icons/fa';
import { SEO } from './SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { cc, cn, colors, animations } from '@/styles/shared';

interface UnderConstructionData {
  title: string;
  message: string;
  logo_url?: string;
  expected_date?: string;
  progress_percentage?: number | null;
  social_links?: { platform: string; url: string }[];
  contact_email?: string;
  newsletter_enabled?: boolean;
  footer_text?: string;
}

const OnderConstructie: React.FC = () => {
  const { data, loading, error } = useUnderConstruction() as {
    data: UnderConstructionData | null;
    loading: boolean;
    error: Error | null;
  };

  const pulseClass = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : animations.pulse;
  const motionProps = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  if (loading) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
          noIndex={true}
        />
        <div className={cn('min-h-screen pt-20', colors.neutral.white)} aria-busy="true">
          <div className={cn(cc.container.wide, cc.spacing.section, cc.typography.body)}>
            <div className={cn(cc.flex.center, 'min-h-[50vh]')}>
              <div className="text-center">
                <div className={pulseClass}>
                  <div className={cn(cc.loading.skeleton, 'h-8 w-48 mx-auto mb-4')}></div>
                  <div className={cn(cc.loading.skeleton, 'h-4 w-64 mx-auto mb-2')}></div>
                  <div className={cn(cc.loading.skeleton, 'h-4 w-56 mx-auto')}></div>
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

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <p className={cn(cc.text.muted, cc.typography.body)}>We zijn bijna klaar!</p>;
    }
    return (
      <div className={cn(cc.flex.center, 'gap-4 mb-4')} aria-label="Countdown tot lancering" aria-live="polite">
        <div className="text-center">
          <span className={cn('block text-lg font-bold', colors.primary.text)}>{days}</span>
          <span className={cn(cc.text.small, cc.text.muted)}>Dagen</span>
        </div>
        <div className="text-center">
          <span className={cn('block text-lg font-bold', colors.primary.text)}>{hours}</span>
          <span className={cn(cc.text.small, cc.text.muted)}>Uren</span>
        </div>
        <div className="text-center">
          <span className={cn('block text-lg font-bold', colors.primary.text)}>{minutes}</span>
          <span className={cn(cc.text.small, cc.text.muted)}>Minuten</span>
        </div>
        <div className="text-center">
          <span className={cn('block text-lg font-bold', colors.primary.text)}>{seconds}</span>
          <span className={cn(cc.text.small, cc.text.muted)}>Seconden</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        route="/onder-constructie"
        title={`${data.title} - De Koninklijke Loop`}
        description={data.message}
        noIndex={true}
      />
      <div className={cn('min-h-screen', colors.gradient.construction, cc.flex.center, cc.typography.body)}>
        <div className={cn(cc.container.narrow, cc.spacing.section, 'text-center')}>
          <motion.div {...motionProps} className="space-y-8">
            {data.logo_url && (
              <div className="flex justify-center mb-6">
                <img src={data.logo_url} alt="De Koninklijke Loop Logo" className="h-20 w-auto" />
              </div>
            )}
            <div className={cn(cc.flex.center, 'mb-6')}>
              <FaTools className={cn('w-16 h-16', colors.primary.text)} aria-label="Onder constructie" />
            </div>
            <h1 className={cn(cc.text.h1, 'text-gray-900 tracking-tight', cc.typography.heading, 'leading-tight')}>
              {data.title}
            </h1>
            <p className={cn(cc.text.h5, cc.text.muted, cc.typography.body, 'max-w-2xl mx-auto leading-relaxed')}>
              {data.message}
            </p>
            {data.expected_date && (
              <div className="mb-6">
                <div className={cn(cc.flex.center, 'gap-2 mb-4')}>
                  <FaClock className={cn('w-6 h-6', colors.primary.text)} aria-hidden="true" />
                  <span className={cn(cc.text.h5, 'font-semibold text-gray-700')}>
                    Verwachte lancering
                  </span>
                </div>
                <Countdown date={data.expected_date} renderer={countdownRenderer} />
              </div>
            )}
            {data.progress_percentage !== null && (
              <div className="mb-6 max-w-md mx-auto">
                <div className={cn(cc.progress.container, 'h-3')}>
                  <div
                    className={cn(cc.progress.bar, 'h-3', cc.border.rounded)}
                    style={{ width: `${data.progress_percentage}%` }}
                    role="progressbar"
                    aria-valuenow={data.progress_percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <p className={cn(cc.text.body, cc.text.muted, 'mt-2')}>
                  Voortgang: {data.progress_percentage}%
                </p>
              </div>
            )}
            {data.social_links && data.social_links.length > 0 && (
              <div className="mb-6">
                <p className={cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4')}>Volg ons</p>
                <div className={cn(cc.flex.center, 'gap-6')}>
                  {data.social_links.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(colors.primary.text, 'hover:text-indigo-700', cc.transition.colors)}
                      aria-label={`Volg ons op ${link.platform}`}
                    >
                      {link.platform === 'Twitter' && <FaTwitter className="w-8 h-8" aria-hidden="true" />}
                      {link.platform === 'Instagram' && <FaInstagram className="w-8 h-8" aria-hidden="true" />}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data.contact_email && (
              <div className="mb-6">
                <p className={cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4')}>Neem contact op</p>
                <a
                  href={`mailto:${data.contact_email}`}
                  className={cn('inline-flex items-center gap-2', colors.primary.text, 'hover:text-indigo-700', cc.transition.colors, cc.text.h5)}
                  aria-label="Contacteer ons via email"
                >
                  <FaEnvelope className="w-6 h-6" aria-hidden="true" />
                  <span>{data.contact_email}</span>
                </a>
              </div>
            )}
            {data.newsletter_enabled && (
              <div className="mb-6">
                <p className={cn(cc.text.h5, cc.text.muted, 'font-semibold mb-4')}>
                  Blijf op de hoogte
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Nieuwsbrief signup nog te implementeren!');
                  }}
                  className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="Vul je emailadres in"
                    className={cn(cc.input.base, 'py-3')}
                    aria-label="Emailadres voor nieuwsbrief"
                    aria-describedby="newsletter-description"
                    required
                  />
                  <button
                    type="submit"
                    className={cn(cc.button.primary, 'py-3', colors.primary.focusRing)}
                    aria-label="Aanmelden voor nieuwsbrief"
                  >
                    Aanmelden
                  </button>
                </form>
                <p id="newsletter-description" className={cn(cc.text.muted, 'text-sm mt-2')}>
                  Ontvang updates over de lancering van De Koninklijke Loop.
                </p>
              </div>
            )}
            <p className={cn(cc.text.h5, colors.primary.text, 'font-semibold', cc.typography.body)}>
              {data.footer_text}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default React.memo(OnderConstructie);