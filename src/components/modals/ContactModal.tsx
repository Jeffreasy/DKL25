import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-hot-toast';
import { useContactForm } from '@/hooks/useContactForm';
import type { ContactModalProps } from './types';
import { contactSchema, type ContactFormData } from '@/types/contact';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingSpinner from '../LoadingSpinner';
import { trackEvent } from '@/utils/googleAnalytics';
import { useNavigate } from 'react-router-dom';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { submitContactForm, isSubmitting } = useContactForm();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  // Track modal open/close
  React.useEffect(() => {
    if (isOpen) {
      trackEvent('contact', 'modal_opened', 'contact_form');
    }
  }, [isOpen]);

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitContactForm(data);
    
    if (result.success) {
      trackEvent('contact', 'form_submitted', 'success');
      toast.success('Je bericht is verzonden! We nemen zo snel mogelijk contact met je op.');
      reset();
      onClose();
    } else {
      trackEvent('contact', 'form_submitted', 'error');
      toast.error(result.message || 'Er ging iets mis bij het versturen van je bericht.');
    }
  };

  const handleClose = () => {
    trackEvent('contact', 'modal_closed', 'contact_form');
    onClose();
  };

  const handlePrivacyClick = () => {
    trackEvent('contact', 'privacy_click', 'privacy_policy');
    onClose(); // Sluit eerst de modal
    navigate('/privacy'); // Navigeer dan naar de privacy pagina
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start p-1 xs:p-2 sm:p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden animate-slideIn mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              {/* Header */}
              <div className="bg-primary p-6 flex items-center justify-between">
                <Dialog.Title className="text-2xl font-bold text-white tracking-tight font-heading">
                  Contact
                </Dialog.Title>
                <button 
                  onClick={handleClose}
                  className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                  aria-label="Sluiten"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Form content */}
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
                      className={`w-full px-4 py-2 border rounded-lg transition-colors
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        ${errors.naam ? 'border-red-500' : 'border-gray-300'}
                        text-gray-900 placeholder-gray-400 bg-white`}
                      placeholder="Uw naam"
                      {...register('naam')}
                    />
                    {errors.naam && (
                      <p className="text-sm text-red-500 mt-1">{errors.naam.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-2 border rounded-lg transition-colors
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                        text-gray-900 placeholder-gray-400 bg-white`}
                      placeholder="uw@email.nl"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Bericht */}
                  <div>
                    <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                      Bericht
                    </label>
                    <textarea
                      id="bericht"
                      className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none
                        focus:ring-2 focus:ring-primary focus:border-primary 
                        ${errors.bericht ? 'border-red-500' : 'border-gray-300'}
                        text-gray-900 placeholder-gray-400 bg-white`}
                      rows={4}
                      placeholder="Uw bericht..."
                      {...register('bericht')}
                    />
                    {errors.bericht && (
                      <p className="text-sm text-red-500 mt-1">{errors.bericht.message}</p>
                    )}
                  </div>

                  {/* Privacy */}
                  <div className="flex items-start space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="privacy_akkoord"
                      className="mt-1"
                      {...register('privacy_akkoord')}
                    />
                    <label htmlFor="privacy_akkoord" className="text-sm text-gray-600">
                      Ik ga akkoord met het{' '}
                      <button
                        type="button"
                        onClick={handlePrivacyClick}
                        className="text-[#ff9328] underline hover:text-[#e67f1c] transition-colors"
                      >
                        privacybeleid
                      </button>
                    </label>
                  </div>
                  {errors.privacy_akkoord && (
                    <p className="text-sm text-red-500">{errors.privacy_akkoord.message}</p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Verzenden...
                    </>
                  ) : (
                    'Versturen'
                  )}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 