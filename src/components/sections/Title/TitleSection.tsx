// TitleSection.tsx
import React, { useCallback, memo, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTitleSectionData } from './functions/useTitleSectionData';
import { TitleSectionData } from './functions/types';
import { useSocialMediaData } from './functions/useSocialMediaData';
import { cc, cn, colors, animations } from '@/styles/shared';
import TitleHeader from './components/TitleHeader';
import EventImage from './components/EventImage';
import ParticipantCounter from './components/ParticipantCounter';
import CountdownTimer from './components/CountdownTimer';
import EventDetailsGrid from './components/EventDetailsGrid';
import CTAButton from './components/CTAButton';

// Lazy load SocialMediaSection for better performance
const SocialMediaSection = lazy(() => import('./components/SocialMediaSection'));

interface TitleSectionProps {
  onInschrijfClick: () => void;
}

const TitleSkeleton: React.FC = () => (
  <div className={cn(animations.pulse, 'space-y-8')}>
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
);

// Default values for graceful fallback - matches current API data
const DEFAULT_TITLE_DATA: Partial<TitleSectionData> = {
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
};

const TitleSection: React.FC<TitleSectionProps> = memo(({ onInschrijfClick }) => {
  const { titleData, isLoading: isTitleLoading, error: titleError, refetch } = useTitleSectionData();
  const { socialEmbeds, isLoading: isSocialLoading, error: socialError } = useSocialMediaData();

  const handleRetry = () => {
    refetch();
  };

  // Use loaded data or defaults
  const displayData = titleData || DEFAULT_TITLE_DATA;

  // Memoize details array to prevent recreation
  const eventDetails = useMemo(() => [
    { title: displayData.detail_1_title || DEFAULT_TITLE_DATA.detail_1_title || '', description: displayData.detail_1_description || DEFAULT_TITLE_DATA.detail_1_description || '' },
    { title: displayData.detail_2_title || DEFAULT_TITLE_DATA.detail_2_title || '', description: displayData.detail_2_description || DEFAULT_TITLE_DATA.detail_2_description || '' },
    { title: displayData.detail_3_title || DEFAULT_TITLE_DATA.detail_3_title || '', description: displayData.detail_3_description || DEFAULT_TITLE_DATA.detail_3_description || '' },
  ], [displayData]);

  if (titleError && !titleData) {
    return (
      <div className={cn('py-16 px-5 bg-white text-center', cc.typography.heading)}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className={cn(cc.text.error, 'mb-4')}>{titleError}</p>
          <button
            onClick={handleRetry}
            className={cn(cc.button.primary, colors.primary.focusRing)}
          >
            Opnieuw proberen
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section
      className={cn('relative w-full bg-gradient-to-b from-orange-50 to-orange-100 py-12 text-center overflow-hidden isolate', cc.typography.heading)}
      role="region"
      aria-label="Evenement details"
    >
      {isTitleLoading && !titleData ? (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <TitleSkeleton />
        </div>
      ) : (
        <motion.div
          className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative rounded-2xl p-4 sm:p-8 backdrop-blur-none bg-white shadow-lg"
          >
            {/* Main Content */}
            <div className="space-y-12">
              <TitleHeader title={displayData.event_title || ''} subtitle={displayData.event_subtitle || ''} />

              <EventImage src={displayData.image_url ?? DEFAULT_TITLE_DATA.image_url ?? ''} alt={displayData.image_alt ?? DEFAULT_TITLE_DATA.image_alt ?? 'Event Banner'} />

              <ParticipantCounter count={displayData.participant_count} />

              <CountdownTimer />

              <EventDetailsGrid details={eventDetails} />

              <CTAButton onClick={onInschrijfClick} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Divider */}
      <motion.div
        className="relative mt-8 mb-8 w-full h-[3px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-200" />
      </motion.div>

      {/* Social Media Section */}
      <div className="bg-white py-12">
        {!isSocialLoading && socialEmbeds.length > 0 && (
          <Suspense fallback={<div className="text-center py-8">Social media laden...</div>}>
            <SocialMediaSection socialEmbeds={socialEmbeds} />
          </Suspense>
        )}
        {socialError && (
          <div className={cn('max-w-md mx-auto p-4 bg-red-50 border border-red-200', cc.border.rounded, 'text-center')}>
            <p className={cn(cc.text.error)}>{socialError}</p>
          </div>
        )}
      </div>
    </section>
  );
});

export default TitleSection;
