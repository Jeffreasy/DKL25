import React, { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  // videoUrl: string; // Vervangen door specifieke formaten
  webmUrl?: string; // Optionele WebM URL
  mp4Url: string;  // MP4 URL (verplicht als fallback)
  posterUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  // videoUrl, 
  webmUrl,
  mp4Url,
  posterUrl,
  onPlay,
  onPause,
  onEnded,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error('Failed to play video'));
      }
    };

    playVideo();
  }, [onError]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* BELANGRIJK: Optimaliseer de videobestanden (compressie, resolutie, formaat) op je CDN (Cloudinary)! */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        preload="metadata"
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={(e) => onError?.(new Error('Video playback error'))}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      >
        {/* Bied WebM aan ALS de prop is meegegeven */}
        {webmUrl && <source src={webmUrl} type="video/webm" />}
        {/* Gebruik de expliciete MP4 URL */}
        <source 
          src={mp4Url}
          type="video/mp4"
        />
        Browser ondersteunt de video tag niet.
      </video>
    </div>
  );
};

export default BackgroundVideo; 