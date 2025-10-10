import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors } from '@/styles/shared';

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
        className="font-semibold text-gray-800 mb-2"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Aantal Huidige Deelnemers:
      </h3>
      <p
        className={`text-4xl font-bold ${
          !count && count !== 0 ? 'text-gray-400' : colors.primary.text
        }`}
      >
        {count !== null && count !== undefined ? count : '--'}
      </p>
    </motion.div>
  );
});

ParticipantCounter.displayName = 'ParticipantCounter';

export default ParticipantCounter;