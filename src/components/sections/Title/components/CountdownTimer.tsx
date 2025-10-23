import React, { memo, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cc, cn, colors } from '@/styles/shared';

const TARGET_EVENT_DATE = new Date('2026-05-17T09:00:00');

const calculateTimeLeft = (targetDate: Date): { days: number; hours: number; minutes: number; seconds: number } | null => {
  const difference = +targetDate - +new Date();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownTimer: React.FC = memo(() => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(TARGET_EVENT_DATE));

  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(TARGET_EVENT_DATE);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const countdownDisplay = useMemo(() => {
    if (!timeLeft) {
      return (
        <div className={`text-center ${cc.text.h4} ${colors.primary.text}`}>
          Het evenement is succesvol afgelopen, bedankt en tot volgend jaar!
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 sm:space-x-6 text-center" role="group" aria-label="Tijd tot evenement">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="p-2" role="presentation">
            <div className={cn(cc.typography.display, colors.primary.text)}>
              {String(value).padStart(2, '0')}
            </div>
            <div className={`${cc.text.small} ${cc.typography.uppercase} ${cc.text.muted}`}>
              {unit === 'days' ? 'Dagen' : unit === 'hours' ? 'Uren' : unit === 'minutes' ? 'Minuten' : 'Seconden'}
            </div>
          </div>
        ))}
      </div>
    );
  }, [timeLeft]);

  return (
    <motion.div
      className="mt-10 mb-6 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      role="timer"
      aria-live="off"
      aria-label="Countdown tot DKL 2026"
    >
      {countdownDisplay}
    </motion.div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer;