import React, { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  posterUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
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
        console.log('Video playing successfully');
      } catch (error) {
        console.error('Error playing video:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to play video'));
      }
    };

    playVideo();
  }, [onError]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
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
        <source 
          src="https://res.cloudinary.com/dgfuv7wif/video/upload/v1733928356/ei5kw8_1_yhkklg.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default BackgroundVideo; 