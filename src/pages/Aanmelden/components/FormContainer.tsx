import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, type RegistrationFormData, validateForm } from '../types/schema';
import { toast } from 'react-hot-toast';
import { logEvent } from '../../../utils/googleAnalytics';
import { cc, cn, colors } from '@/styles/shared';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { usePerformanceTracking } from '../../../hooks/usePerformanceTracking';
import { TermsModal } from './TermsModal';
import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import { sendAanmeldingEmail } from '../../../utils/emailService';


const FormContainer: React.FC<{ onSuccess: (data: RegistrationFormData) => void }> = memo(({
  onSuccess
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('FormContainer');

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['contact']));

  // Refs for intersection observer
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const roleSectionRef = useRef<HTMLDivElement>(null);
  const phoneSectionRef = useRef<HTMLDivElement>(null);
  const distanceSectionRef = useRef<HTMLDivElement>(null);
  const supportSectionRef = useRef<HTMLDivElement>(null);
  const termsSectionRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      ondersteuning: 'Nee' as const,
      bijzonderheden: ''
    }
  });

  const selectedRole = useWatch({
    control,
    name: 'rol'
  });

  const selectedOndersteuning = useWatch({
    control,
    name: 'ondersteuning'
  });

  const selectedAfstand = useWatch({
    control,
    name: 'afstand'
  });

  // Memoized computed values for conditional rendering
  const showBijzonderheden = useMemo(() =>
    selectedOndersteuning === 'Ja' || selectedOndersteuning === 'Anders',
    [selectedOndersteuning]
  );

  const shouldShowPhoneSection = useMemo(() =>
    selectedRole === 'Begeleider' || selectedRole === 'Vrijwilliger',
    [selectedRole]
  );

  // Track page view when component mounts
  useEffect(() => {
    logEvent('page_view', 'registration_form_view', 'aanmeld_formulier');
  }, []);

  // Track when role selection changes
  useEffect(() => {
    if (selectedRole) {
      trackInteraction('select_role', selectedRole);
    }
  }, [selectedRole, trackInteraction]);

  // Track when afstand selection changes
  useEffect(() => {
    if (selectedAfstand) {
      trackInteraction('select_distance', selectedAfstand);
    }
  }, [selectedAfstand, trackInteraction]);

  // Track when ondersteuning selection changes
  useEffect(() => {
    if (selectedOndersteuning) {
      trackInteraction('select_support', selectedOndersteuning);
    }
  }, [selectedOndersteuning, trackInteraction]);

  // Optimized intersection observer callbacks
  const handleSectionVisible = useCallback((sectionName: string) => {
    setVisibleSections(prev => new Set([...prev, sectionName]));
  }, []);

  // Intersection Observer for progressive loading
  useIntersectionObserver(contactSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('contact');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  useIntersectionObserver(roleSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('role');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  useIntersectionObserver(phoneSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('phone');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  useIntersectionObserver(distanceSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('distance');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  useIntersectionObserver(supportSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('support');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  useIntersectionObserver(termsSectionRef, useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleSectionVisible('terms');
      }
    });
  }, [handleSectionVisible]), { threshold: 0.1 });

  const openTermsModal = useCallback(() => {
    logEvent('registration', 'open_terms_modal');
    setIsTermsOpen(true);
  }, []);

  const handleAcceptTerms = useCallback(() => {
    logEvent('registration', 'accept_terms');
    setHasReadTerms(true);
    setValue('terms', true);
    setIsTermsOpen(false);
  }, [setValue]);

  const onSubmit = async (data: RegistrationFormData) => {
    const startTime = performance.now();

    try {
      // Track form submission attempt
      logEvent('registration', 'form_submit_attempt', `${data.rol}_${data.afstand}`);

      setIsSubmitting(true);
      setSubmitError(null);
      
      const validatedData = validateForm(data);

      // Stap 1: Opslaan via backend API - Nieuwe schema (V28)
      try {
        // Eerst participant aanmaken
        const participantResponse = await apiClient.post(API_ENDPOINTS.participants, {
          naam: validatedData.naam,
          email: validatedData.email,
          telefoon: validatedData.telefoon,
          terms: validatedData.terms,
        });

        // Als er een event is, maak ook een event_registration aan
        // Gebruik de huidige event ID voor De Koninklijke Loop 2026
        const DKL_2026_EVENT_ID = '550e8400-e29b-41d4-a716-446655440000';
        if (participantResponse.id) {
          await apiClient.post(API_ENDPOINTS.eventRegistrations, {
            event_id: DKL_2026_EVENT_ID,
            participant_id: participantResponse.id,
            status_key: 'nieuw',
            participant_role_name: validatedData.rol,
            distance_route: validatedData.afstand,
            bijzonderheden: validatedData.bijzonderheden,
            notities: validatedData.ondersteuning !== 'Nee' ? `Ondersteuning: ${validatedData.ondersteuning}` : null,
          });
        }

        // Track successful database save
        logEvent('registration', 'database_save_success', `${validatedData.rol}_${validatedData.afstand}`);
      } catch (error: unknown) {
        // Handle specific error codes
        const axiosError = error as { response?: { status: number; data?: { error?: string } } };
        if (axiosError?.response?.status === 409 || axiosError?.response?.data?.error?.includes('duplicate')) {
          throw new Error('Je bent al ingeschreven met dit e-mailadres.');
        }
        if (axiosError?.response?.status === 400) {
          throw new Error('De ingevoerde gegevens zijn ongeldig. Controleer alle velden.');
        }
        if (axiosError?.response?.status === 500) {
          throw new Error('Er is een technische fout opgetreden. Probeer het later opnieuw.');
        }
        throw new Error('Er ging iets mis bij je aanmelding. Probeer het later opnieuw.');
      }

      // Stap 2: Verstuur bevestigingsmail via backend
      try {
        await sendAanmeldingEmail(validatedData);
        // Track successful email send
        logEvent('registration', 'email_send_success', `${validatedData.rol}_${validatedData.afstand}`);
      } catch (error) {
        // Email failure doesn't block registration
        console.error('Email send error:', error);
        logEvent('registration', 'email_send_failure', `${validatedData.rol}_${validatedData.afstand}`);
        toast.error('Je aanmelding is verwerkt, maar er was een probleem met de bevestigingsmail.');
      }

      // Track complete registration success
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      logEvent('registration', 'registration_complete', `${validatedData.rol}_${validatedData.afstand}_duration:${duration}ms`);

      // Ga door naar success pagina
      onSuccess(validatedData);
    } catch (error) {
      // Track form submission failure
      const errorMessage = error instanceof Error ? error.message : 'unknown_error';
      logEvent('registration', 'form_submit_failure', errorMessage);

      setSubmitError(error instanceof Error ? error.message : 'Er ging iets mis bij je aanmelding. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect om bijzonderheden te resetten als ondersteuning 'Nee' wordt
  useEffect(() => {
    if (selectedOndersteuning === 'Nee') {
      setValue('bijzonderheden', '');
    }
  }, [selectedOndersteuning, setValue]);

  return (
    <div className="p-6 sm:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
        aria-label="Registratieformulier voor De Koninklijke Loop 2026"
        noValidate
      >
        {/* Contactgegevens */}
        <section ref={contactSectionRef} className="space-y-6" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className={cn(cc.text.h2, 'text-gray-900 pb-4 relative', cc.typography.heading, 'after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-primary after:rounded')}>
            Je contactgegevens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="naam" className={cc.form.label}>
                Naam
              </label>
              <input
                type="text"
                id="naam"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400 bg-white',
                  cc.transition.colors,
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  errors.naam ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                )}
                placeholder="Vul je naam in"
                {...register('naam')}
                onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  register('naam').onChange(e);
                  if (e.target.value.length > 0) {
                    trackInteraction('input_interaction', 'naam_field');
                  }
                }, [trackInteraction, register])}
              />
              {errors.naam && (
                <p className={cn(cc.form.errorMessage)}>{errors.naam.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className={cc.form.label}>
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400 bg-white',
                  cc.transition.colors,
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                )}
                placeholder="Vul je e-mailadres in"
                {...register('email')}
                onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  register('email').onChange(e);
                  if (e.target.value.length > 0) {
                    trackInteraction('input_interaction', 'email_field');
                  }
                }, [trackInteraction, register])}
              />
              {errors.email && (
                <p className={cn(cc.form.errorMessage)}>{errors.email.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Rol sectie */}
        <section ref={roleSectionRef} className={cn('space-y-6 transition-opacity duration-300', 'opacity-100')} aria-labelledby="role-heading">
            <h2 id="role-heading" className={cn(cc.text.h2, 'text-gray-900 pb-4 relative', cc.typography.heading)}>
              Kies je rol
            </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Selecteer je rol">
            {['Deelnemer', 'Begeleider', 'Vrijwilliger'].map((role) => (
              <label key={role} className={cn('relative cursor-pointer')}>
                <input
                  type="radio"
                  value={role}
                  className={cn('peer', cc.a11y.srOnly)}
                  aria-label={`Rol: ${role}`}
                  {...register('rol')}
                />
                <div className={cn(
                  cc.flex.colCenter,
                  'justify-center p-6 rounded-xl border-2 border-gray-200 bg-white text-gray-900 min-h-[140px] group',
                  cc.transition.base,
                  'hover:shadow-md peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white'
                )}>
                  <span className={cn('text-4xl mb-3', cc.transition.transform, 'group-hover:scale-110')}>
                    {role === 'Deelnemer' ? '👥' : role === 'Begeleider' ? '🤝' : '💪'}
                  </span>
                  <span className="font-semibold text-center text-base">{role}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.rol && <p className={cn(cc.form.errorMessage)} role="alert">{errors.rol.message}</p>}
        </section>

        {/* Telefoonnummer sectie - alleen voor Begeleider/Vrijwilliger */}
        {shouldShowPhoneSection && (
          <section ref={phoneSectionRef} className="space-y-6 transition-opacity duration-300" aria-labelledby="phone-heading">
            <h2 id="phone-heading" className={cn(cc.text.h2, 'text-gray-900 pb-4 relative', cc.typography.heading)}>
              Contactgegevens voor tijdens het evenement
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className={cn(cc.text.body, 'text-blue-900 mb-2')}>
                  Waarom vragen we je telefoonnummer?
                </h3>
                <ul className={cn(cc.text.small, 'text-blue-800 space-y-2')}>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Voor snelle communicatie tijdens het evenement
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Om je te kunnen bereiken bij last-minute wijzigingen
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Voor coördinatie met andere vrijwilligers/begeleiders
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className={cn(cc.text.body, 'text-gray-900 mb-2')}>
                  Privacy waarborg
                </h3>
                <p className={cn(cc.text.small, 'text-gray-600')}>
                  Je telefoonnummer wordt alleen gebruikt voor communicatie rondom het evenement en wordt na afloop niet bewaard. We delen deze informatie nooit met derden.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="telefoon" className={cn(cc.form.label)}>
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  id="telefoon"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-primary/20 
                    text-gray-900 placeholder-gray-400 bg-white
                    border-gray-200 focus:border-primary"
                  placeholder="06 - "
                  {...register('telefoon')}
                  onChange={(e) => {
                    register('telefoon').onChange(e);
                    if (e.target.value.length > 0) {
                      logEvent('registration', 'input_interaction', 'telefoon_field');
                    }
                  }}
                />
                <p className={cn(cc.text.small, 'text-gray-500 mt-1')}>
                  Tip: Voeg een tweede nummer toe in het bijzonderheden veld als back-up
                </p>
              </div>

            </div>
          </section>
        )}

        {/* Afstand sectie - voor iedereen */}
        <section ref={distanceSectionRef} className={cn('space-y-6 transition-opacity duration-300', visibleSections.has('distance') ? 'opacity-100' : 'opacity-0')} aria-labelledby="distance-heading">
          <h2 id="distance-heading" className={cn(cc.text.h2, 'text-gray-900 pb-4 relative', cc.typography.heading)}>
            Kies je afstand
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="Selecteer je loopafstand">
            {['2.5 KM', '6 KM', '10 KM', '15 KM'].map((distance) => (
              <label key={distance} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={distance}
                  className="peer sr-only"
                  aria-label={`Afstand: ${distance}`}
                  {...register('afstand')}
                />
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200
                  bg-white transition-all hover:shadow-md
                  peer-checked:border-primary peer-checked:bg-primary
                  peer-checked:text-white text-gray-900
                  min-h-[140px] group">
                  <span className="text-4xl mb-3 transition-transform group-hover:scale-110">
                    {distance === '2.5 KM' ? '🚶' : distance === '6 KM' ? '🏃' : distance === '10 KM' ? '🏃‍♂️' : '🏃‍♀️'}
                  </span>
                  <span className="font-semibold text-center">{distance}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.afstand?.message && (
            <p className={cn(cc.form.errorMessage)} role="alert">{errors.afstand.message}</p>
          )}
        </section>

        {/* Ondersteuning sectie */}
        <section ref={supportSectionRef} className={cn('space-y-6 transition-opacity duration-300', visibleSections.has('support') ? 'opacity-100' : 'opacity-0')} aria-labelledby="support-heading">
          <h2 id="support-heading" className={cn(cc.text.h2, 'text-gray-900 pb-4 relative', cc.typography.heading)}>
            Heb je ondersteuning nodig?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Geef aan of je ondersteuning nodig hebt">
            {['Ja', 'Nee', 'Anders'].map((option) => (
              <label key={option} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  className="peer sr-only"
                  aria-label={`Ondersteuning: ${option}`}
                  {...register('ondersteuning')}
                />
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 
                  border-gray-200 bg-white transition-all hover:shadow-md 
                  peer-checked:border-primary peer-checked:bg-primary 
                  peer-checked:text-white text-gray-900
                  min-h-[140px] group">
                  <span className="text-4xl mb-3 transition-transform group-hover:scale-110">
                    {option === 'Ja' ? '✅' : option === 'Nee' ? '❌' : '❓'}
                  </span>
                  <span className="font-semibold text-center text-gray-900 peer-checked:text-white">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.ondersteuning?.message && (
            <p className={cn(cc.form.errorMessage)} role="alert">
              {errors.ondersteuning.message}
            </p>
          )}
        </section>

        {/* Bijzonderheden veld met verbeterde transitie */}
        <div className={`transition-all duration-300 ease-in-out ${
          showBijzonderheden 
            ? 'opacity-100 max-h-[500px] mt-6' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="space-y-2">
            <label htmlFor="bijzonderheden" className={cn(cc.form.label)}>
              {selectedOndersteuning === 'Ja'
                ? 'Beschrijf welke ondersteuning je nodig hebt'
                : 'Beschrijf je situatie'}
            </label>
            <textarea
              id="bijzonderheden"
              className="w-full px-4 py-3 rounded-xl border-2 transition-colors 
                focus:outline-none focus:ring-2 focus:ring-primary/20 
                text-gray-900 placeholder-gray-400 bg-white
                border-gray-200 focus:border-primary
                min-h-[100px] resize-y"
              placeholder={selectedOndersteuning === 'Ja' 
                ? "Beschrijf hier welke ondersteuning je nodig hebt..." 
                : "Beschrijf hier je situatie..."}
              {...register('bijzonderheden')}
              onChange={(e) => {
                register('bijzonderheden').onChange(e);
                if (e.target.value.length > 0) {
                  logEvent('registration', 'input_interaction', 'bijzonderheden_main_field');
                }
              }}
              aria-describedby={errors.bijzonderheden?.message ? 'bijzonderheden-error' : undefined}
            />
            {errors.bijzonderheden?.message && (
              <p id="bijzonderheden-error" className={cn(cc.form.errorMessage)} role="alert">
                {errors.bijzonderheden.message}
              </p>
            )}
          </div>
        </div>

        {/* Terms checkbox */}
        <section ref={termsSectionRef} className={cn('flex flex-col items-center pt-6 space-y-2 transition-opacity duration-300', visibleSections.has('terms') ? 'opacity-100' : 'opacity-0')} aria-labelledby="terms-heading">
          <h2 id="terms-heading" className={cn(cc.a11y.srOnly)}>Algemene voorwaarden</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2 text-center max-w-lg">
            <span className={cn(cc.text.small, 'text-gray-700')}>
              Je moet eerst de algemene voorwaarden lezen voordat je je kunt inschrijven.{' '}
              <button
                type="button"
                className={cn(colors.primary.text, 'underline hover:text-primary-dark', cc.text.small, cc.transition.colors)}
                onClick={openTermsModal}
              >
                Lees de Algemene Voorwaarden
              </button>
            </span>
          </div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              disabled={!hasReadTerms}
              className={cn(
                'w-5 h-5 rounded border-gray-300',
                hasReadTerms
                  ? cn(colors.primary.text, 'focus:ring-primary cursor-pointer')
                  : 'text-gray-300 cursor-not-allowed'
              )}
              {...register('terms')}
              onChange={(e) => {
                register('terms').onChange(e);
                if (e.target.checked) {
                  logEvent('registration', 'terms_checkbox_checked');
                }
              }}
            />
            <span className={cn(cc.text.small, !hasReadTerms ? 'text-gray-400' : 'text-gray-600')}>
              Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord
            </span>
          </label>
          {errors.terms?.message && (
            <p className={cn(cc.form.errorMessage, 'text-center')} role="alert">
              {errors.terms.message}
            </p>
          )}
        </section>

        {/* Error message */}
        {submitError && (
          <div className={cn('p-4 bg-red-50 border border-red-200 rounded-lg', cc.text.error)} role="alert" aria-live="polite">
            {submitError}
          </div>
        )}

        {/* Submit button met loading state */}
        <div className="mt-8 sm:mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full max-w-md mx-auto px-8 py-4 font-semibold text-white',
              cc.flex.center,
              cc.text.h5,
              colors.primary.bg,
              cc.border.circle,
              colors.primary.hover,
              cc.transition.base,
              'hover:-translate-y-0.5',
              cc.shadow.lg,
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
              'active:bg-primary-dark',
              colors.primary.focusRing
            )}
            onClick={useCallback(() => {
              if (!isSubmitting) {
                trackInteraction('submit_button_click', 'form_submit_attempt');
              }
            }, [isSubmitting, trackInteraction])}
          >
            {isSubmitting ? (
              <>
                <svg className={cn('animate-spin -ml-1 mr-3 h-5 w-5 text-white')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className={cn('opacity-25')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className={cn('opacity-75')} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bezig met inschrijven...
              </>
            ) : (
              'Inschrijven'
            )}
          </button>
        </div>
      </form>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => {
          logEvent('registration', 'close_terms_modal', 'without_accepting');
          setIsTermsOpen(false);
        }}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
});

FormContainer.displayName = 'FormContainer';

export default FormContainer;