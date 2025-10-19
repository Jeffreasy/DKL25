import { useState, useCallback, memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { contactSchema, type ContactFormData } from '@/types/contact';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_EMAIL_SERVICE_URL;

export const ContactForm = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('ContactForm');

  // Memoize form configuration
  const formConfig = useMemo(() => ({
    resolver: zodResolver(contactSchema)
  }), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>(formConfig);

  const onSubmit = useCallback(async (data: ContactFormData) => {
    const startTime = performance.now();

    try {
      trackInteraction('form_submit', 'contact_form_attempt');
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verzonden: false,
          status: 'nieuw'
        })
      });

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het versturen van je bericht');
      }

      const duration = Math.round(performance.now() - startTime);
      trackInteraction('form_success', `contact_form_success_duration:${duration}ms`);
      toast.success('Je bericht is succesvol verzonden!');
      reset();
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      trackInteraction('form_error', `contact_form_error_duration:${duration}ms`);
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Er ging iets mis bij het versturen van je bericht');
    } finally {
      setIsSubmitting(false);
    }
  }, [trackInteraction, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-label="Contactformulier voor De Koninklijke Loop"
      noValidate
    >
      <fieldset className="space-y-4">
        <legend className={cn(cc.a11y.srOnly)}>Contactgegevens</legend>
        <div>
          <label htmlFor="naam" className={cn(cc.form.label)}>
            Naam <span className="text-red-500" aria-label="verplicht">*</span>
          </label>
          <input
            type="text"
            id="naam"
            className={cn(
              'mt-1 block',
              errors.naam ? cc.input.error : cc.input.base
            )}
            {...register('naam')}
            aria-required="true"
            aria-invalid={errors.naam ? 'true' : 'false'}
            aria-describedby={errors.naam ? 'naam-error' : undefined}
          />
          {errors.naam?.message && (
            <p id="naam-error" className={cn(cc.text.error, 'mt-1')} role="alert">{errors.naam.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={cn(cc.form.label)}>
            E-mailadres <span className="text-red-500" aria-label="verplicht">*</span>
          </label>
          <input
            type="email"
            id="email"
            className={cn(
              'mt-1 block',
              errors.email ? cc.input.error : cc.input.base
            )}
            {...register('email')}
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email?.message && (
            <p id="email-error" className={cn(cc.text.error, 'mt-1')} role="alert">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bericht" className={cn(cc.form.label)}>
            Je bericht <span className="text-red-500" aria-label="verplicht">*</span>
          </label>
          <textarea
            id="bericht"
            rows={4}
            className={cn(
              'mt-1 block',
              errors.bericht ? cc.input.error : cc.input.base
            )}
            {...register('bericht')}
            aria-required="true"
            aria-invalid={errors.bericht ? 'true' : 'false'}
            aria-describedby={errors.bericht ? 'bericht-error' : undefined}
          />
          {errors.bericht?.message && (
            <p id="bericht-error" className={cn(cc.text.error, 'mt-1')} role="alert">{errors.bericht.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="privacy_akkoord"
              className={cn(
                'h-4 w-4 border-gray-300 rounded',
                colors.primary.text,
                colors.primary.focus
              )}
              {...register('privacy_akkoord')}
              aria-required="true"
              aria-invalid={errors.privacy_akkoord ? 'true' : 'false'}
              aria-describedby={errors.privacy_akkoord ? 'privacy-error' : undefined}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="privacy_akkoord" className={cn(cc.text.body, 'text-gray-700')}>
              Ik ga akkoord met de <a href="/privacy" className={cn(colors.primary.text, 'underline hover:text-primary-dark')}>privacy voorwaarden</a> <span className="text-red-500" aria-label="verplicht">*</span>
            </label>
            {errors.privacy_akkoord?.message && (
              <p id="privacy-error" className={cn(cc.text.error, 'mt-1')} role="alert">{errors.privacy_akkoord.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full',
            cc.flex.center,
            'py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white',
            isSubmitting ? cc.button.disabled : `${colors.primary.bg} ${colors.primary.hover}`,
            'focus:outline-none',
            colors.primary.focusRing
          )}
          aria-busy={isSubmitting}
          aria-label={isSubmitting ? 'Bericht wordt verstuurd' : 'Verstuur contactformulier'}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2" aria-hidden="true">⏳</span>
              <span>Bericht versturen...</span>
            </>
          ) : (
            'Verstuur bericht'
          )}
        </button>
      </div>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';