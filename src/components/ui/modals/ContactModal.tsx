import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-hot-toast';
import { useContactForm } from '@/hooks/useContactForm';
import type { ContactModalProps } from './types';
import { contactSchema, type ContactFormData } from '@/types/contact';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingSpinner from '../../common/LoadingSpinner';
import { trackEvent } from '@/utils/googleAnalytics';
import { useNavigate } from 'react-router-dom';
import { cc, cn, colors, animations } from '@/styles/shared';

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
    <Dialog open={isOpen} onClose={handleClose} className={cn('relative', cc.zIndex.modal)}>
      <div className={cn(cc.modal.overlay, 'bg-black/70 backdrop-blur-sm items-start overflow-y-auto')}>
        <Dialog.Panel className={cn(cc.modal.content, 'rounded-lg xs:rounded-xl sm:rounded-2xl', cc.shadow.xl, animations.slideIn, 'mx-1 xs:mx-2 sm:mx-auto my-1 xs:my-2 sm:my-8')}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              {/* Header */}
              <div className={cn(colors.primary.bg, 'p-6', cc.flex.between)}>
                <Dialog.Title className={cn(cc.text.h3, 'text-white tracking-tight', cc.typography.heading)}>
                  Contact
                </Dialog.Title>
                <button 
                  onClick={handleClose}
                  className={cn('text-white hover:bg-white/10 p-2', cc.border.circle, cc.transition.colors)}
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
                    <label htmlFor="naam" className={cc.form.label}>
                      Naam
                    </label>
                    <input
                      type="text"
                      id="naam"
                      className={cn(
                        cc.input.base,
                        errors.naam && cc.input.error
                      )}
                      placeholder="Uw naam"
                      {...register('naam')}
                    />
                    {errors.naam && (
                      <p className={cn(cc.text.error, 'mt-1')}>{errors.naam.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={cc.form.label}>
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={cn(
                        cc.input.base,
                        errors.email && cc.input.error
                      )}
                      placeholder="uw@email.nl"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className={cn(cc.text.error, 'mt-1')}>{errors.email.message}</p>
                    )}
                  </div>

                  {/* Bericht */}
                  <div>
                    <label htmlFor="bericht" className={cc.form.label}>
                      Bericht
                    </label>
                    <textarea
                      id="bericht"
                      className={cn(
                        cc.input.base,
                        'resize-none',
                        errors.bericht && cc.input.error
                      )}
                      rows={4}
                      placeholder="Uw bericht..."
                      {...register('bericht')}
                    />
                    {errors.bericht && (
                      <p className={cn(cc.text.error, 'mt-1')}>{errors.bericht.message}</p>
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
                    <label htmlFor="privacy_akkoord" className={cn(cc.text.small, cc.text.muted)}>
                      Ik ga akkoord met het{' '}
                      <button
                        type="button"
                        onClick={handlePrivacyClick}
                        className={cn(colors.primary.text, 'underline hover:text-primary-dark', cc.transition.colors)}
                      >
                        privacybeleid
                      </button>
                    </label>
                  </div>
                  {errors.privacy_akkoord && (
                    <p className={cc.text.error}>{errors.privacy_akkoord.message}</p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    cc.button.primary,
                    'w-full py-3',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
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