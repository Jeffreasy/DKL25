import React from 'react';
import { trackEvent } from '@/utils/googleAnalytics';

interface ContentItemProps {
  icon: string;
  title: string;
  text: string;
  illustration?: {
    src: string;
    caption: string;
  };
  mapUrl?: string;
}

export const ContentItem: React.FC<ContentItemProps> = ({
  icon,
  title,
  text,
  illustration,
  mapUrl
}) => {
  const handleMapClick = () => {
    trackEvent('dkl', 'map_view', title);
  };

  const handleIllustrationView = () => {
    trackEvent('dkl', 'illustration_view', `${title} - ${illustration?.caption}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
      {/* Decorative circle */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full transition-transform duration-300 group-hover:scale-110" />
      
      {/* Content */}
      <div className="relative z-10">
        <span className="material-icons-round text-4xl text-primary mb-4 block">
          {icon}
        </span>
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          {text}
        </p>
        
        {illustration && (
          <div className="text-center my-8">
            <div 
              className="relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              onClick={handleIllustrationView}
            >
              <img
                src={illustration.src}
                alt={`Tekening: ${illustration.caption}`}
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 italic">
              Tekening: {illustration.caption}
            </p>
          </div>
        )}
        
        {mapUrl && (
          <div className="mt-6 rounded-xl overflow-hidden shadow-lg" onClick={handleMapClick}>
            <iframe 
              src={mapUrl}
              className="w-full h-[500px] border-0"
              scrolling="no"
              title="Route kaart"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 