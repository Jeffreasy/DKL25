import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cc, cn, colors } from '@/styles/shared';

interface ParticipantCounterProps {
  count: number | null | undefined;
}

const ParticipantCounter: React.FC<ParticipantCounterProps> = memo(({ count }) => {
  return (
    <motion.div
      className="mt-8 mb-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
    >
      <h3
        className={cn(
          'font-heading font-medium leading-snug',
          'text-lg sm:text-xl md:text-2xl lg:text-3xl',
          'text-gray-800 mb-2'
        )}
      >
        Aantal Huidige Deelnemers:
      </h3>
      <p
        className={cn(
          'font-heading font-bold leading-none tracking-tight',
          'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
          !count && count !== 0 ? 'text-gray-400' : colors.primary.text
        )}
      >
        {count !== null && count !== undefined ? count : '--'}
      </p>
    </motion.div>
  );
});

ParticipantCounter.displayName = 'ParticipantCounter';

export default ParticipantCounter;