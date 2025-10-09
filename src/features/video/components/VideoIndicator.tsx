import React, { memo } from 'react'
import { cc, cn, colors } from '@/styles/shared'

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
  const handleClick = (index: number) => {
    onClick(index);
  };

  return (
    <div className={cn(cc.flex.center, 'gap-2', className)}>
      {Array.from({ length: total }).map((_, index) => (
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