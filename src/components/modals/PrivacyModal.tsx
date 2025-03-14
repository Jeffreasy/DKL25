import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import type { PrivacyModalProps } from './types';

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAccept }) => {
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
              <Dialog.Title className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                Privacybeleid
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Privacyverklaring De Koninklijke Loop
                </h2>
                <p className="text-gray-600 mb-4">
                  De Koninklijke Loop respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.
                </p>
              </section>

              <section>
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  Gebruik van verzamelde gegevens
                </h3>
                <div className="space-y-3 text-gray-600">
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
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sluiten
              </button>
              {onAccept && (
                <button
                  onClick={() => {
                    onAccept();
                    onClose();
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
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
}; 