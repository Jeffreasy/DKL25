import React, { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  posterUrl: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ posterUrl }) => {
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
      }
    };

    playVideo();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
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