import React, { useEffect } from 'react';
import type { PartnerModalProps } from './types';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import { trackEvent } from '@/utils/googleAnalytics';

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, partner }) => {
  // Track modal open/close
  useEffect(() => {
    if (isOpen && partner) {
      trackEvent('partners', 'modal_opened', partner.name);
    }
  }, [isOpen, partner]);

  const handleClose = () => {
    trackEvent('partners', 'modal_closed', partner?.name || 'partner_details');
    onClose();
  };

  const handleWebsiteClick = () => {
    if (partner?.website) {
      trackEvent('partners', 'website_click', partner.name);
    }
  };

  if (!isOpen || !partner) return null;

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

          <div className="relative bg-primary p-6 sm:p-10 flex justify-center items-center h-40 sm:h-48">
            <div className="absolute inset-0 opacity-10 bg-pattern"></div>
            <img
              src={partner.logo ?? undefined}
              alt={`${partner.name} Logo`}
              className="w-32 sm:w-48 max-h-full object-contain relative z-1"
            />
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-2">
                Partner sinds {partner.since}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {partner.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
              {partner.description}
            </p>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {partner.website && (
              <a
                href={partner.website}
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