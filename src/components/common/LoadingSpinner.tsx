import { HTMLAttributes, memo, useMemo } from 'react';
import { cc, cn } from '@/styles/shared';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

interface LoadingSpinnerProps {
  className?: HTMLAttributes<HTMLElement>['className'];
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  className = '',
  size = 24,
  color = 'currentColor'
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('LoadingSpinner');

  // Memoize SVG style to prevent recreation
  const svgStyle = useMemo(() => ({ color }), [color]);

  // Track spinner usage
  useMemo(() => {
    trackInteraction('render', `size_${size}_color_${color}`);
  }, [trackInteraction, size, color]);
  return (
    <svg
      className={cn(cc.loading.spinner, 'inline-block', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={svgStyle}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;