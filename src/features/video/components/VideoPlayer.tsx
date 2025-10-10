import React, { useState, useEffect, useRef, memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { STREAMABLE_THUMB_BASE_URL } from '../constants';
import { cc, cn } from '@/styles/shared';

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
  onEnded
}) => {
  const [isLoading, setIsLoading] = useState(!isThumbnail);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!isThumbnail);
  const [hasPlayed, setHasPlayed] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

      if (event.data.includes('play')) {
        setIsLoading(false);
        setHasPlayed(true);
        trackEvent('video', 'play', title);
        onPlay?.();
      } else if (event.data.includes('pause')) {
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
      <div ref={slideRef}>
        {isInView && (
          <button
            onClick={onClick}
            className={cn(
              'flex-none w-32 md:w-40 h-20 md:h-24 rounded-lg overflow-hidden',
              cc.transition.base,
              'focus:outline-none focus:ring-2 focus:ring-primary',
              isSelected
                ? 'ring-2 ring-primary scale-105 shadow-lg opacity-100'
                : 'ring-1 ring-gray-200 opacity-60 hover:opacity-80',
              'relative touch-manipulation'
            )}
            aria-label={`Selecteer video: ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={`Thumbnail voor ${title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setHasError(true)}
            />
            {!hasError && (
              <div className={cn('absolute inset-0 bg-black/20 hover:bg-black/0', cc.transition.colors)} />
            )}
            {hasError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">Geen preview</span>
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
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="mb-2">Video URL is ongeldig</p>
              <p className="text-sm">Controleer of de URL correct is</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render de container, maar de iframe pas als shouldLoadIframe true is
  return (
    <div ref={slideRef} className="w-full max-w-[1280px] mx-auto">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-black">
          {/* Thumbnail en Overlay (zichtbaar als NOG NIET gespeeld heeft of laadt) */}
          {(!hasPlayed || isLoading) && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center z-10"
                style={{ backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined }}
              />
              <div className="absolute inset-0 bg-black/30 z-20" /> 
            </>
          )}

          {/* Loading indicator (zichtbaar als NOG NIET gespeeld heeft of laadt) */}
          {isLoading && (
             <div className={cn(cc.loading.overlay, 'bg-black/50 z-30')}>
               <div className={cn(cc.loading.spinner, 'w-12 h-12')} />
             </div>
          )}

          {/* Error state */}
          {hasError && (
             <div className={cn(cc.loading.overlay, 'bg-black/50 z-30')}>
               <div className="text-center text-white">
                 <p className="mb-2">Video kon niet worden geladen</p>
                 <button
                   onClick={() => {
                     setIsLoading(true);
                     setHasError(false);
                     setHasPlayed(false);
                   }}
                   className={cn(cc.button.primary, 'px-4 py-2')}
                 >
                   Opnieuw proberen
                 </button>
               </div>
             </div>
          )}

          {/* Video iframe */}
          {!isThumbnail && (
            <iframe
              ref={iframeRef}
              src={safeVideoUrl}
              className={cn('absolute inset-0 w-full h-full', cc.transition.slow, hasPlayed ? 'opacity-100' : 'opacity-0')}
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
          )}
        </div>
      </div>
    </div>
  );
});

VideoSlide.displayName = 'VideoSlide';

export default VideoSlide;