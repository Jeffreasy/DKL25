import React, { useCallback, memo } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HelpIcon from '@mui/icons-material/Help';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import type { InschrijfModalProps } from './types';
import { modalBaseStyles } from './styles';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn } from '@/styles/shared';

export const InschrijfModal: React.FC<InschrijfModalProps> = memo(({ isOpen, onClose }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('InschrijfModal');

  const handleClose = useCallback(() => {
    trackInteraction('modal_closed', 'inschrijf_form');
    onClose();
  }, [trackInteraction, onClose]);

  const handleLinkClick = useCallback((path: string) => {
    trackInteraction('link_click', path);
    onClose();
  }, [trackInteraction, onClose]);
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className={modalBaseStyles.overlay}>
        <Dialog.Panel 
          className={modalBaseStyles.panel}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="bg-primary p-4 sm:p-6 flex items-center justify-between">
              <Dialog.Title className={cn(cc.text.h2, 'text-white tracking-tight')}>
                Inschrijving 2025
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-6 sm:mb-8">
                <InfoIcon className="text-primary" sx={{ fontSize: { xs: 56, sm: 72 } }} />
              </div>
              <h2 className={cn(cc.text.h4, 'text-gray-900 text-center mb-4')}>
                Inschrijvingen openen binnenkort
              </h2>
              <p className={cn(cc.text.body, 'text-gray-600 mb-4 text-center leading-relaxed')}>
                De inschrijvingen voor De Koninklijke Loop 2026 starten vanaf 15 januari 2026.
              </p>
              <p className={cn(cc.text.body, 'text-gray-600 text-center leading-relaxed')}>
                Wil je op de hoogte blijven? Volg ons dan op social media of neem contact met ons op.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
              <Link
                to="/faq"
                onClick={() => handleLinkClick('contact_faq')}
                className={cn('flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg', cc.text.body)}
              >
                <span>Contact opnemen</span>
                <ArrowForwardIcon />
              </Link>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <Link
                to="/wat-is-de-koninklijkeloop"
                className="group block p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => handleLinkClick('wat_is_de_koninklijke_loop')}
              >
                <div className="flex items-center gap-3">
                  <HelpIcon className="text-primary text-2xl" />
                  <div className="flex-1">
                    <h3 className={cn(cc.text.bodyLarge, 'mb-2 group-hover:text-primary transition-colors')}>
                      Wat is De Koninklijke Loop?
                    </h3>
                    <p className={cn(cc.text.body, 'text-gray-600 group-hover:translate-x-2 transition-transform duration-300')}>
                      Lees meer over het evenement en onze missie.
                    </p>
                  </div>
                  <ArrowForwardIcon className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>

              <Link
                to="/over-ons"
                className="group block p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => handleLinkClick('over_ons')}
              >
                <div className="flex items-center gap-3">
                  <GroupsIcon className="text-primary text-2xl" />
                  <div className="flex-1">
                    <h3 className={cn(cc.text.bodyLarge, 'mb-2 group-hover:text-primary transition-colors')}>
                      Over Ons
                    </h3>
                    <p className={cn(cc.text.body, 'text-gray-600 group-hover:translate-x-2 transition-transform duration-300')}>
                      Leer meer over onze organisatie en team.
                    </p>
                  </div>
                  <ArrowForwardIcon className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>

              <Link
                to="/faq"
                className="group block p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => handleLinkClick('faq')}
              >
                <div className="flex items-center gap-3">
                  <ContactSupportIcon className="text-primary text-2xl" />
                  <div className="flex-1">
                    <h3 className={cn(cc.text.bodyLarge, 'mb-2 group-hover:text-primary transition-colors')}>
                      Contact & FAQ
                    </h3>
                    <p className={cn(cc.text.body, 'text-gray-600 group-hover:translate-x-2 transition-transform duration-300')}>
                      Heb je vragen? Bekijk onze FAQ of neem contact op.
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
});

InschrijfModal.displayName = 'InschrijfModal';