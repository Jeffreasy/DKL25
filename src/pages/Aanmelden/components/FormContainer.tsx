import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, type RegistrationFormData, validateForm } from '../types/schema';
import { TermsModal } from './TermsModal';
import { supabase } from '../../../lib/supabase';
import { sendConfirmationEmail } from '../../../utils/emailService';

export const FormContainer: React.FC<{ onSuccess: (data: RegistrationFormData) => void }> = ({ 
  onSuccess 
}) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasReadTerms, setHasReadTerms] = useState(false);

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

  const showBijzonderheden = selectedOndersteuning === 'Ja' || selectedOndersteuning === 'Anders';

  const handleAcceptTerms = () => {
    setHasReadTerms(true);
    setValue('terms', true);
    setIsTermsOpen(false);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      console.log('Form submitted with data:', data);
      setIsSubmitting(true);
      setSubmitError(null);
      
      const validatedData = validateForm(data);

      // 1. Sla op in Supabase
      const { data: registration, error: supabaseError } = await supabase
        .from('aanmeldingen')
        .insert([{
          naam: validatedData.naam,
          email: validatedData.email,
          telefoon: validatedData.telefoon,
          rol: validatedData.rol,
          afstand: validatedData.afstand,
          ondersteuning: validatedData.ondersteuning,
          bijzonderheden: validatedData.bijzonderheden,
          terms: validatedData.terms,
          email_verzonden: false // Zet initieel op false
        }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // 2. Verstuur bevestigingsmail
      const baseUrl = import.meta.env.PROD 
        ? 'https://www.dekoninklijkeloop.nl'
        : '';
      const apiUrl = `${baseUrl}/api/email/send-confirmation`;

      await sendConfirmationEmail(validatedData, apiUrl);

      // 3. Update de email_verzonden status in Supabase
      const { error: updateError } = await supabase
        .from('aanmeldingen')
        .update({ 
          email_verzonden: true,
          email_verzonden_op: new Date().toISOString()
        })
        .eq('id', registration.id);

      if (updateError) {
        console.error('Error updating email status:', updateError);
        // Niet blokkeren voor de gebruiker als dit mislukt
      }

      onSuccess(validatedData);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Er ging iets mis bij je aanmelding');
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
        onSubmit={(e) => {
          console.log('Form submit triggered'); // Debug log
          handleSubmit(onSubmit)(e);
        }} 
        className="space-y-10"
      >
        {/* Contactgegevens */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-4 relative font-heading after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff9328] after:rounded">
            Je contactgegevens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="naam" className="block text-sm font-medium text-gray-700">
                Naam
              </label>
              <input
                type="text"
                id="naam"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9328]/20 
                  text-gray-900 placeholder-gray-400 bg-white
                  ${errors.naam ? 'border-red-500' : 'border-gray-200 focus:border-[#ff9328]'}`}
                placeholder="Vul je naam in"
                {...register('naam')}
              />
              {errors.naam && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.naam.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-[#ff9328]/20 
                  text-gray-900 placeholder-gray-400 bg-white
                  ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#ff9328]'}`}
                placeholder="Vul je e-mailadres in"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Rol sectie */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-4 relative font-heading after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff9328] after:rounded">
            Kies je rol
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Deelnemer', 'Begeleider', 'Vrijwilliger'].map((role) => (
              <label key={role} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={role}
                  className="peer sr-only"
                  {...register('rol')}
                />
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 
                  bg-white transition-all hover:shadow-md 
                  peer-checked:border-[#ff9328] peer-checked:bg-[#ff9328] 
                  peer-checked:text-white text-gray-900
                  min-h-[140px] group">
                  <span className="text-4xl mb-3 transition-transform group-hover:scale-110">
                    {role === 'Deelnemer' ? '👥' : role === 'Begeleider' ? '🤝' : '💪'}
                  </span>
                  <span className="font-semibold text-center text-base">{role}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.rol && (
            <p className="text-sm text-red-500 mt-1 font-medium">{errors.rol.message}</p>
          )}
        </div>

        {/* Telefoonnummer sectie - alleen voor Begeleider/Vrijwilliger */}
        {(selectedRole === 'Begeleider' || selectedRole === 'Vrijwilliger') && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-4 relative font-heading after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff9328] after:rounded">
              Contactgegevens voor tijdens het evenement
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-blue-900 mb-2">
                  Waarom vragen we je telefoonnummer?
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff9328] mr-2">•</span>
                    Voor snelle communicatie tijdens het evenement
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff9328] mr-2">•</span>
                    Om je te kunnen bereiken bij last-minute wijzigingen
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff9328] mr-2">•</span>
                    Voor coördinatie met andere vrijwilligers/begeleiders
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Privacy waarborg
                </h3>
                <p className="text-sm text-gray-600">
                  Je telefoonnummer wordt alleen gebruikt voor communicatie rondom het evenement en wordt na afloop niet bewaard. We delen deze informatie nooit met derden.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700">
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  id="telefoon"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-[#ff9328]/20 
                    text-gray-900 placeholder-gray-400 bg-white
                    border-gray-200 focus:border-[#ff9328]"
                  placeholder="06 - "
                  {...register('telefoon')}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Voeg een tweede nummer toe in het bijzonderheden veld als back-up
                </p>
              </div>

              <div className={`mt-4 transition-all duration-300 ${showBijzonderheden ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <label htmlFor="bijzonderheden" className="block text-sm font-medium text-gray-700">
                  {selectedOndersteuning === 'Ja' ? 'Beschrijf welke ondersteuning je nodig hebt' : 'Beschrijf je situatie'}
                </label>
                <textarea
                  id="bijzonderheden"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-[#ff9328]/20 
                    text-gray-900 placeholder-gray-400 bg-white
                    border-gray-200 focus:border-[#ff9328]
                    min-h-[100px] resize-y"
                  placeholder={selectedOndersteuning === 'Ja' 
                    ? "Beschrijf hier welke ondersteuning je nodig hebt..." 
                    : "Beschrijf hier je situatie..."}
                  {...register('bijzonderheden')}
                  required={showBijzonderheden}
                />
                {errors.bijzonderheden && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bijzonderheden.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Afstand sectie - voor iedereen */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-4 relative font-heading after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff9328] after:rounded">
            Kies je afstand
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['2.5 KM', '6 KM', '10 KM', '15 KM'].map((distance) => (
              <label key={distance} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={distance}
                  className="peer sr-only"
                  {...register('afstand')}
                />
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 
                  bg-white transition-all hover:shadow-md 
                  peer-checked:border-[#ff9328] peer-checked:bg-[#ff9328] 
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
          {errors.afstand && (
            <p className="text-sm text-red-500 mt-1 font-medium">{errors.afstand.message}</p>
          )}
        </div>

        {/* Ondersteuning sectie */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-4 relative font-heading after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff9328] after:rounded">
            Heb je ondersteuning nodig?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Ja', 'Nee', 'Anders'].map((option) => (
              <label key={option} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  className="peer sr-only"
                  {...register('ondersteuning', {
                    onChange: (e) => {
                      // Extra logging om te zien wat er gebeurt
                      console.log('Ondersteuning changed:', e.target.value);
                    }
                  })}
                />
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 
                  border-gray-200 bg-white transition-all hover:shadow-md 
                  peer-checked:border-[#ff9328] peer-checked:bg-[#ff9328] 
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
          {errors.ondersteuning && (
            <p className="text-sm text-red-500 mt-1 font-medium">
              {errors.ondersteuning.message?.toString()}
            </p>
          )}
        </div>

        {/* Bijzonderheden veld met verbeterde transitie */}
        <div className={`transition-all duration-300 ease-in-out ${
          showBijzonderheden 
            ? 'opacity-100 max-h-[500px] mt-6' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="space-y-2">
            <label htmlFor="bijzonderheden" className="block text-sm font-medium text-gray-700">
              {selectedOndersteuning === 'Ja' 
                ? 'Beschrijf welke ondersteuning je nodig hebt'
                : 'Beschrijf je situatie'}
            </label>
            <textarea
              id="bijzonderheden"
              className="w-full px-4 py-3 rounded-xl border-2 transition-colors 
                focus:outline-none focus:ring-2 focus:ring-[#ff9328]/20 
                text-gray-900 placeholder-gray-400 bg-white
                border-gray-200 focus:border-[#ff9328]
                min-h-[100px] resize-y"
              placeholder={selectedOndersteuning === 'Ja' 
                ? "Beschrijf hier welke ondersteuning je nodig hebt..." 
                : "Beschrijf hier je situatie..."}
              {...register('bijzonderheden')}
            />
            {errors.bijzonderheden && (
              <p className="text-sm text-red-500 mt-1">
                {errors.bijzonderheden.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex justify-center pt-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              disabled={!hasReadTerms}
              className={`w-5 h-5 rounded border-gray-300 
                ${hasReadTerms 
                  ? 'text-[#ff9328] focus:ring-[#ff9328] cursor-pointer' 
                  : 'text-gray-300 cursor-not-allowed'
                }`}
              {...register('terms')}
            />
            <span className="text-sm text-gray-600">
              Ik ga akkoord met de{' '}
              <button
                type="button"
                className="text-[#ff9328] underline hover:text-[#e67f1c] font-medium"
                onClick={() => setIsTermsOpen(true)}
              >
                Algemene Voorwaarden
              </button>
            </span>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500 text-center mt-2 font-medium">
            {errors.terms.message}
          </p>
        )}

        {/* Error message */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {submitError}
          </div>
        )}

        {/* Submit button met loading state */}
        <div className="mt-8 sm:mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-md mx-auto flex justify-center items-center px-8 py-4 
              text-lg font-semibold text-white bg-[#ff9328] rounded-full 
              hover:bg-[#e67f1c] transition-all duration-300 
              hover:-translate-y-0.5 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
              active:bg-[#d97919]
              focus:outline-none focus:ring-2 focus:ring-[#ff9328] focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        onClose={() => setIsTermsOpen(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};