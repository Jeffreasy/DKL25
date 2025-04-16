import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavIcon from '../Navbar/NavIcon';
import type { CTACardData } from './types';
import { logEvent } from '@/utils/googleAnalytics';

type CTACardProps = CTACardData & {
  onClick: () => void;
  index: number;
};

interface CardState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
}

const CTACard: React.FC<CTACardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  actionType,
  index
}) => {
  const [state, setState] = useState<CardState>({
    isHovered: false,
    isPressed: false,
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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

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

  const handleClick = () => {
    // Track de knop klik specifiek in deze component voor meer gedetailleerde gegevens
    logEvent('interaction', 'cta_button_click', `${title}_${buttonText}_${actionType}`);
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      id={`cta-card-${index}`}
      className={`
        bg-white rounded-3xl p-6 md:p-8 font-heading
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
        focus-within:ring-2 focus-within:ring-primary/40
        ${state.isFocused ? 'ring-2 ring-primary/40' : ''}
      `}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => {
        setState(prev => ({ ...prev, isHovered: true }));
        logEvent('interaction', 'cta_card_hover', title);
      }}
      onHoverEnd={() => setState(prev => ({ ...prev, isHovered: false }))}
      role="article"
      aria-labelledby={`cta-title-${index}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div 
          className="w-16 h-16 md:w-20 md:h-20 mb-2 flex items-center justify-center"
          animate={{ 
            rotate: state.isHovered ? [0, -5, 5, -5, 0] : 0,
            scale: state.isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <NavIcon 
            name={icon} 
            className={`
              h-10 w-10 md:h-12 md:w-12
              text-primary transition-transform duration-300
              ${state.isHovered ? 'scale-110' : ''}
            `}
          />
        </motion.div>
        
        <h3 
          id={`cta-title-${index}`}
          className="text-xl md:text-2xl font-bold text-gray-900"
        >
          {title}
        </h3>
        
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          {description}
        </p>

        <motion.button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`
            mt-4 px-6 py-2 text-base md:px-8 md:py-3 md:text-lg 
            bg-primary text-white font-medium 
            rounded-full 
            hover:bg-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-all duration-300
            transform-gpu
            ${state.isPressed ? 'scale-95' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={() => setState(prev => ({ ...prev, isPressed: true }))}
          onMouseUp={() => setState(prev => ({ ...prev, isPressed: false }))}
          onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
          onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
          aria-label={`${buttonText} - ${description}`}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default React.memo(CTACard);