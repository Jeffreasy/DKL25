import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import { trackEvent } from '@/utils/googleAnalytics';

interface InschDoneerButtonProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
  className?: string;
  isModalOpen?: boolean;
}

const InschDoneerButton: React.FC<InschDoneerButtonProps> = ({ 
  onInschrijfClick, 
  onDonatieClick,
  className = '',
  isModalOpen = false
}) => {
  if (isModalOpen) {
    return null;
  }

  const handleInschrijfClick = () => {
    trackEvent('cta', 'button_click', 'aanmelden');
    onInschrijfClick();
  };

  const handleDonatieClick = () => {
    trackEvent('cta', 'button_click', 'doneren');
    onDonatieClick();
  };

  return (
    <div className="sticky bottom-4 sm:bottom-6 md:bottom-8 w-full mx-auto px-4 z-50">
      <div className={`flex justify-center gap-4 ${className}`}>
        <button
          onClick={handleInschrijfClick}
          className="flex items-center justify-center gap-1 px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base w-[120px] sm:w-[160px] md:w-[200px]"
          aria-label="Aanmelden voor het evenement"
        >
          <EmailIcon className="text-sm sm:text-base md:text-lg" />
          <span>Aanmelden</span>
        </button>
        <button
          onClick={handleDonatieClick}
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