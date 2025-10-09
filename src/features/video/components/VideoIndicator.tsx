import React, { memo } from 'react'

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
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === current ? 'bg-primary w-4' : 'bg-gray-300'
          }`}
          aria-label={`Ga naar slide ${index + 1}`}
        />
      ))}
    </div>
  );
});

DotIndicator.displayName = 'DotIndicator';

export default DotIndicator 