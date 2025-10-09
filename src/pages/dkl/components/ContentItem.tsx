import React from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors, animations } from '@/styles/shared';

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
    <div className={cn(
      'bg-white rounded-xl p-6 border border-gray-100 relative overflow-hidden group',
      cc.shadow.lg,
      cc.transition.base,
      'hover:shadow-xl hover:-translate-y-1'
    )}>
      {/* Decorative circle */}
      <div className={cn('absolute -top-20 -right-20 w-40 h-40 bg-primary/10', cc.border.circle, cc.transition.base, 'group-hover:scale-110')} />
      
      {/* Content */}
      <div className="relative z-10">
        <span className={cn('material-icons-round text-4xl mb-4 block', colors.primary.text)}>
          {icon}
        </span>
        <h2 className={cn(cc.text.h3, cc.typography.heading, 'font-semibold text-gray-900 mb-4')}>
          {title}
        </h2>
        <p className={cn(cc.text.body, cc.text.muted, 'leading-relaxed mb-6')}>
          {text}
        </p>
        
        {illustration && (
          <div className="text-center my-8">
            <div 
              className={cn('relative overflow-hidden rounded-xl', cc.transition.base, 'hover:scale-[1.02]')}
              onClick={handleIllustrationView}
            >
              <img
                src={illustration.src}
                alt={`Tekening: ${illustration.caption}`}
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            <p className={cn('mt-2 italic', cc.text.small, 'text-gray-500')}>
              Tekening: {illustration.caption}
            </p>
          </div>
        )}
        
        {mapUrl && (
          <div className={cn('mt-6 rounded-xl overflow-hidden', cc.shadow.lg)} onClick={handleMapClick}>
            <iframe 
              src={mapUrl}
              className="w-full h-[500px] border-0"
              scrolling="no"
              title="Route kaart"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 