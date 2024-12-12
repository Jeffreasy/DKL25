import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import type { ContactModalProps } from './types';
import { supabase } from '../../lib/supabase';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onPrivacyClick }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget as HTMLFormElement;
    const messageElement = form.elements.namedItem('message') as HTMLTextAreaElement;
    
    const formData = {
      naam: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      telefoon: (form.elements.namedItem('phone') as HTMLInputElement).value,
      bericht: messageElement ? messageElement.value : '',
    };

    if (!formData.bericht) {
      setSubmitError('Vul alstublieft een bericht in');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from('contact_berichten')
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      const makeResponse = await fetch('https://hook.eu2.make.com/i5d3rb4ph4thqfccadna3px46ypyjz16', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.naam,
          email: formData.email,
          phone: formData.telefoon,
          message: formData.bericht,
        }),
      });

      if (!makeResponse.ok) {
        throw new Error('Er ging iets mis bij het verzenden van het bericht');
      }

      setSubmitSuccess(true);
      form.reset();
      
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Er ging iets mis bij het verzenden van het bericht'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Contact
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <EmailIcon className="text-primary" sx={{ fontSize: { xs: 56, sm: 72 } }} />
              </div>

              {submitSuccess ? (
                <div className="text-center text-green-600 py-4">
                  <p className="font-medium">Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                      placeholder="Uw naam"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                      placeholder="uw@email.nl"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefoonnummer <span className="text-gray-400 text-xs">(optioneel)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                      placeholder="Uw telefoonnummer"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Bericht
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none text-gray-900"
                      placeholder="Uw bericht..."
                      required
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="privacy" className="text-gray-600">
                        Ik ga akkoord met het{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPrivacyClick();
                          }}
                          className="text-primary hover:text-primary-dark underline focus:outline-none"
                        >
                          privacybeleid
                        </button>
                      </label>
                    </div>
                  </div>

                  {submitError && (
                    <div className="text-red-600 text-sm">
                      {submitError}
                    </div>
                  )}

                  <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Bezig met verzenden...' : 'Versturen'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 