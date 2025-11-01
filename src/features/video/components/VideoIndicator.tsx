import React, { memo, useCallback, useMemo } from 'react'
import { cc, cn, colors } from '@/styles/shared'
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking'

interface DotIndicatorProps {
  total: number;
  current: number;
  onClick: (index: number) => void;
  className?: string;
}

const DotIndicator: React.FC<DotIndicatorProps> = memo(({
  total,
  current,
  onClick,
  className = ''
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('DotIndicator');

  // Memoize the click handler to prevent recreation
  const handleClick = useCallback((index: number) => {
    trackInteraction('indicator_click', `slide_${index + 1}`);
    onClick(index);
  }, [onClick, trackInteraction]);

  // Memoize the array to prevent recreation on every render
  const indicators = useMemo(() =>
    Array.from({ length: total }, (_, index) => index),
    [total]
  );

  return (
    <div className={cn(cc.flex.center, 'gap-3', className)} role="tablist" aria-label="Video slides">
      {indicators.map((index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          role="tab"
          aria-selected={index === current}
          aria-label={`Ga naar slide ${index + 1}`}
          className={cn(
            'transition-all duration-300 ease-out',
            cc.border.circle,
            cc.a11y.focusVisible,
            'hover:scale-110 active:scale-95',
            index === current 
              ? cn(
                  colors.primary.bg,
                  'w-10 h-3 shadow-md',
                  'ring-2 ring-primary/30'
                )
              : cn(
                  'bg-gray-400 hover:bg-gray-500',
                  'w-3 h-3',
                  'shadow-sm hover:shadow-md'
                )
          )}
        />
      ))}
    </div>
  );
});

DotIndicator.displayName = 'DotIndicator';

export default DotIndicator