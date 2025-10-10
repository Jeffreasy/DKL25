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
    <div className={cn(cc.flex.center, 'gap-2', className)}>
      {indicators.map((index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={cn(
            'w-2 h-2',
            cc.border.circle,
            cc.transition.base,
            index === current ? cn(colors.primary.bg, 'w-4') : 'bg-gray-300'
          )}
          aria-label={`Ga naar slide ${index + 1}`}
        />
      ))}
    </div>
  );
});

DotIndicator.displayName = 'DotIndicator';

export default DotIndicator 