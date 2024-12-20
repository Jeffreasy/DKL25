import { useState } from 'react';
import { useAanmeldForm } from '../hooks/useAanmeldForm';
import { TermsModal } from '../components/TermsModal';
import { SuccessMessage } from './SuccessMessage';

export const FormContainer = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const {
    form,
    isSubmitting,
    showSuccess,
    showError,
    showTelefoon,
    showBijzonderheden,
    onSubmit
  } = useAanmeldForm();

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch
  } = form;

  const selectedRole = watch('rol');
  const selectedDistance = watch('afstand');
  const selectedSupport = watch('ondersteuning');

  const submitHandler = handleSubmit(onSubmit);

  if (showSuccess) {
    return <SuccessMessage 
      data={{
        ...form.getValues(),
        telefoon: form.getValues().telefoon || '',
        bijzonderheden: form.getValues().bijzonderheden || ''
      }} 
    />;
  }

  return (
    <div className="w-full max-w-[900px] mx-auto my-16 p-12 bg-white rounded-xl shadow-lg text-gray-900">
      <form onSubmit={submitHandler} className="space-y-12">
        {/* Contactgegevens */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 relative
            after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-12 after:h-1 after:bg-primary">
            Je contactgegevens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Naam
              </label>
              <input
                type="text"
                {...register('naam')}
                className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900 
                  ${errors.naam ? 'border-red-500' : 'border-gray-200'}
                  hover:border-primary focus:border-primary focus:ring-2 
                  focus:ring-primary/20 transition-all
                  placeholder:text-gray-400`}
                placeholder="Vul je naam in"
              />
              {errors.naam && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.naam.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900
                  ${errors.email ? 'border-red-500' : 'border-gray-200'}
                  hover:border-primary focus:border-primary focus:ring-2 
                  focus:ring-primary/20 transition-all
                  placeholder:text-gray-400`}
                placeholder="Vul je e-mailadres in"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rol sectie */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 relative
            after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-12 after:h-1 after:bg-primary">
            Kies je rol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: 'Deelnemer', icon: '👥' },
              { value: 'Begeleider', icon: '🥢' },
              { value: 'Vrijwilliger', icon: '🤝' }
            ].map(({ value, icon }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('rol')}
                  className="peer sr-only"
                />
                <div className={`flex flex-col items-center justify-center p-8 rounded-xl 
                  border border-gray-200 transition-all
                  ${selectedRole === value ? 'bg-primary/10 border-primary' : 'bg-white'}
                  hover:border-primary/50`}
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <span className="font-medium text-center">{value}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Telefoonveld direct onder rol selectie */}
          {showTelefoon && (
            <div className="mt-8">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Waarom vragen we je telefoonnummer?</span><br />
                  Als begeleider/vrijwilliger ben je een belangrijke schakel tijdens het evenement. 
                  We gebruiken je telefoonnummer alleen om contact met je op te nemen over:
                  <ul className="mt-2 ml-4 list-disc">
                    <li>Laatste updates voor het evenement</li>
                    <li>Belangrijke informatie op de dag zelf</li>
                    <li>Noodgevallen tijdens het evenement</li>
                  </ul>
                </p>
              </div>
              <div className="max-w-md">
                <label className="block text-gray-700 font-semibold mb-2">
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  {...register('telefoon')}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900
                    ${errors.telefoon ? 'border-red-500' : 'border-gray-200'}
                    hover:border-primary focus:border-primary focus:ring-2 
                    focus:ring-primary/20 transition-all
                    placeholder:text-gray-400`}
                  placeholder="Vul je telefoonnummer in"
                />
                {errors.telefoon && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.telefoon.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Afstand sectie */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 relative
            after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-12 after:h-1 after:bg-primary">
            Kies je afstand
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '2.5 KM', icon: '🚶', label: '2.5 KM' },
              { value: '6 KM', icon: '🏃', label: '6 KM' },
              { value: '10 KM', icon: '🏃‍♂️', label: '10 KM' },
              { value: '15 KM', icon: '🏃‍♀️', label: '15 KM' }
            ].map(({ value, icon, label }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('afstand')}
                  className="peer sr-only"
                />
                <div className={`flex flex-col items-center justify-center p-8 rounded-xl 
                  border border-gray-200 transition-all
                  ${selectedDistance === value ? 'bg-primary/10 border-primary' : 'bg-white'}
                  hover:border-primary/50`}
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <span className="font-medium text-center">{label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Ondersteuning sectie */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 relative
            after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-12 after:h-1 after:bg-primary">
            Heb je ondersteuning nodig?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: 'Ja', icon: '✅', label: 'Ja' },
              { value: 'Nee', icon: '❌', label: 'Nee' },
              { value: 'Anders', icon: '❓', label: 'Anders' }
            ].map(({ value, icon, label }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('ondersteuning')}
                  className="peer sr-only"
                />
                <div className={`flex flex-col items-center justify-center p-8 rounded-xl 
                  border border-gray-200 transition-all
                  ${selectedSupport === value ? 'bg-primary/10 border-primary' : 'bg-white'}
                  hover:border-primary/50`}
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <span className="font-medium text-center">{label}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Bijzonderheden veld */}
          {showBijzonderheden && (
            <div className="mt-8">
              <label className="block text-gray-700 font-semibold mb-2">
                Bijzonderheden
              </label>
              <textarea
                {...register('bijzonderheden')}
                className="w-full min-h-[140px] px-5 py-4 rounded-xl border-2 text-gray-900
                  border-gray-200 hover:border-primary focus:border-primary focus:ring-2 
                  focus:ring-primary/20 transition-all resize-y
                  placeholder:text-gray-400"
                placeholder="Vul hier uw bijzonderheden in..."
              />
            </div>
          )}
        </div>

        {/* Terms & Submit sectie */}
        <div className="flex flex-col items-center space-y-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('terms')}
              className="w-5 h-5 rounded border-2 border-gray-200 
                text-primary focus:ring-2 focus:ring-primary/20 transition-all
                checked:bg-primary checked:border-primary
                group-hover:border-primary/50"
            />
            <span className="text-gray-700 select-none">
              Ik ga akkoord met de{' '}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-primary hover:text-primary-dark font-medium 
                  underline-offset-2 hover:underline focus:outline-none 
                  focus:ring-2 focus:ring-primary/20 rounded-sm
                  transition-colors"
              >
                Algemene Voorwaarden
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[350px] px-8 py-5 bg-primary text-white font-semibold 
              rounded-xl hover:bg-primary-dark transform hover:-translate-y-1 
              hover:shadow-lg transition-all disabled:opacity-50 
              disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Bezig met verzenden...' : 'Inschrijven'}
          </button>
        </div>
      </form>

      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setValue('terms', true);
          setIsTermsModalOpen(false);
        }}
      />

      {showError && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600 font-medium">
                Er is iets misgegaan bij het versturen van je inschrijving. Probeer het later opnieuw.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};