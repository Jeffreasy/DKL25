import React, { useState, useMemo, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import CalendarToday from '@mui/icons-material/CalendarToday';
import People from '@mui/icons-material/People';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { EventDetail } from '../functions/types';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn } from '@/styles/shared';

// Icon components map - using component references instead of JSX
const IconComponents = {
  calendar: CalendarToday,
  users: People,
  medal: EmojiEvents
} as const;

const iconSxProps = { fontSize: 40 };

interface EventDetailCardProps extends EventDetail {
  onClick?: () => void;
  isClickable?: boolean;
  index?: number;
}

interface CardState {
  isHovered: boolean;
  isFocused: boolean;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({
  icon,
  title,
  description,
  onClick,
  isClickable = false,
  index = 0
}) => {
  const [state, setState] = useState<CardState>({
    isHovered: false,
    isFocused: false
  });

  // Memoized animation variants
  const cardVariants = useMemo<Variants>(() => ({
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
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }), [index]);

  const iconVariants = useMemo<Variants>(() => ({
    initial: {
      rotate: 0,
      scale: 1
    },
    hover: {
      rotate: [0, -5, 5, -5, 0],
      scale: 1.1,
      transition: {
        duration: 0.5
      }
    }
  }), []);

  const handleClick = useCallback(() => {
    if (onClick) {
      trackEvent('event_details', 'detail_click', title);
      onClick();
    }
  }, [onClick, title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }, [isClickable, handleClick]);

  const handleHoverStart = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
  }, []);

  const handleHoverEnd = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
  }, []);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  // Get the icon component
  const IconComponent = IconComponents[icon as keyof typeof IconComponents];

  if (!IconComponent) {
    console.warn(`Unknown icon type: ${icon}`);
    return null;
  }

  return (
    <motion.div
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable ? 0 : undefined}
      className={`
        bg-white p-6 rounded-lg shadow-md
        transition-shadow duration-300
        ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}
        ${state.isFocused ? 'ring-2 ring-primary/40' : ''}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isClickable ? "hover" : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={`${title}: ${description}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <motion.div
          className="text-primary mb-2"
          variants={iconVariants}
          initial="initial"
          animate={state.isHovered ? "hover" : "initial"}
        >
          <IconComponent sx={iconSxProps} />
        </motion.div>
        
        <h3
          className={cn(cc.text.h4, 'text-gray-900')}
        >
          {title}
        </h3>

        <p
          className={cn(cc.typography.caption, 'text-gray-600')}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(EventDetailCard);