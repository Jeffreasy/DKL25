import React from 'react';
import { MemoizedNavIcon } from '../Navbar/Navbar';
import type { CTACardData } from './types';

type CTACardProps = CTACardData & {
  onClick: () => void;
};

const CTACard: React.FC<CTACardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick
}) => {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <MemoizedNavIcon name={icon} size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <button
          onClick={onClick}
          className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CTACard); 