import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaComment, FaPaperPlane } from 'react-icons/fa';
import { useContactForm } from './hooks/useContactForm';
import type { ContactModalProps } from './types';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onPrivacyClick }) => {
  if (!isOpen) return null;

  const { form, isSubmitting, submitError, onSubmit } = useContactForm(onClose);
  const { register, formState: { errors } } = form;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden font-heading">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contact</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Sluit contact formulier"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {/* Honeypot */}
            <input type="text" {...register('website')} className="hidden" />

            <div className="space-y-4">
              {/* Naam */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser className="text-primary" />
                  Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('naam', { required: 'Naam is verplicht' })}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 transition-all
                    ${errors.naam ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Bijv. Jan Jansen"
                />
                {errors.naam && (
                  <p className="mt-1 text-sm text-red-500">{errors.naam.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaEnvelope className="text-primary" />
                  E-mailadres <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'E-mailadres is verplicht',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ongeldig e-mailadres'
                    }
                  })}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 transition-all
                    ${errors.email ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Bijv. jan@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Telefoon */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaPhone className="text-primary" />
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  {...register('telefoon')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>

              {/* Bericht */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaComment className="text-primary" />
                  Bericht <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('bericht', { required: 'Bericht is verplicht' })}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 transition-all
                    ${errors.bericht ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Schrijf je bericht hier..."
                />
                {errors.bericht && (
                  <p className="mt-1 text-sm text-red-500">{errors.bericht.message}</p>
                )}
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Door dit formulier te verzenden ga je akkoord met ons{' '}
              <button
                type="button"
                onClick={onPrivacyClick}
                className="text-primary hover:text-primary-dark font-medium underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
              >
                privacybeleid
              </button>
              .
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-lg
                flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300
                disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verzenden...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Stuur mijn bericht
                </>
              )}
            </button>

            {submitError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {submitError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}; 