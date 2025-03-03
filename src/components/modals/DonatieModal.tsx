import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { DonatieModalProps } from './types';

export const DonatieModal: React.FC<DonatieModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl overflow-hidden animate-slideIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="bg-primary p-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold text-white tracking-tight" style={{fontFamily: "'Montserrat', sans-serif"}}>
                Doneren aan het Liliane Fonds
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon className="text-base" />
              </button>
            </div>

            <div className="pt-8 px-6 pb-4">
              <div className="flex flex-col items-center justify-center">
                <iframe
                  title="GoFundMe Donatie Widget"
                  src="https://www.gofundme.com/f/samen-op-weg-voor-het-liliane-fonds-met-de-koninklijke-loop/widget/large"
                  className="w-full"
                  style={{
                    height: '550px',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                ></iframe>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 border-t border-gray-100">
              <Link 
                to="/wat-is-de-koninklijkeloop"
                className="group block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <VolunteerActivismIcon className="text-primary text-xl" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors" style={{fontFamily: "'Montserrat', sans-serif"}}>
                      Over het goede doel
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:translate-x-2 transition-transform duration-300" style={{fontFamily: "'Open Sans', sans-serif"}}>
                      Lees meer over waar we voor lopen.
                    </p>
                  </div>
                  <ArrowForwardIcon className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>

              <Link 
                to="/faq"
                className="group block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <HelpOutlineIcon className="text-primary text-xl" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors" style={{fontFamily: "'Montserrat', sans-serif"}}>
                      Vragen over doneren?
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:translate-x-2 transition-transform duration-300" style={{fontFamily: "'Open Sans', sans-serif"}}>
                      Bekijk onze FAQ of neem contact op.
                    </p>
                  </div>
                  <ArrowForwardIcon className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 