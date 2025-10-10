import { useEffect, useState } from 'react';
import { cn } from '@/styles/shared';

interface CSSConfettiProps {
  duration?: number;
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export const CSSConfetti: React.FC<CSSConfettiProps> = ({
  duration = 3000,
  particleCount = 100,
  colors = ['#ff9328', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'],
  className
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1000,
      duration: 2000 + Math.random() * 2000,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [particleCount, duration, colors]);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="css-confetti-particle"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};