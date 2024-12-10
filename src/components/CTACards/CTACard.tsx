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
    <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-heading">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 mb-2 flex items-center justify-center">
          <MemoizedNavIcon name={icon} size={48} className="text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          {description}
        </p>
        
        <button
          onClick={onClick}
          className="mt-4 px-8 py-3 bg-primary text-white text-lg font-medium rounded-full hover:bg-primary-dark transition-colors duration-300 hover:shadow-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CTACard); 