import React from 'react';
import { CircularProgress } from '@mui/material';
import { cc, cn, colors, animations } from '@/styles/shared';

interface LoadingScreenProps {
  title?: string;
  message?: string;
  color?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'De Koninklijke Loop',
  message = 'Laden...',
  color = colors.primary.bg,
  size = 60,
}) => {
  const pulseClass = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? ''
    : animations.pulse;

  return (
    <div
      className={cn('fixed inset-0 bg-white', cc.zIndex.modal, cc.flex.center)}
      role="status"
      aria-live="polite"
    >
      <section className="text-center">
        <CircularProgress
          className={cn(cc.loading.spinner)}
          sx={{ color, width: `${size}px !important`, height: `${size}px !important` }}
          aria-label={message}
        />
        <div className={cn('mt-4', cc.typography.heading)}>
          <h2 className={cn(cc.text.h3, colors.primary.text, pulseClass)}>
            {title}
          </h2>
          <p className={cn(cc.text.body, cc.text.muted, 'mt-2')}>
            {message}
          </p>
        </div>
      </section>
    </div>
  );
};

export default React.memo(LoadingScreen);