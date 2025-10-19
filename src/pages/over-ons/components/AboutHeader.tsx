import React, { memo } from 'react';
import { cc, cn, colors } from '@/styles/shared';

const AboutHeader: React.FC = memo(() => {
  return (
    <header className="text-center max-w-4xl mx-auto">
      <h1 id="about-heading" className={cn(cc.text.h1, cc.typography.heading, 'text-gray-900 mb-6')}>
        <span className={cn('material-icons-round align-middle mr-2 text-4xl md:text-5xl', colors.primary.text)} aria-hidden="true">
          groups
        </span>
        Over DKL - De Koninklijke Loop
      </h1>
      <p className={cn(cc.typography.lead, cc.text.muted)}>
        De Koninklijke Loop wordt georganiseerd door een groep mensen die elkaar allemaal door het werken en leven in zorginstellingen hebben ontmoet.
      </p>
    </header>
  );
});

AboutHeader.displayName = 'AboutHeader';

export default AboutHeader;