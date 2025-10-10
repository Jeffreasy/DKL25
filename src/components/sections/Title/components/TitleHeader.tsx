import React, { memo } from 'react';
import { motion } from 'framer-motion';

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
        className="font-bold font-sans leading-tight text-primary"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {title}
      </h1>
      <p
        className="text-gray-800 font-sans leading-relaxed max-w-2xl mx-auto"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
});

TitleHeader.displayName = 'TitleHeader';

export default TitleHeader;