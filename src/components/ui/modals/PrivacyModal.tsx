import React, { useCallback, memo } from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import type { PrivacyModalProps } from './types';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn } from '@/styles/shared';

export const PrivacyModal: React.FC<PrivacyModalProps> = memo(({ isOpen, onClose, onAccept }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('PrivacyModal');

  const handleClose = useCallback(() => {
    trackInteraction('modal_closed', 'privacy_policy');
    onClose();
  }, [trackInteraction, onClose]);

  const handleAccept = useCallback(() => {
    trackInteraction('privacy_accepted', 'privacy_policy');
    onAccept?.();
    onClose();
  }, [trackInteraction, onAccept, onClose]);
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full 
            max-w-[calc(100%-0.5rem)] xs:max-w-[calc(100%-1rem)] sm:max-w-sm
            relative shadow-2xl overflow-hidden animate-slideIn 
            mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="bg-primary p-4 sm:p-6 flex items-center justify-between">
              <Dialog.Title className={cn(cc.text.h2, 'text-white tracking-tight')}>
                Privacybeleid
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <section>
                <h2 className={cn(cc.text.h4, 'text-gray-900 mb-3')}>
                  Privacyverklaring De Koninklijke Loop
                </h2>
                <p className={cn(cc.text.body, 'text-gray-600 mb-4')}>
                  De Koninklijke Loop respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.
                </p>
              </section>

              <section>
                <h3 className={cn(cc.text.bodyLarge, 'text-gray-900 mb-2')}>
                  Gebruik van verzamelde gegevens
                </h3>
                <div className={cn('space-y-3', cc.text.body, 'text-gray-600')}>
                  <p>Wanneer u zich aanmeldt voor De Koninklijke Loop, vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>De dienst uit te kunnen voeren</li>
                    <li>U te informeren over het evenement</li>
                    <li>Contact met u op te kunnen nemen indien nodig</li>
                    <li>De deelnemersadministratie te kunnen voeren</li>
                  </ul>
                </div>
              </section>

              {/* Voeg hier meer secties toe met privacy informatie */}
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className={cn('px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors', cc.text.body)}
              >
                Sluiten
              </button>
              {onAccept && (
                <button
                  onClick={handleAccept}
                  className={cn('px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors', cc.text.body)}
                >
                  Accepteren
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

PrivacyModal.displayName = 'PrivacyModal';