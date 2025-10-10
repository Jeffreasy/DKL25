import React, { memo } from 'react';
import { cc, cn, colors } from '@/styles/shared';

const AboutHeader: React.FC = memo(() => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className={cn(cc.text.h1, cc.typography.heading, 'text-gray-900 mb-6')}>
        <span className={cn('material-icons-round align-middle mr-2 text-4xl md:text-5xl', colors.primary.text)}>
          groups
        </span>
        Over Ons
      </h1>
      <p className={cn(cc.typography.lead, cc.text.muted)}>
        De Koninklijke Loop wordt georganiseerd door een groep mensen die elkaar allemaal door het werken en leven in zorginstellingen hebben ontmoet.
      </p>
    </div>
  );
});

AboutHeader.displayName = 'AboutHeader';

export default AboutHeader;