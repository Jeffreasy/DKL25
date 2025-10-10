import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { motion } from 'framer-motion';

interface RadioPlayerProps {
  audioUrl: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  date?: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = memo(({
  audioUrl,
  title,
  description,
  thumbnailUrl,
  date
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('RadioPlayer');

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Memoized waveform bars to prevent recreation on every render
  const waveformBars = useMemo(() =>
    [...Array(50)].map((_, i) => {
      const height = 30 + Math.random() * 70;
      return (
        <div
          key={i}
          className="flex-1 mx-px bg-orange-400 opacity-60"
          style={{
            height: `${height}%`,
            transition: 'height 0.2s ease'
          }}
        />
      );
    }), []
  );

  // Optimized format time function with useCallback
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Optimized event handlers
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      trackInteraction('pause', title);
    } else {
      audio.play().catch(error => {
        console.error('Audio playback error:', error);
        setHasError(true);
        trackInteraction('error', `${title}: ${error.message}`);
      });
      trackInteraction('play', title);
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying, title, trackInteraction]);

  // Update progress bar as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      trackEvent('media_player', 'ended', title);
    };
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setHasError(true);
      setIsLoading(false);
      trackEvent('media_player', 'error', `${title}: Load error`);
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set initial volume
    audio.volume = volume;
    
    // Clean up event listeners on unmount
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [title, volume]);

  // Optimized event handlers
  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;

    if (!audio || !progressBar) return;

    // Calculate click position relative to progress bar
    const rect = progressBar.getBoundingClientRect();
    const clickPositionRatio = (e.clientX - rect.left) / rect.width;
    const newTime = clickPositionRatio * duration;

    // Update audio time
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    trackInteraction('seek', `${title}: ${formatTime(newTime)}`);
  }, [duration, title, formatTime, trackInteraction]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    trackInteraction('volume_change', `${title}: ${Math.round(newVolume * 100)}%`);
  }, [title, trackInteraction]);

  const handleRetry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasError(false);
    setIsLoading(true);

    // Force reload of audio source
    audio.load();
    trackInteraction('retry', title);
  }, [title, trackInteraction]);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full border border-orange-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        {/* Thumbnail/Waveform side - Adjusted height */}
        <div className="w-full bg-gray-100 relative h-[180px] overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={`Thumbnail afbeelding voor radio-opname: ${title}`}
              className="w-full h-full object-cover object-center"
              onError={() => console.error('Thumbnail kon niet worden geladen')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-200">
              <div className="w-4/5 h-24 relative">
                {/* Audio visualization */}
                <div className="absolute inset-0 flex items-center">
                  {waveformBars}
                </div>
              </div>
            </div>
          )}
          
          {/* Date badge if provided */}
          {date && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow">
              {date}
            </div>
          )}
        </div>
        
        {/* Player controls side - Adjusted padding and text sizes */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans line-clamp-2" style={{fontFamily: "'Montserrat', sans-serif"}}>
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 mb-4 font-sans line-clamp-2" style={{fontFamily: "'Open Sans', sans-serif"}}>
                {description}
              </p>
            )}
          </div>
          
          {/* Audio player controls */}
          <div className="space-y-3">
            {/* Progress bar */}
            <div 
              ref={progressBarRef}
              className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleProgressBarClick}
            >
              <div 
                className="absolute h-full bg-primary rounded-full"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            
            {/* Time display */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{isLoading ? '--:--' : formatTime(duration)}</span>
            </div>
            
            {/* Play controls and volume */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Play/Pause button */}
                <button
                  onClick={togglePlayPause}
                  disabled={isLoading || hasError}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary-dark transition-colors text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                {/* Volume control */}
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={audioUrl}
        preload="metadata"
        className="hidden"
      />
    </motion.div>
  );
});

RadioPlayer.displayName = 'RadioPlayer';

export default RadioPlayer;