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
    <div className="sticky bottom-4 sm:bottom-6 md:bottom-8 w-full max-w-2xl mx-auto px-4 z-50">
      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${className}`}>
        <button
          onClick={onInschrijfClick}
          className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[160px] flex-1"
          aria-label="Inschrijven voor het evenement"
        >
          <EmailIcon />
          <span>Inschrijven</span>
        </button>
        <button
          onClick={onDonatieClick}
          className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[160px] flex-1"
          aria-label="Doneren aan het goede doel"
        >
          <FavoriteIcon />
          <span>Doneren</span>
        </button>
      </div>
    </div>
  );
};

export default InschDoneerButton;