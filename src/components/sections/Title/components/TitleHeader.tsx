import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cc, cn } from '@/styles/shared';

interface TitleHeaderProps {
  title: string;
  subtitle: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = memo(({ title, subtitle }) => {
  return (
    <motion.div
      className="space-y-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h1
        id="title-section-heading"
        className={cn(
          'font-heading font-bold leading-none tracking-tight',
          'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
          'text-primary'
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          'font-body leading-relaxed',
          'text-base sm:text-lg md:text-xl lg:text-2xl',
          'text-gray-800 max-w-2xl mx-auto'
        )}
      >
        {subtitle}
      </p>
    </motion.div>
  );
});

TitleHeader.displayName = 'TitleHeader';

export default TitleHeader;