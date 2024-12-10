import React, { useState } from 'react'
import VideoSlide from './VideoSlide'
import NavigationButton from './NavigationButton'
import { videos } from './data'
import type { Video } from './types'

const VideoGallery: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  if (videos.length === 0) return null

  const currentVideo = videos[currentVideoIndex] as Video

  const handlePrevious = () => {
    setCurrentVideoIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentVideoIndex(prev => (prev === videos.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-16 px-5 bg-gray-50 font-heading">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] text-gray-900 font-bold mb-3">
            Onze Video's
          </h2>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600">
            {currentVideo.description}
          </p>
        </div>

        {/* Main Video met navigatie */}
        <div className="relative mb-8 group">
          <VideoSlide
            videoId={currentVideo.videoId}
            url={currentVideo.url}
            title={currentVideo.title}
          />
          
          {/* Navigation Buttons */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <NavigationButton direction="previous" onClick={handlePrevious} />
            <NavigationButton direction="next" onClick={handleNext} />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="relative px-12">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
            {videos.map((video, index) => (
              <VideoSlide
                key={video.id}
                videoId={video.videoId}
                url={video.url}
                title={video.title}
                isThumbnail
                isSelected={index === currentVideoIndex}
                onClick={() => setCurrentVideoIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoGallery 