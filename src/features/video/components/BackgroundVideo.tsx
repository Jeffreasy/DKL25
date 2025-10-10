import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { cc, cn } from '@/styles/shared';

interface BackgroundVideoProps {
  webmUrl?: string; // Optionele WebM URL voor betere compressie
  mp4Url: string;   // MP4 URL (verplicht als fallback)
  posterUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  priority?: boolean; // Voor hero secties die direct moeten laden
  title?: string; // Voor accessibility
  description?: string; // Voor screen readers
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = memo(({
  webmUrl,
  mp4Url,
  posterUrl,
  onPlay,
  onPause,
  onEnded,
  onError,
  priority = false,
  title,
  description
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority); // Start direct als priority
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  // Intersection Observer voor lazy loading (alleen als niet priority)
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Video playback management
  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isInView || hasError) return;

    try {
      // Check if autoplay is allowed (browsers block autoplay without user interaction)
      const playPromise = video.play();

      if (playPromise !== undefined) {
        await playPromise;
        setCanPlay(true);
        onPlay?.();
      }
    } catch (error) {
      // Autoplay blocked - wait for user interaction or show poster
      console.warn('Video autoplay blocked:', error);
      setCanPlay(false);

      // Try to play on first user interaction
      const handleUserInteraction = () => {
        attemptPlay();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
    }
  }, [isInView, hasError, onPlay]);

  // Initialize video when in view
  useEffect(() => {
    if (isInView && !hasError) {
      attemptPlay();
    }
  }, [isInView, attemptPlay, hasError]);

  // Event handlers
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    setCanPlay(true);
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = (e.target as HTMLVideoElement).error;
    const errorMessage = error?.message || 'Video playback failed';
    console.error('Background video error:', errorMessage);
    setHasError(true);
    setIsLoading(false);
    onError?.(new Error(errorMessage));
  }, [onError]);

  const handlePlay = useCallback(() => {
    setCanPlay(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  // Cleanup
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden bg-gray-900',
        cc.transition.base
      )}
      role="img"
      aria-label={title || "Background video"}
      aria-describedby={description ? "video-description" : undefined}
    >
      {/* Hidden description for screen readers */}
      {description && (
        <div id="video-description" className="sr-only">
          {description}
        </div>
      )}
      {/* Loading state */}
      {isLoading && isInView && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-gray-900',
          cc.transition.base
        )}>
          <div className={cn('w-8 h-8 border-2 border-white/20 border-t-white', cc.border.circle, 'animate-spin')} />
        </div>
      )}

      {/* Error state - show poster image */}
      {hasError && (
        <div className="absolute inset-0">
          <img
            src={posterUrl}
            alt="Background"
            className="w-full h-full object-cover object-center"
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Video element - only render when in view */}
      {isInView && !hasError && (
        <video
          ref={videoRef}
          className={cn(
            'w-full h-full object-cover object-center',
            cc.transition.base,
            // Fade in when video is ready
            canPlay ? 'opacity-100' : 'opacity-0'
          )}
          muted
          loop
          playsInline
          poster={posterUrl}
          preload={priority ? 'auto' : 'metadata'}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          // Disable autoplay attribute - we handle it manually
          autoPlay={false}
          // Accessibility
          aria-hidden="true" // Screen readers don't need background video
          tabIndex={-1} // Not focusable
          // Performance optimizations
          disablePictureInPicture
          disableRemotePlayback
          // Quality adaptation based on device/connection
          style={{
            // Reduce quality on slower devices
            imageRendering: navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4 ? 'pixelated' : 'auto'
          }}
        >
          {/* WebM for better compression (if provided) */}
          {webmUrl && (
            <source
              src={webmUrl}
              type="video/webm"
              media="(min-width: 768px)" // Only load WebM on larger screens
            />
          )}
          {/* MP4 fallback */}
          <source src={mp4Url} type="video/mp4" />

          {/* Fallback content */}
          <img
            src={posterUrl}
            alt="Background video fallback"
            className="w-full h-full object-cover object-center"
          />
        </video>
      )}

      {/* Poster as fallback when video not in view */}
      {!isInView && !hasError && (
        <img
          src={posterUrl}
          alt="Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      )}
    </div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo; 