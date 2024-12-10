import React from 'react';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import type { PrivacyModalProps } from './types';

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden font-heading">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Privacybeleid
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Sluit privacybeleid"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            <div className="prose prose-lg max-w-none">
              {/* Privacy content hier */}
              <h2>Privacybeleid De Koninklijke Loop</h2>
              <p>
                Hier komt de inhoud van het privacybeleid...
              </p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 