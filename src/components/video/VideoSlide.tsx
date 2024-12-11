import React, { useState } from 'react';

interface VideoSlideProps {
  videoId: string;
  url: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  isThumbnail?: boolean;
}

const VideoSlide: React.FC<VideoSlideProps> = ({ 
  videoId, 
  url,
  title,
  isSelected, 
  onClick,
  isThumbnail = false 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Gebruik de juiste Streamable thumbnail URL structuur
  const thumbnailUrl = `https://cdn-cf-east.streamable.com/image/${videoId}.jpg`;

  if (isThumbnail) {
    return (
      <button
        onClick={onClick}
        className={`
          flex-none w-40 h-24 rounded-lg overflow-hidden
          transition-all duration-300
          ${isSelected 
            ? 'ring-2 ring-primary scale-105 shadow-lg opacity-100' 
            : 'ring-1 ring-gray-200 opacity-60 hover:opacity-80'
          }
          relative
        `}
      >
        <img
          src={thumbnailUrl}
          alt={`Thumbnail voor ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
      </button>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg relative">
      {/* Thumbnail als achtergrond */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />
      {/* Overlay voor betere leesbaarheid van de video */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <p className="text-white">Video kon niet worden geladen</p>
        </div>
      )}

      <iframe
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="relative z-10 w-full h-full bg-transparent"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  );
};

export default VideoSlide;