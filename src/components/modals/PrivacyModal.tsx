import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import type { PrivacyModalProps } from './types';

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full max-w-[calc(100%-0.5rem)] xs:max-w-[calc(100%-1rem)] sm:max-w-xl relative shadow-2xl overflow-hidden animate-slideIn mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8"
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

            <div className="p-4 sm:p-6 space-y-4 text-gray-600">
              <p className="text-base leading-relaxed">
                De Koninklijke Loop respecteert uw privacy en zorgt ervoor dat uw persoonlijke gegevens vertrouwelijk worden behandeld.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Gegevensverzameling</h3>
              <p className="text-base leading-relaxed">
                Wij verzamelen alleen gegevens die noodzakelijk zijn voor de organisatie van het evenement en de communicatie met deelnemers.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Gebruik van gegevens</h3>
              <p className="text-base leading-relaxed">
                Uw gegevens worden gebruikt voor:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Registratie en administratie van deelnemers</li>
                <li>Communicatie over het evenement</li>
                <li>Tijdregistratie en uitslagen</li>
                <li>Noodgevallen tijdens het evenement</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Beveiliging</h3>
              <p className="text-base leading-relaxed">
                We nemen passende maatregelen om uw gegevens te beschermen tegen verlies, misbruik en ongeautoriseerde toegang.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sluiten
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 