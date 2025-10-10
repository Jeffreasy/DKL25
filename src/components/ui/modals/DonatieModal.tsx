import React, { useCallback, memo } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { DonatieModalProps } from './types';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

export const DonatieModal: React.FC<DonatieModalProps> = memo(({ isOpen, onClose }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('DonatieModal');

  const handleClose = useCallback(() => {
    trackInteraction('modal_closed', 'donatie_form');
    onClose();
  }, [trackInteraction, onClose]);

  const handleLinkClick = useCallback((path: string) => {
    trackInteraction('link_click', path);
    handleClose();
  }, [trackInteraction, handleClose]);

  const streamWidgetUrl =
    'https://www.gofundme.com/f/samen-op-weg-voor-het-liliane-fonds-met-de-koninklijke-loop/stream-goal-bar?lang=nl_NL&utm_campaign=fp_sharesheet&utm_medium=customer&utm_source=streaming_widget&attribution_id=sl%3Aa6f3b757-4989-41be-978f-6ddf2932766c&locale=nl-NL';

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 z-40">
        {/* Overlay met blur, z-index bewust lager dan het modal paneel */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        />
      </div>

      <div className="fixed inset-0 z-50 flex items-start justify-center p-0 md:p-4 overflow-y-auto">
        <Dialog.Panel className="w-full min-h-screen bg-white shadow-xl overflow-hidden animate-slideIn z-50 md:max-w-2xl md:rounded-xl md:min-h-0 md:my-8">
          <div className="bg-primary p-4 flex items-center justify-between">
            <Dialog.Title className="text-white font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Doneren aan het Liliane Fonds
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-white p-2 hover:bg-white/10 rounded-full"
              aria-label="Sluiten"
            >
              <CloseIcon className="text-base" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] md:overflow-visible md:max-h-none">
            <p className="text-center text-gray-700 font-medium text-base" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Bekijk hier live hoeveel er al is ingezameld voor het Liliane Fonds.
            </p>

            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={streamWidgetUrl}
                title="GofundMe doelbalk"
                width="100%"
                height="200"
                style={{ border: 'none' }}
                loading="lazy"
              />
            </div>

            <div className="flex justify-center">
              <a
                href="https://www.gofundme.com/f/samen-op-weg-voor-het-liliane-fonds-met-de-koninklijke-loop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-full font-medium transition"
              >
                Doneer via GoFundMe
              </a>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-3">
            <Link
              to="/wat-is-de-koninklijkeloop"
              className="group block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleLinkClick('over_goed_doel')}
            >
              <div className="flex items-center gap-3">
                <VolunteerActivismIcon className="text-primary text-xl" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Over het goede doel
                  </h3>
                  <p className="text-xs text-gray-600 group-hover:translate-x-1 transition-transform" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Lees meer over waar we voor lopen.
                  </p>
                </div>
                <ArrowForwardIcon className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-2" />
              </div>
            </Link>

            <Link
              to="/faq"
              className="group block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleLinkClick('faq')}
            >
              <div className="flex items-center gap-3">
                <HelpOutlineIcon className="text-primary text-xl" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Vragen over doneren?
                  </h3>
                  <p className="text-xs text-gray-600 group-hover:translate-x-1 transition-transform" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Bekijk onze FAQ of neem contact op.
                  </p>
                </div>
                <ArrowForwardIcon className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-2" />
              </div>
            </Link>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

DonatieModal.displayName = 'DonatieModal';
