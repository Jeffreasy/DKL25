import React, { useEffect } from 'react';
import type { SponsorModalProps } from './types';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import { trackEvent } from '@/utils/googleAnalytics';
import { Sponsor } from '../sponsors/types'; // Ensure Sponsor type is available

export const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, sponsor }) => {
  // Track modal open/close
  useEffect(() => {
    if (isOpen && sponsor) {
      trackEvent('sponsors', 'modal_opened', sponsor.name);
    }
  }, [isOpen, sponsor]);

  const handleClose = () => {
    trackEvent('sponsors', 'modal_closed', sponsor?.name || 'sponsor_details');
    onClose();
  };

  const handleWebsiteClick = () => {
    if (sponsor?.websiteUrl) {
      trackEvent('sponsors', 'website_click', sponsor.name);
    }
  };

  if (!isOpen || !sponsor) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full sm:w-[28rem] max-w-[calc(100%-0.5rem)] xs:max-w-[calc(100%-1rem)] relative shadow-2xl overflow-hidden animate-slideIn mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:rotate-90"
            onClick={handleClose}
            aria-label="Sluiten"
          >
            <CloseIcon />
          </button>

          {/* Header with Logo */}
          <div className="relative bg-primary p-6 sm:p-10 flex justify-center items-center h-40 sm:h-48">
            <div className="absolute inset-0 opacity-10 bg-pattern"></div> {/* Assuming bg-pattern class exists */}
            <img
              src={sponsor.logoUrl ?? '/fallback-logo.png'} // Use fallback if logoUrl is null/undefined
              alt={`${sponsor.name} Logo`}
              className="w-32 sm:w-48 max-h-full object-contain relative z-1"
              onError={(e) => {
                e.currentTarget.src = '/fallback-logo.png'; // Fallback for broken image links
                trackEvent('sponsors', 'modal_image_error', sponsor.name);
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              {/* You might want to add a sponsor tier or other info here if available */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {sponsor.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
              {sponsor.description}
            </p>
          </div>

          {/* Footer with Website Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {sponsor.websiteUrl && (
              <a
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWebsiteClick}
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>Bezoek website</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 