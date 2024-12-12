import React from 'react';
import { MemoizedNavIcon } from '@/components/core/Navbar/Navbar';
import type { IconName } from '@/components/icons/types';

interface CTACardProps {
  title: string;
  description: string;
  icon: IconName;
  buttonText: string;
  onClick: () => void;
  delay?: number;
}

const CTACard: React.FC<CTACardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  delay = 0
}) => {
  return (
    <div 
      className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center justify-between h-full space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2 
          group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 
          group-hover:shadow-lg group-hover:shadow-primary/20"
        >
          <MemoizedNavIcon 
            name={icon} 
            size={48} 
            className="text-primary group-hover:text-primary-dark transition-colors duration-300" 
          />
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary 
            transition-colors duration-300 transform group-hover:scale-105"
          >
            {title}
          </h3>
          
          <p className="text-gray-600 text-lg leading-relaxed text-center">
            {description}
          </p>
        </div>
        
        <button
          onClick={onClick}
          className="relative overflow-hidden w-full px-8 py-4 bg-primary text-white text-lg font-medium rounded-full 
            transition-all duration-500 hover:shadow-lg hover:shadow-primary/30 hover:bg-primary-dark
            before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:skew-x-[-15deg]
            hover:before:translate-x-[100%] before:transition-transform before:duration-700
            transform hover:scale-105"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {buttonText}
            <MemoizedNavIcon 
              name={icon === 'info' ? 'about' : icon} 
              size={24} 
              className="transform group-hover:translate-x-1 transition-transform duration-300" 
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(CTACard); 