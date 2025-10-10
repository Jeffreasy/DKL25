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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="naam" className={cn(cc.form.label)}>
            Naam
          </label>
          <input
            type="text"
            id="naam"
            className={cn(
              'mt-1 block',
              errors.naam ? cc.input.error : cc.input.base
            )}
            {...register('naam')}
          />
          {errors.naam?.message && (
            <p className={cn(cc.text.error, 'mt-1')}>{errors.naam.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={cn(cc.form.label)}>
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            className={cn(
              'mt-1 block',
              errors.email ? cc.input.error : cc.input.base
            )}
            {...register('email')}
          />
          {errors.email?.message && (
            <p className={cn(cc.text.error, 'mt-1')}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bericht" className={cn(cc.form.label)}>
            Je bericht
          </label>
          <textarea
            id="bericht"
            rows={4}
            className={cn(
              'mt-1 block',
              errors.bericht ? cc.input.error : cc.input.base
            )}
            {...register('bericht')}
          />
          {errors.bericht?.message && (
            <p className={cn(cc.text.error, 'mt-1')}>{errors.bericht.message}</p>
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
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="privacy_akkoord" className={cn(cc.text.body, 'text-gray-700')}>
              Ik ga akkoord met de privacy voorwaarden
            </label>
            {errors.privacy_akkoord?.message && (
              <p className={cn(cc.text.error, 'mt-1')}>{errors.privacy_akkoord.message}</p>
            )}
          </div>
        </div>
      </div>

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
        >
          {isSubmitting ? 'Bericht versturen...' : 'Verstuur bericht'}
        </button>
      </div>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';