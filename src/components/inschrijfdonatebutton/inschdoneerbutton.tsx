import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';

interface InschDoneerButtonProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
  className?: string;
}

const InschDoneerButton: React.FC<InschDoneerButtonProps> = ({ 
  onInschrijfClick, 
  onDonatieClick,
  className = ''
}) => {
  return (
    <div className="sticky bottom-4 sm:bottom-6 md:bottom-8 w-full mx-auto px-4 z-50">
      <div className={`flex justify-center gap-4 ${className}`}>
        <button
          onClick={onInschrijfClick}
          className="flex items-center justify-center gap-1 px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base w-[120px] sm:w-[160px] md:w-[200px]"
          aria-label="Inschrijven voor het evenement"
        >
          <EmailIcon className="text-sm sm:text-base md:text-lg" />
          <span>Inschrijven</span>
        </button>
        <button
          onClick={onDonatieClick}
          className="flex items-center justify-center gap-1 px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base w-[120px] sm:w-[160px] md:w-[200px]"
          aria-label="Doneren aan het goede doel"
        >
          <FavoriteIcon className="text-sm sm:text-base md:text-lg" />
          <span>Doneren</span>
        </button>
      </div>
    </div>
  );
};

export default InschDoneerButton;