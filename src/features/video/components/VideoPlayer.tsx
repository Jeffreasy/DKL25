import React, { useState, useEffect, useRef, memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { STREAMABLE_THUMB_BASE_URL } from '../constants';
import { cc, cn, colors, animations } from '@/styles/shared';

interface VideoSlideProps {
  videoId: string;
  url: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  isThumbnail?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  ignoreFirstPlay?: boolean;
}

const VideoSlide: React.FC<VideoSlideProps> = memo(({
  videoId,
  url,
  title,
  isSelected,
  onClick,
  isThumbnail = false,
  onPlay,
  onPause,
  onEnded,
  ignoreFirstPlay = false
}) => {
  const [isLoading, setIsLoading] = useState(!isThumbnail);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!isThumbnail);
  const [hasPlayed, setHasPlayed] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const firstPlayEventRef = useRef<boolean>(true);

  // Veilige URL constructie
  const cleanVideoId = videoId.replace('e/', '');
  const thumbnailUrl = videoId 
    ? `${STREAMABLE_THUMB_BASE_URL}${cleanVideoId.trim()}.jpg`
    : '';

  // Veilige video URL
  const safeVideoUrl = url.includes('streamable.com/e/') ? url : '';

  // Intersection Observer en state reset gecombineerd
  useEffect(() => {
    if (!isThumbnail) {
      // Hoofdvideo: altijd in view en reset states bij URL verandering
      setIsInView(true);
      setIsLoading(true);
      setHasError(false);
      setHasPlayed(false);
      firstPlayEventRef.current = true; // Reset first play detection
      return;
    }

    // Thumbnail: intersection observer
    if (!slideRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const currentRef = slideRef.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [isThumbnail, url]);

  // Luister naar berichten van de iframe voor video events
  useEffect(() => {
    // Listener alleen toevoegen voor de hoofdvideo
    if (isThumbnail) return;

    const handleMessage = (event: MessageEvent) => {
      // Controleer of het bericht van Streamable komt
      if (!event.origin.includes('streamable.com')) return;
      if (!event.data || typeof event.data !== 'string') return;

      if (event.data.includes('play') || event.data.includes('playing')) {
        console.log('Video playing detected:', title, 'First play:', firstPlayEventRef.current, 'ignoreFirstPlay:', ignoreFirstPlay);
        
        setIsLoading(false);
        setHasPlayed(true);
        trackEvent('video', 'play', title);
        
        // Als ignoreFirstPlay aan staat EN dit is de eerste play, negeer dan
        if (ignoreFirstPlay && firstPlayEventRef.current) {
          console.log('Ignoring first play event (autoplay)');
          firstPlayEventRef.current = false;
          return;
        }
        
        // Anders, roep onPlay aan
        if (onPlay) {
          console.log('Calling onPlay callback - user play');
          onPlay();
        }
        firstPlayEventRef.current = false;
      } else if (event.data.includes('pause')) {
        console.log('Video paused detected:', title);
        trackEvent('video', 'pause', title);
        onPause?.();
      } else if (event.data.includes('ended')) {
        trackEvent('video', 'ended', title);
        onEnded?.();
      } else if (event.data.includes('error')) {
        console.error('Video error message:', event.data);
        setHasError(true);
        setIsLoading(false);
        trackEvent('video', 'error', `${title}: ${event.data}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [title, onPlay, onPause, onEnded, isThumbnail]);

  if (isThumbnail) {
    // Toon alleen de thumbnail als deze in beeld is
    if (!isInView) {
        return <div ref={slideRef} className={cn('flex-none w-32 md:w-40 h-20 md:h-24 rounded-lg', cc.loading.skeleton)} aria-hidden="true"></div>;
    }
    return (
      <div ref={slideRef} className="p-1">
        {isInView && (
          <button
            onClick={onClick}
            className={cn(
              'flex-none w-32 md:w-40 h-20 md:h-24 rounded-lg overflow-hidden',
              'transition-all duration-300 ease-out',
              'focus:outline-none',
              colors.primary.focusRing,
              'relative touch-manipulation',
              isSelected
                ? cn(
                    'ring-4 ring-primary shadow-2xl scale-105',
                    'opacity-100'
                  )
                : cn(
                    'ring-2 ring-gray-300/50 hover:ring-gray-400',
                    'opacity-80 hover:opacity-100',
                    'shadow-md hover:shadow-xl',
                    'hover:scale-102 active:scale-100'
                  )
            )}
            aria-label={`Selecteer video: ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={`Thumbnail voor ${title}`}
              className={cn(
                'w-full h-full object-cover',
                'transition-transform duration-300'
              )}
              loading="lazy"
              onError={() => setHasError(true)}
            />
            {!hasError && !isSelected && (
              <div className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/30 to-transparent',
                cc.transition.colors
              )} />
            )}
            {!hasError && isSelected && (
              <div className="absolute inset-0 bg-primary/10" />
            )}
            {hasError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-600 font-medium">Geen preview</span>
              </div>
            )}
          </button>
        )}
      </div>
    );
  }

  if (!safeVideoUrl) {
    return (
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className={cn(
            'absolute inset-0 rounded-2xl overflow-hidden',
            cc.shadow.xl,
            'bg-gradient-to-br from-gray-100 to-gray-200',
            cc.flex.center
          )}>
            <div className="text-center text-gray-600 p-8">
              <p className={cn(cc.text.h5, 'mb-2')}>Video URL is ongeldig</p>
              <p className={cc.text.bodySmall}>Controleer of de URL correct is</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render de container, maar de iframe pas als shouldLoadIframe true is
  return (
    <div ref={slideRef} className="w-full max-w-[1280px] mx-auto p-1">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div
          className={cn(
            'absolute inset-0 rounded-2xl overflow-hidden',
            cc.shadow.xl,
            'bg-gradient-to-br from-gray-900 to-black',
            'ring-1 ring-gray-800/50'
          )}
          onClick={() => {
            console.log('🖱️ Container clicked');
            firstPlayEventRef.current = false;
          }}
        >
          {/* Thumbnail en Overlay (zichtbaar als NOG NIET gespeeld heeft of laadt) */}
          {(!hasPlayed || isLoading) && (
            <>
              <div 
                className={cn(
                  'absolute inset-0 bg-cover bg-center z-10',
                  cc.transition.slow,
                  hasPlayed && 'opacity-0'
                )}
                style={{ backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined }}
              />
              <div className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20',
                cc.transition.slow,
                hasPlayed && 'opacity-0'
              )} /> 
            </>
          )}

          {/* Loading indicator - Elegant spinner met backdrop */}
          {isLoading && (
             <div className={cn(
               'absolute inset-0 z-30',
               cc.flex.center,
               'bg-black/40 backdrop-blur-sm',
               animations.fadeIn
             )}>
               <div className="relative">
                 <div className={cn(
                   cc.loading.spinner,
                   'w-16 h-16 border-4'
                 )} />
                 <div className={cn(
                   'absolute inset-0',
                   'bg-primary/20 rounded-full blur-xl',
                   animations.pulse
                 )} />
               </div>
             </div>
          )}

          {/* Error state - Professionele error display */}
          {hasError && (
             <div className={cn(
               'absolute inset-0 z-30',
               cc.flex.center,
               'bg-gradient-to-br from-red-900/90 to-gray-900/90 backdrop-blur-sm',
               animations.fadeIn
             )}>
               <div className="text-center text-white p-8 max-w-md">
                 <div className={cn(
                   'w-16 h-16 mx-auto mb-4 rounded-full',
                   'bg-red-500/20 border-2 border-red-500/50',
                   cc.flex.center
                 )}>
                   <span className="text-3xl">⚠️</span>
                 </div>
                 <p className={cn(cc.text.h5, 'mb-3')}>Video kon niet worden geladen</p>
                 <p className={cn(cc.text.bodySmall, 'mb-6 text-gray-300')}>
                   Er is een probleem opgetreden bij het laden van de video
                 </p>
                 <button
                   onClick={() => {
                     setIsLoading(true);
                     setHasError(false);
                     setHasPlayed(false);
                   }}
                   className={cn(
                     cc.button.primary,
                     'px-6 py-3',
                     cc.shadow.lg,
                     'hover:shadow-xl'
                   )}
                 >
                   Opnieuw proberen
                 </button>
               </div>
             </div>
          )}

          {/* Video iframe */}
          {!isThumbnail && (
            <>
              <iframe
                ref={iframeRef}
                src={safeVideoUrl}
                className={cn(
                  'absolute inset-0 w-full h-full z-10',
                  cc.transition.slow,
                  hasPlayed ? 'opacity-100' : 'opacity-0'
                )}
                title={title}
                allow="autoplay; fullscreen"
                frameBorder="0"
                scrolling="no"
                onLoad={() => {
                }}
                onError={() => {
                  console.error('Iframe onError triggered:', safeVideoUrl);
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
              {/* Click overlay om user interactie te detecteren */}
              {!hasPlayed && (
                <div
                  className="absolute inset-0 z-25 cursor-pointer"
                  onClick={() => {
                    console.log('🎯 User clicked on video');
                    firstPlayEventRef.current = false; // Mark as user interaction
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

VideoSlide.displayName = 'VideoSlide';

export default VideoSlide;