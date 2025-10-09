import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { cc, cn, colors, animations } from '@/styles/shared';

interface ScrollToTopButtonProps {
  scrollThreshold?: number;
  size?: 'small' | 'medium' | 'large';
  position?: { bottom: string; right: string };
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  scrollThreshold = 300,
  size = 'medium',
  position = { bottom: '4rem', right: '1rem' },
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = throttle(() => {
      setIsVisible(window.scrollY > scrollThreshold);
    }, 100);

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const animationClass = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : animations.fadeIn;
  const hoverStyles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'hover:-translate-y-1 hover:shadow-xl';

  const sizeStyles = {
    small: { padding: 'p-2', fontSize: { xs: 20, sm: 24 } },
    medium: { padding: 'p-3', fontSize: { xs: 24, sm: 28 } },
    large: { padding: 'p-4', fontSize: { xs: 28, sm: 32 } },
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          role="button"
          title="Terug naar boven"
          aria-label="Scroll naar boven"
          style={{
            bottom: position.bottom,
            right: position.right,
          }}
          className={cn(
            'fixed',
            sizeStyles[size].padding,
            cc.zIndex.fixed,
            colors.primary.bg,
            colors.primary.hover,
            'text-white',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            hoverStyles,
            animationClass,
            colors.primary.focusRing
          )}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: sizeStyles[size].fontSize }} />
        </button>
      )}
    </>
  );
};

export default React.memo(ScrollToTopButton);