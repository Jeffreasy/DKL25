import React, { useState } from 'react'

interface VideoSlideProps {
  url: string
  title: string
  isActive: boolean
  onLoad: () => void
}

const VideoSlide: React.FC<VideoSlideProps> = ({ url, title, isActive, onLoad }) => {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex-shrink-0 w-full">
        <div className="relative w-full pt-[56.25%] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Video kon niet worden geladen</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 w-full">
      <div className="relative w-full pt-[56.25%] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {isActive && (
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="fullscreen"
            loading="lazy"
            title={title}
            onLoad={onLoad}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  )
}

export default VideoSlide 