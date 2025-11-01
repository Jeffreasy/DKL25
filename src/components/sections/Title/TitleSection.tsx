import React, { memo, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTitleSectionData } from './functions/useTitleSectionData';
import { TitleSectionData } from './functions/types';
import { useSocialMediaData } from './functions/useSocialMediaData';
import { cc, cn, animations } from '@/styles/shared';
import TitleHeader from './components/TitleHeader';
import EventImage from './components/EventImage';
import ParticipantCounter from './components/ParticipantCounter';
import CountdownTimer from './components/CountdownTimer';
import EventDetailsGrid from './components/EventDetailsGrid';
import CTAButton from './components/CTAButton';

// ============================================================================
// Lazy Imports
// ============================================================================

const SocialMediaSection = lazy(() => import('./components/SocialMediaSection'));

// ============================================================================
// Types
// ============================================================================

interface TitleSectionProps {
  onInschrijfClick: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default fallback data for graceful degradation
 * Matches current API data structure
 */
const DEFAULT_TITLE_DATA: Readonly<Partial<TitleSectionData>> = {
  event_title: 'De Koninklijke Loop (DKL) 2026',
  event_subtitle: 'Op de koninklijke weg in Apeldoorn kunnen mensen met een beperking samen wandelen tijdens dit unieke, rolstoelvriendelijke sponsorloop (DKL), samen met hun verwanten, vrijwilligers of begeleiders.',
  image_url: 'https://res.cloudinary.com/dgfuv7wif/image/upload/v1760112848/Wij_gaan_17_mei_lopen_voor_hen_3_zllxno_zoqd7z.webp',
  image_alt: 'Promotiebanner De Koninklijke Loop (DKL) 2026: Wij gaan 17 mei lopen voor hen',
  detail_1_title: '17 mei 2026',
  detail_1_description: 'Starttijden variëren per afstand. Zie programma.',
  detail_2_title: 'Voor iedereen',
  detail_2_description: 'wandelaars met of zonder beperking (rolstoelvriendelijk).',
  detail_3_title: 'Lopen voor een goed doel',
  detail_3_description: 'Steun het goede doel via dit unieke wandelevenement.',
  participant_count: 69,
} as const;

const ANIMATION_CONFIG = {
  content: { duration: 0.6 },
  divider: { delay: 1, duration: 0.8 },
} as const;

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Loading skeleton for title section
 */
const TitleSkeleton = memo(() => (
  <div className={cn(animations.pulse, 'space-y-8')} role="status" aria-label="Laden...">
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className={cn('h-12 bg-gray-200', cc.border.rounded, 'w-3/4 mx-auto')} />
      <div className={cn('h-6 bg-gray-200', cc.border.rounded, 'w-full')} />
    </div>
    <div className="max-w-[800px] mx-auto">
      <div className="aspect-video bg-gray-200 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-48" />
      ))}
    </div>
  </div>
));

TitleSkeleton.displayName = 'TitleSkeleton';

/**
 * Error state with retry functionality
 */
const ErrorState = memo<{ error: string; onRetry: () => void }>(({ error, onRetry }) => (
  <div className={cn('py-16 px-5 bg-white text-center', cc.typography.heading)}>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <p className={cn(cc.text.error, 'mb-4')}>{error}</p>
      <button
        onClick={onRetry}
        className={cn(cc.button.primary, 'focus-visible:ring-2 focus-visible:ring-primary')}
        aria-label="Probeer opnieuw te laden"
      >
        Opnieuw proberen
      </button>
    </motion.div>
  </div>
));

ErrorState.displayName = 'ErrorState';

/**
 * Animated section divider
 */
const SectionDivider = memo(() => (
  <motion.div
    className="relative mt-8 mb-8 w-full h-[3px]"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={ANIMATION_CONFIG.divider}
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-200" />
  </motion.div>
));

SectionDivider.displayName = 'SectionDivider';

/**
 * Social media section wrapper with error handling
 */
