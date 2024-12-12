import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import type { TermsModalProps } from './types';

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
                Algemene Voorwaarden
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
                Door deel te nemen aan De Koninklijke Loop gaat u akkoord met de volgende voorwaarden:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Deelname</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deelname is op eigen risico</li>
                <li>U dient zich te houden aan de aanwijzingen van de organisatie</li>
                <li>U dient de verkeersregels en -tekens in acht te nemen</li>
                <li>Minimumleeftijd voor deelname is 16 jaar</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Annulering</h3>
              <p className="text-base leading-relaxed">
                Bij annulering door de deelnemer vindt geen restitutie plaats van het inschrijfgeld. Bij annulering door de organisatie wordt het inschrijfgeld terugbetaald.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Aansprakelijkheid</h3>
              <p className="text-base leading-relaxed">
                De organisatie is niet aansprakelijk voor verlies, diefstal of schade aan eigendommen, noch voor enig opgelopen persoonlijk letsel.
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