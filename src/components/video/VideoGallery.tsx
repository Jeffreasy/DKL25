import React from 'react'
import VideoSlide from './VideoSlide'
import NavigationButton from './NavigationButton'
import DotIndicator from './DotIndicator'
import { videos } from './data'
import { useVideoGallery } from '@/hooks/useVideoGallery'

const VideoGallery: React.FC = () => {
  const {
    currentIndex,
    isLoading,
    setIsLoading,
    handlePrevious,
    handleNext,
    setCurrentIndex
  } = useVideoGallery(videos)

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-5 bg-gradient-to-b from-white to-gray-50 font-['Roboto_Slab'] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/3 to-transparent blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/2 to-transparent blur-[80px] animate-float" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
          <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] text-gray-900 font-bold mb-3 sm:mb-4 tracking-tight">
            Bekijk onze video's
          </h2>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 max-w-[38ch] mx-auto mb-4 sm:mb-6">
            Ontdek meer over De Koninklijke Loop
          </p>
          {/* Animated underline */}
          <div className="relative mx-auto w-16 h-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shine" />
          </div>
        </div>

        {/* Video Section */}
        <div className="relative max-w-[min(90vw,1000px)] mx-auto">
          {/* Video Container */}
          <div className="relative rounded-[20px] shadow-xl bg-white overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {videos.map((video, index) => (
                <VideoSlide
                  key={video.id}
                  url={video.url}
                  title={video.title}
                  isActive={index === currentIndex}
                  onLoad={() => setIsLoading(false)}
                />
              ))}
            </div>

            {/* Navigation Overlay - Nu alleen zichtbaar op grotere schermen */}
            <div className="absolute inset-0 hidden sm:flex items-center justify-between px-4 pointer-events-none">
              <div className="relative z-10 w-full flex items-center justify-between pointer-events-auto">
                <NavigationButton
                  direction="previous"
                  onClick={handlePrevious}
                  disabled={isLoading}
                />
                <NavigationButton
                  direction="next"
                  onClick={handleNext}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Alleen zichtbaar op kleine schermen */}
          <div className="flex sm:hidden justify-center gap-4 mt-4">
            <NavigationButton
              direction="previous"
              onClick={handlePrevious}
              disabled={isLoading}
            />
            <NavigationButton
              direction="next"
              onClick={handleNext}
              disabled={isLoading}
            />
          </div>

          {/* Dots Indicator */}
          <div className="mt-4 sm:mt-6 flex justify-center gap-2" role="tablist">
            {videos.map((_, index) => (
              <DotIndicator
                key={index}
                isActive={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoGallery 