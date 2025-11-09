import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { usePublicStepsCounter } from '@/services/websocket/usePublicStepsCounter';
import { cc, cn, colors } from '@/styles/shared';

const StepsCounter: React.FC = memo(() => {
  const { totalSteps, isConnected } = usePublicStepsCounter();

  return (
    <motion.div
      className="mt-6 mb-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h3
        className={cn(
          'font-heading font-medium leading-snug',
          'text-lg sm:text-xl md:text-2xl lg:text-3xl',
          'text-gray-800 mb-2'
        )}
      >
        Totale Stappen Gelopen:
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p
          className={cn(
            'font-heading font-bold leading-none tracking-tight',
            'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
            colors.primary.text
          )}
        >
          {totalSteps.toLocaleString('nl-NL')}
        </p>
        {isConnected && (
          <motion.div
            className="flex items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="ml-2 text-sm text-green-600 font-medium">Live</span>
          </motion.div>
        )}
      </div>
      <p className={cn('text-sm text-gray-600 mt-2', cc.typography.body)}>
        Voor het goede doel • Bijgewerkt in real-time
      </p>
    </motion.div>
  );
});

StepsCounter.displayName = 'StepsCounter';

export default StepsCounter;