const SocialMediaWrapper = memo<{
  isLoading: boolean;
  error: string | null;
  socialEmbeds: any[];
}>(({ isLoading, error, socialEmbeds }) => {
  if (isLoading || socialEmbeds.length === 0) return null;

  return (
    <div className="bg-white py-12">
      {error ? (
        <div
          className={cn(
            'max-w-md mx-auto p-4 bg-red-50 border border-red-200',
            cc.border.rounded,
            'text-center'
          )}
          role="alert"
          aria-live="polite"
        >
          <p className={cn(cc.text.error)}>{error}</p>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="text-center py-8" role="status">
              Social media laden...
            </div>
          }
        >
          <SocialMediaSection socialEmbeds={socialEmbeds} />
        </Suspense>
      )}
    </div>
  );
});

SocialMediaWrapper.displayName = 'SocialMediaWrapper';

/**
 * Main content section with all event information
 */
const TitleContent = memo<{
  displayData: Partial<TitleSectionData>;
  eventDetails: Array<{ title: string; description: string }>;
  onInschrijfClick: () => void;
}>(({ displayData, eventDetails, onInschrijfClick }) => (
  <motion.div
    className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={ANIMATION_CONFIG.content}
  >
    <div className="relative rounded-2xl p-4 sm:p-8 bg-white shadow-lg">
      <div className="space-y-12">
        <TitleHeader
          title={displayData.event_title || DEFAULT_TITLE_DATA.event_title || ''}
          subtitle={displayData.event_subtitle || DEFAULT_TITLE_DATA.event_subtitle || ''}
        />

        <EventImage
          src={displayData.image_url ?? DEFAULT_TITLE_DATA.image_url ?? ''}
          alt={displayData.image_alt ?? DEFAULT_TITLE_DATA.image_alt ?? 'Event Banner'}
        />

        <ParticipantCounter count={displayData.participant_count} />

        <CountdownTimer />

        <EventDetailsGrid details={eventDetails} />

        <CTAButton onClick={onInschrijfClick} />
      </div>
    </div>
  </motion.div>
));

TitleContent.displayName = 'TitleContent';

// ============================================================================
// Main Component
// ============================================================================

/**
 * Title Section Component
 *
 * Main title section displaying event information, image, countdown,
 * participant counter, and social media embeds. Features dynamic data
 * loading with skeleton states and error handling.
 *
 * @component
 * @param {TitleSectionProps} props - Component props
 */
const TitleSection: React.FC<TitleSectionProps> = memo(({ onInschrijfClick }) => {
  const { titleData, isLoading: isTitleLoading, error: titleError, refetch } = useTitleSectionData();
  const { socialEmbeds, isLoading: isSocialLoading, error: socialError } = useSocialMediaData();

  // ============================================================================
  // Memoized Values
  // ============================================================================

  const displayData = useMemo(
    () => titleData || DEFAULT_TITLE_DATA,
    [titleData]
  );

  const eventDetails = useMemo(
    () => [
      {
        title: displayData.detail_1_title || DEFAULT_TITLE_DATA.detail_1_title || '',
        description: displayData.detail_1_description || DEFAULT_TITLE_DATA.detail_1_description || '',
      },
      {
        title: displayData.detail_2_title || DEFAULT_TITLE_DATA.detail_2_title || '',
        description: displayData.detail_2_description || DEFAULT_TITLE_DATA.detail_2_description || '',
      },
      {
        title: displayData.detail_3_title || DEFAULT_TITLE_DATA.detail_3_title || '',
        description: displayData.detail_3_description || DEFAULT_TITLE_DATA.detail_3_description || '',
      },
    ],
    [displayData]
  );

  // ============================================================================
  // Error Handling
  // ============================================================================

  if (titleError && !titleData) {
    return <ErrorState error={titleError} onRetry={refetch} />;
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden isolate',
        'bg-gradient-to-b from-orange-50 to-orange-100',
        'py-12 text-center',
        cc.typography.heading
      )}
      aria-labelledby="title-section-heading"
    >
      {/* Main Content */}
      {isTitleLoading && !titleData ? (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <TitleSkeleton />
        </div>
      ) : (
        <TitleContent
          displayData={displayData}
          eventDetails={eventDetails}
          onInschrijfClick={onInschrijfClick}
        />
      )}

      {/* Section Divider */}
      <SectionDivider />

      {/* Social Media Section */}
      <SocialMediaWrapper
        isLoading={isSocialLoading}
        error={socialError}
        socialEmbeds={socialEmbeds}
      />
    </section>
  );
});

TitleSection.displayName = 'TitleSection';

export default TitleSection;
