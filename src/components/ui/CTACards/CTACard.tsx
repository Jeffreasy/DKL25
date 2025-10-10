import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import NavIcon from '../../layout/Navbar/NavIcon';
import type { CTACardData } from './types';
import { logEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

type CTACardProps = CTACardData & {
  onClick: () => void;
  index: number;
};

interface CardState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
}

const CTACard: React.FC<CTACardProps> = memo(({
  title,
  description,
  icon,
  buttonText,
  onClick,
  actionType,
  index
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('CTACard');

  const [state, setState] = useState<CardState>({
    isHovered: false,
    isPressed: false,
    isFocused: false
  });

  // Memoized animation variants
  const cardVariants: Variants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    }
  }), [index]);

  // Track card impressions
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            logEvent('impression', 'cta_card_impression', `${title}_${actionType}`);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`cta-card-${index}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [title, actionType, index]);

  const handleClick = useCallback(() => {
    // Track de knop klik specifiek in deze component voor meer gedetailleerde gegevens
    trackInteraction('cta_button_click', `${title}_${buttonText}_${actionType}`);
    onClick();
  }, [trackInteraction, title, buttonText, actionType, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleHoverStart = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
    trackInteraction('cta_card_hover', title);
  }, [trackInteraction, title]);

  const handleHoverEnd = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
  }, []);

  const handleMouseDown = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  return (
    <motion.div
      id={`cta-card-${index}`}
      className={cn(
        cc.card.hover,
        'rounded-3xl p-6 md:p-8 font-heading',
        cc.transition.colors,
        'focus-within:ring-2 focus-within:ring-primary/40',
        state.isFocused && 'ring-2 ring-primary/40'
      )}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      role="article"
      aria-labelledby={`cta-title-${index}`}
    >
      <div className={cn(cc.flex.colCenter, 'text-center space-y-4')}>
        <motion.div
          className={cn(cc.flex.center, 'w-16 h-16 md:w-20 md:h-20 mb-2')}
          animate={{ 
            rotate: state.isHovered ? [0, -5, 5, -5, 0] : 0,
            scale: state.isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <NavIcon
            name={icon}
            className={cn(
              'h-10 w-10 md:h-12 md:w-12 text-primary',
              cc.transition.transform,
              state.isHovered && 'scale-110'
            )}
          />
        </motion.div>
        
        <h3
          id={`cta-title-${index}`}
          className={cn(cc.text.h4, 'text-gray-900')}
        >
          {title}
        </h3>
        
        <p className={cn(cc.text.body, 'text-gray-600')}>
          {description}
        </p>

        <motion.button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            'mt-4 px-6 py-2 md:px-8 md:py-3',
            colors.primary.bg,
            'text-white',
            cc.border.circle,
            colors.primary.hover,
            colors.primary.focusRing,
            cc.transition.base,
            'transform-gpu',
            cc.text.body,
            state.isPressed && 'scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={`${buttonText} - ${description}`}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
});

CTACard.displayName = 'CTACard';

export default CTACard;