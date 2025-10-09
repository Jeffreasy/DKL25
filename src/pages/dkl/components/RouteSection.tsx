import React from 'react';
import { ContentItem } from './ContentItem';
import { contentItems } from './route.data';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors, animations } from '@/styles/shared';

const RouteSection: React.FC = () => {
  React.useEffect(() => {
    trackEvent('dkl', 'section_view', 'route_section');
  }, []);

  return (
    <div className={cn('w-full bg-white text-gray-800 antialiased', cc.typography.body)}>
      {/* Header Sectie */}
      <div className="relative py-20 px-6 text-center overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className={cn(
            'material-icons-round text-8xl md:text-9xl mb-6 inline-block cursor-default',
            colors.primary.text,
            animations.float,
            'hover:scale-110',
            cc.transition.transform
          )}>
            directions_walk
          </span>
          <h1 className={cn(cc.text.h1, 'font-bold text-gray-900 leading-tight', cc.typography.heading)}>
            De Loop over
            <br />
            De Koninklijke Weg
          </h1>
        </div>
        {/* Decoratieve elementen */}
        <div className={cn('absolute inset-0 bg-gradient-radial from-primary/10 to-transparent', animations.spinSlow)} />
        <div className={cn('absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent', animations.spinSlow)} style={{ animationDelay: '-5s' }} />
        <div className={cn('absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent', animations.spinSlow)} style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className={cn(cc.text.h5, 'text-center font-light leading-relaxed mb-16 max-w-4xl mx-auto', cc.text.muted)}>
          Op zaterdag 17 mei 2025, tijdens de Koninklijke Loop (DKL), wandelen we over een speciaal, toegankelijk wandelpad: het laatste stukje van de historische Koninklijke Weg.
          Hoewel de volledige Koninklijke Weg 170 km lang is (van Paleis Noordeinde naar Paleis Het Loo), focust de DKL zich op het prachtige deel van Kootwijk naar Apeldoorn, met afstanden van 2.5, 6, 10 en 15 km. We finishen feestelijk bij de Grote Kerk in Apeldoorn.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contentItems.map((item, index) => (
            <ContentItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSection; 