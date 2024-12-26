import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import { z } from 'zod';
import type { ContactModalProps } from './types';
import { toast } from 'react-hot-toast';

// Validatie schema
const ContactSchema = z.object({
  naam: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  bericht: z.string()
    .min(10, 'Bericht moet minimaal 10 karakters zijn')
    .max(1000, 'Bericht mag maximaal 1000 karakters zijn'),
  privacy: z.boolean().refine((val) => val === true, 'Je moet akkoord gaan met het privacybeleid')
});

type ContactFormData = z.infer<typeof ContactSchema>;

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onPrivacyClick }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    naam: '',
    email: '',
    bericht: '',
    privacy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Valideer de data
      const validatedData = ContactSchema.parse(formData);

      // Verstuur naar API
      const response = await fetch('/api/email/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het versturen van je bericht');
      }

      // Toon succes melding
      toast.success('Je bericht is succesvol verzonden! We nemen zo snel mogelijk contact met je op.', {
        duration: 5000,
        position: 'top-center',
      });

      // Reset form
      setFormData({
        naam: '',
        email: '',
        bericht: '',
        privacy: false
      });
      
      // Wacht even zodat de gebruiker de success melding kan zien
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Submit error:', err);
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Validatie error');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Er ging iets mis bij het versturen van je bericht');
      }
      
      // Toon error toast
      toast.error('Er ging iets mis. Probeer het opnieuw of neem contact op via email.', {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel 
          className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden animate-slideIn mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="bg-primary p-6 flex items-center justify-between">
                <Dialog.Title className="text-2xl font-bold text-white tracking-tight font-heading">
                  Contact
                </Dialog.Title>
                <button 
                  onClick={onClose}
                  className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                  aria-label="Sluiten"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-8">
                  <div className="text-primary text-5xl">✉️</div>
                </div>

                <div className="space-y-4">
                  {/* Naam */}
                  <div>
                    <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="naam"
                      value={formData.naam}
                      onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        transition-colors
                        text-gray-900 placeholder-gray-400 bg-white"
                      placeholder="Uw naam"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        transition-colors
                        text-gray-900 placeholder-gray-400 bg-white"
                      placeholder="uw@email.nl"
                      required
                    />
                  </div>

                  {/* Bericht */}
                  <div>
                    <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                      Bericht
                    </label>
                    <textarea
                      id="bericht"
                      value={formData.bericht}
                      onChange={(e) => setFormData(prev => ({ ...prev, bericht: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        transition-colors resize-none
                        text-gray-900 placeholder-gray-400 bg-white"
                      rows={4}
                      placeholder="Uw bericht..."
                      required
                    />
                  </div>

                  {/* Privacy */}
                  <div className="flex items-start space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.privacy}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.checked }))}
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      Ik ga akkoord met het{' '}
                      <button
                        type="button"
                        onClick={onPrivacyClick}
                        className="text-[#ff9328] underline"
                      >
                        privacybeleid
                      </button>
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-6 pb-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full 
                    font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Versturen...' : 'Versturen'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 