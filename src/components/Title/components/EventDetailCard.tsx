import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { EventDetail } from '../functions/types';
import { trackEvent } from '@/utils/googleAnalytics';

export const iconMap = {
  calendar: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
  users: <PeopleIcon sx={{ fontSize: 40 }} />,
  medal: <EmojiEventsIcon sx={{ fontSize: 40 }} />
};

interface EventDetailCardProps extends EventDetail {
  titleStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
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
  titleStyle, 
  textStyle,
  onClick,
  isClickable = false,
  index = 0
}) => {
  const [state, setState] = useState<CardState>({
    isHovered: false,
    isFocused: false
  });

  // Animation variants
  const cardVariants = {
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
  };

  const iconVariants = {
    hover: {
      rotate: [0, -5, 5, -5, 0],
      scale: 1.1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleClick = () => {
    if (onClick) {
      trackEvent('event_details', 'detail_click', title);
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable ? 0 : undefined}
      className={`
        bg-white p-6 rounded-lg
        transition-shadow duration-300
        ${isClickable ? 'cursor-pointer' : ''}
        ${state.isFocused ? 'ring-2 ring-primary/40' : ''}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isClickable ? "hover" : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      onHoverStart={() => {
        setState(prev => ({ ...prev, isHovered: true }));
        trackEvent('event_details', 'detail_hover', title);
      }}
      onHoverEnd={() => setState(prev => ({ ...prev, isHovered: false }))}
      onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
      onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
      aria-label={`${title}: ${description}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <motion.div 
          className="text-primary mb-2"
          variants={iconVariants}
          animate={state.isHovered ? "hover" : "initial"}
        >
          {iconMap[icon as keyof typeof iconMap]}
        </motion.div>
        
        <h3 
          className="text-gray-900 font-semibold text-xl"
          style={titleStyle}
        >
          {title}
        </h3>
        
        <p 
          className="text-gray-600"
          style={textStyle}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(EventDetailCard); 