import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlgemeneVoorwaardenModal from '@/components/modals/AlgemeneVoorwaardenModal';
import { createInschrijving } from '@/services/inschrijvingService';
import { submitToMake } from '@/services/makeWebhookService';
import type { Inschrijving } from '@/types/inschrijving';

const InschrijfForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<Inschrijving, 'id' | 'created_at' | 'status'>>({
    naam: '',
    email: '',
    rol: 'Deelnemer',
    afstand: '2.5 KM',
    ondersteuning: 'Nee',
    bijzonderheden: '',
    telefoon: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showVoorwaarden, setShowVoorwaarden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terms) {
      alert('Je moet akkoord gaan met de algemene voorwaarden');
      return;
    }

    setIsSubmitting(true);
    try {
      // Eerst naar Supabase
      const result = await createInschrijving(formData);
      
      try {
        // Dan naar Make webhook
        await submitToMake({
          ...formData,
          inschrijvingId: result.id,
          inschrijvingDatum: new Date().toISOString(),
          eventDatum: '2024-05-18',
          eventNaam: 'Koninklijke Loop 2024'
        });

        // Als we hier komen is alles gelukt
        console.log('Inschrijving succesvol:', result);
        setShowSuccess(true);
        
      } catch (makeError) {
        // Als Make faalt, loggen we het maar laten we de inschrijving wel doorgaan
        console.warn('Make webhook failed but registration succeeded:', makeError);
        setShowSuccess(true); // Nog steeds succesvol omdat de database opslag gelukt is
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setTerms((e.target as HTMLInputElement).checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder-gray-500";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary/20">
            Je contactgegevens
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-2">
                Naam
              </label>
              <input
                type="text"
                id="naam"
                name="naam"
                value={formData.naam}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Vul je naam in"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Vul je e-mailadres in"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary/20">
            Kies je rol
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: 'Deelnemer', icon: '👥', label: 'Deelnemer' },
              { value: 'Begeleider', icon: '🤝', label: 'Begeleider' },
              { value: 'Vrijwilliger', icon: '🌟', label: 'Vrijwilliger' }
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.rol === option.value 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 hover:border-primary/50'}`}
              >
                <input
                  type="radio"
                  name="rol"
                  value={option.value}
                  checked={formData.rol === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-3">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary/20">
            Kies je afstand
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '2.5 KM', icon: '🚶', label: '2.5 KM', subtitle: 'Kidsrun' },
              { value: '6 KM', icon: '🏃', label: '6 KM' },
              { value: '10 KM', icon: '🏃‍♂️', label: '10 KM' },
              { value: '15 KM', icon: '🏃‍♀️', label: '15 KM' }
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.afstand === option.value 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 hover:border-primary/50'}`}
              >
                <input
                  type="radio"
                  name="afstand"
                  value={option.value}
                  checked={formData.afstand === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-3">{option.icon}</span>
                <span className="font-medium text-gray-900 mb-1">{option.label}</span>
                {option.subtitle && (
                  <span className="text-sm text-gray-500">{option.subtitle}</span>
                )}
              </label>
            ))}
          </div>
          <p className="text-center mt-4 text-gray-600 italic">
            Deelname aan het evenement is gratis!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary/20">
            Heb je ondersteuning nodig?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: 'Nee', icon: '✨', label: 'Nee', description: 'Ik kan zelfstandig deelnemen' },
              { value: 'Ja', icon: '🤝', label: 'Ja', description: 'Ik heb begeleiding nodig' },
              { value: 'Anders', icon: '❓', label: 'Anders', description: 'Ik wil dit graag bespreken' }
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.ondersteuning === option.value 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 hover:border-primary/50'}`}
              >
                <input
                  type="radio"
                  name="ondersteuning"
                  value={option.value}
                  checked={formData.ondersteuning === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-3">{option.icon}</span>
                <span className="font-medium text-gray-900 mb-2">{option.label}</span>
                <span className="text-sm text-gray-500 text-center">{option.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {formData.ondersteuning !== 'Nee' && (
            <div className="mb-12">
              <label htmlFor="bijzonderheden" className="block text-sm font-medium text-gray-700 mb-2">
                Bijzonderheden
              </label>
              <textarea
                id="bijzonderheden"
                name="bijzonderheden"
                value={formData.bijzonderheden}
                onChange={handleInputChange}
                className={`${inputClasses} min-h-[120px]`}
                placeholder="Beschrijf hier je specifieke ondersteuningsbehoefte..."
              />
            </div>
          )}

          {(formData.rol === 'Vrijwilliger' || formData.rol === 'Begeleider') && (
            <div className="mt-8 p-6 bg-orange-50/50 rounded-xl border border-primary/10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Extra informatie voor {formData.rol}s
              </h3>
              
              <div className="mb-6">
                <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  id="telefoon"
                  name="telefoon"
                  value={formData.telefoon || ''}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Bijv. 06-12345678"
                />
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Je telefoonnummer maakt snelle communicatie mogelijk tijdens het evenement, bijvoorbeeld bij last-minute wijzigingen of coördinatie.
                  </span>
                </p>

                {formData.rol === 'Vrijwilliger' && (
                  <>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        We gebruiken dit om je te informeren over je taken, briefing momenten en eventuele voorbereidende bijeenkomsten.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Bij calamiteiten kunnen we je snel bereiken en instrueren over wat te doen.
                      </span>
                    </p>
                  </>
                )}

                {formData.rol === 'Begeleider' && (
                  <>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Als begeleider kun je worden gekoppeld aan een deelnemer - directe communicatie maakt de afstemming vooraf makkelijker.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        We kunnen je informeren over specifieke behoeften of aandachtspunten van de deelnemer die je gaat begeleiden.
                      </span>
                    </p>
                  </>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  * Je telefoonnummer wordt alleen gebruikt voor communicatie rondom het evenement en wordt daarna verwijderd.
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="terms"
                checked={terms}
                onChange={handleInputChange}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                required
              />
              <span className="text-sm text-gray-600">
                Ik ga akkoord met de{' '}
                <button 
                  type="button" 
                  onClick={() => setShowVoorwaarden(true)}
                  className="text-primary underline hover:text-primary-dark"
                >
                  algemene voorwaarden
                </button>
              </span>
            </label>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white 
                font-semibold rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                min-w-[200px]
                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Bezig met inschrijven...</span>
                </>
              ) : (
                <>
                  <span>Inschrijven</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-slideIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bedankt voor je inschrijving!
                </h2>
                <p className="text-gray-600">
                  Je inschrijving voor de Koninklijke loop op 17 mei 2025 is succesvol ontvangen.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Jouw inschrijfgegevens:</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Naam:</dt>
                    <dd className="font-medium">{formData.naam}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">E-mail:</dt>
                    <dd className="font-medium">{formData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Rol:</dt>
                    <dd className="font-medium">{formData.rol}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Afstand:</dt>
                    <dd className="font-medium">{formData.afstand}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Naar homepage
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Print bevestiging
                </button>
              </div>
            </div>
          </div>
        )}

        {showError && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            Oeps! Er is iets misgegaan bij het versturen van je inschrijving.
          </div>
        )}

        <AlgemeneVoorwaardenModal
          isOpen={showVoorwaarden}
          onClose={() => setShowVoorwaarden(false)}
        />
      </form>
    </div>
  );
};

export default InschrijfForm; 