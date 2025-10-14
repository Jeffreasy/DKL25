import React, { useEffect, useRef } from 'react';
import { cc, cn, colors, animations } from '@/styles/shared';

// Type-safe props
interface BackgroundVideoProps {
  hlsUrl: string; // HLS .m3u8 URL
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  priority?: boolean; // Voor hero-secties: direct laden
  title?: string; // Voor accessibility
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  hlsUrl,
  onPlay,
  onPause,
  onEnded,
  onError,
  priority = false,
  title = 'Achtergrondvideo van de sponsorloop',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer voor lazy loading (niet voor priority)
  useEffect(() => {
    if (priority || !containerRef.current) {
      // Direct laden voor hero
      const video = videoRef.current;
      if (video) {
        video.play().catch((err) => {
          console.warn('[BackgroundVideo] Autoplay failed:', err.message);
          onError?.(new Error(err.message));
        });
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const video = videoRef.current;
          if (video) {
            video.play().catch((err) => {
              console.warn('[BackgroundVideo] Autoplay failed:', err.message);
              onError?.(new Error(err.message));
            });
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority, onError]);

  // Error handler voor debugging
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const errorMessage = (e.target as HTMLVideoElement).error?.message || 'Video afspelen mislukt';
    console.warn('[BackgroundVideo] Error:', errorMessage);
    onError?.(new Error(errorMessage));
    // In dev mode, toon HLS URL
    if (process.env.NODE_ENV === 'development') {
      console.error('[BackgroundVideo] HLS URL:', hlsUrl);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden',
        colors.neutral.gray[900],
        cc.transition.base
      )}
      role="img"
      aria-label={title}
    >
      <video
        ref={videoRef}
        className={cn(
          'w-full h-full object-cover object-center',
          cc.transition.base
        )}
        muted
        loop
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={handleError}
        aria-hidden={true}
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src={hlsUrl} type="application/x-mpegURL" />
      </video>
    </div>
  );
};

BackgroundVideo.displayName = 'BackgroundVideo';

export default React.memo(BackgroundVideo);