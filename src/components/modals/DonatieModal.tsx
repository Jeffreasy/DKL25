import React from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { DonatieModalProps } from './types';

export const DonatieModal: React.FC<DonatieModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden animate-slideIn mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="bg-primary p-6 flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-white tracking-tight font-heading">
                Doneren
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-8">
                <FavoriteIcon className="text-primary" sx={{ fontSize: 72 }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-4 font-heading">
                Donaties openen binnenkort
              </h2>
              <p className="text-gray-600 text-lg mb-4 text-center leading-relaxed">
                Doneren voor De Koninklijke Loop 2025 starten vanaf 15 januari 2025.
              </p>
              <p className="text-gray-600 text-lg text-center leading-relaxed">
                Wil je op de hoogte blijven? Volg ons dan op social media of neem contact met ons op.
              </p>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <Link
                to="/faq"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>Contact opnemen</span>
                <ArrowForwardIcon />
              </Link>
            </div>

            <div className="space-y-6 p-6">
              <Link 
                to="/wat-is-de-koninklijkeloop"
                className="group block p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <VolunteerActivismIcon className="text-primary text-2xl" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors font-heading">
                      Over het goede doel
                    </h3>
                    <p className="text-gray-600 group-hover:translate-x-2 transition-transform duration-300">
                      Lees meer over waar we voor lopen.
                    </p>
                  </div>
                  <ArrowForwardIcon className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>

              <Link 
                to="/faq"
                className="group block p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <HelpOutlineIcon className="text-primary text-2xl" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      Vragen over doneren?
                    </h3>
                    <p className="text-gray-600 group-hover:translate-x-2 transition-transform duration-300">
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