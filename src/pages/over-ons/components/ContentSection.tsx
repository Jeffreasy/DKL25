import React, { memo } from 'react';
import { cc, cn, colors } from '@/styles/shared';

interface ContentSectionProps {
  icon: string;
  title: string;
  content: string[];
  isThankYou?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = memo(({ icon, title, content, isThankYou }) => {
  return (
    <article
      className={cn(
        'bg-white p-8 rounded-xl border border-gray-100 group cursor-default',
        cc.transition.base,
        'hover:-translate-y-1 hover:shadow-xl hover:border-primary'
      )}
      tabIndex={0}
      aria-labelledby={`about-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <h2 id={`about-${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-3 mb-6 relative pb-3">
        <i
          className={cn('material-icons-round text-2xl', colors.primary.text, cc.transition.transform, 'group-hover:-translate-y-1')}
          aria-hidden="true"
        >
          {icon}
        </i>
        <div className="flex flex-col">
          <span className={cn('material-icons-round text-[14px] font-light mb-1', 'text-primary/60')} aria-hidden="true">
            {icon}
          </span>
          <span className={cn(cc.text.h3, 'tracking-tight text-gray-900', cc.typography.heading)}>
            {title}
          </span>
        </div>
        <div className={cn('absolute bottom-0 left-0 w-12 h-0.5 bg-primary/20', cc.transition.base, 'group-hover:w-24 group-hover:bg-primary')} />
      </h2>
      <div className="space-y-4">
        {content.map((paragraph, index) => (
          isThankYou && index === content.length - 1 ? (
            <p key={index} className={cn('text-center text-gray-900 mt-6 p-4 bg-primary/10 rounded-lg')}>
              <i className={cn('material-icons-round align-middle mr-1', colors.primary.text)} aria-hidden="true">
                favorite
              </i>
              <span>{paragraph}</span>
            </p>
          ) : (
            <p key={index} className={cn(cc.text.muted)}>
              {paragraph}
            </p>
          )
        ))}
      </div>
    </article>
  );
});

ContentSection.displayName = 'ContentSection';

export default ContentSection;