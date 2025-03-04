import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { DonatieModalProps } from './types';
import { trackEvent } from '@/utils/googleAnalytics';

export const DonatieModal: React.FC<DonatieModalProps> = ({ isOpen, onClose }) => {
  // Track modal open/close
  useEffect(() => {
    if (isOpen) {
      trackEvent('donatie', 'modal_opened', 'donatie_form');
    }
  }, [isOpen]);

  // Laad de lettertypen
  useEffect(() => {
    // Voeg de Google Fonts link toe aan de head als deze nog niet bestaat
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Montserrat"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleClose = () => {
    trackEvent('donatie', 'modal_closed', 'donatie_form');
    onClose();
  };

  const handleLinkClick = (path: string) => {
    trackEvent('donatie', 'link_click', path);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 overflow-y-auto">
        {/* Backdrop overlay voor het sluiten van de modal */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        />

        <div className="flex min-h-full items-start md:items-center justify-center p-0 md:p-4">
          <Dialog.Panel 
            className="bg-white w-full min-h-screen md:min-h-0 md:rounded-xl md:w-full md:max-w-2xl relative shadow-2xl overflow-hidden animate-slideIn"
          >
            <div className="relative flex flex-col h-full md:h-auto">
              <div className="bg-primary p-3 md:p-4 flex items-center justify-between sticky top-0 z-10">
                <Dialog.Title className="text-lg md:text-xl font-bold text-white tracking-tight" style={{fontFamily: "'Montserrat', sans-serif"}}>
                  Doneren aan het Liliane Fonds
                </Dialog.Title>
                <button 
                  onClick={handleClose}
                  className="text-white hover:bg-white/10 p-2 rounded-full transition-colors touch-manipulation"
                  aria-label="Sluiten"
                >
                  <CloseIcon className="text-base" />
                </button>
              </div>

              <div className="pt-6 md:pt-8 px-4 md:px-6 pb-4 flex-grow">
                <div className="flex flex-col items-center justify-center">
                  <iframe
                    title="GoFundMe Donatie Widget"
                    src="https://www.gofundme.com/f/samen-op-weg-voor-het-liliane-fonds-met-de-koninklijke-loop/widget/large"
                    className="w-full"
                    style={{
                      height: '550px',
                      border: 'none',
                      overflow: 'hidden',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  ></iframe>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3 p-3 md:p-4 bg-gray-50 border-t border-gray-100">
                <Link 
                  to="/wat-is-de-koninklijkeloop"
                  className="group block p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                  onClick={() => handleLinkClick('over_goed_doel')}
                >
                  <div className="flex items-center gap-3">
                    <VolunteerActivismIcon className="text-primary text-lg md:text-xl" />
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold mb-0.5 md:mb-1 group-hover:text-primary transition-colors" style={{fontFamily: "'Montserrat', sans-serif"}}>
                        Over het goede doel
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm group-hover:translate-x-2 transition-transform duration-300" style={{fontFamily: "'Open Sans', sans-serif"}}>
                        Lees meer over waar we voor lopen.
                      </p>
                    </div>
                    <ArrowForwardIcon className="text-gray-400 text-lg md:text-xl group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </Link>

                <Link 
                  to="/faq"
                  className="group block p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                  onClick={() => handleLinkClick('faq')}
                >
                  <div className="flex items-center gap-3">
                    <HelpOutlineIcon className="text-primary text-lg md:text-xl" />
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold mb-0.5 md:mb-1 group-hover:text-primary transition-colors" style={{fontFamily: "'Montserrat', sans-serif"}}>
                        Vragen over doneren?
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm group-hover:translate-x-2 transition-transform duration-300" style={{fontFamily: "'Open Sans', sans-serif"}}>
                        Bekijk onze FAQ of neem contact op.
                      </p>
                    </div>
                    <ArrowForwardIcon className="text-gray-400 text-lg md:text-xl group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </Link>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}; 