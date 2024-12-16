import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlgemeneVoorwaardenModal from '@/components/modals/AlgemeneVoorwaardenModal';
import { createInschrijving, checkEmailExists } from '@/services/inschrijvingService';
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
  const [emailError, setEmailError] = useState<string>('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        setDebouncedEmail(formData.email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    if (debouncedEmail) {
      handleEmailCheck(debouncedEmail);
    }
  }, [debouncedEmail]);

  const handleEmailCheck = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    setIsCheckingEmail(true);
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailError('Dit e-mailadres is al geregistreerd voor dit evenement');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terms) {
      alert('Je moet akkoord gaan met de algemene voorwaarden');
      return;
    }

    if (emailError) {
      alert('Dit e-mailadres is al geregistreerd');
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

      // Check email wanneer het email veld wordt aangepast
      if (name === 'email') {
        handleEmailCheck(value);
      }
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
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${emailError ? 'border-red-500' : ''}`}
                  placeholder="Vul je e-mailadres in"
                  required
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">
                  {emailError}
                </p>
              )}
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
                <h3 className="font-semibold text-gray-900 mb-4">Jouw inschrijfgegevens:</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600 font-medium">Naam:</dt>
                    <dd className="text-gray-900 font-medium">{formData.naam}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600 font-medium">E-mail:</dt>
                    <dd className="text-gray-900 font-medium">{formData.email}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600 font-medium">Rol:</dt>
                    <dd className="text-gray-900 font-medium">{formData.rol}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600 font-medium">Afstand:</dt>
                    <dd className="text-gray-900 font-medium">{formData.afstand}</dd>
                  </div>
                </dl>
              </div>

              <div className="text-center mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Volg ons op sociale media
                </h3>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4267B2] text-white hover:opacity-90 transition-opacity"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/koninklijkeloop/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E1306C] text-white hover:opacity-90 transition-opacity"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.64.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12S0,15.67.07,17c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@DeKoninklijkeLoop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF0000] text-white hover:opacity-90 transition-opacity"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.12C19.54,3.5,12,3.5,12,3.5s-7.54,0-9.38.57A3.02,3.02,0,0,0,.5,6.19C0,8.03,0,12,0,12s0,3.97.5,5.81a3.02,3.02,0,0,0,2.12,2.12C4.46,20.5,12,20.5,12,20.5s7.54,0,9.38-.57a3.02,3.02,0,0,0,2.12-2.12C24,15.97,24,12,24,12S24,8.03,23.5,6.19ZM9.5,15.5v-7l6,3.5Z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/dekoninklijkeloop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M9,17H6.5v-7H9V17z M7.7,8.7c-0.8,0-1.4-0.7-1.4-1.4c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4C9.1,8.1,8.5,8.7,7.7,8.7z M18,17h-2.4v-3.8c0-1.1,0-2.5-1.5-2.5s-1.8,1.2-1.8,2.4V17h-2.4v-7h2.3v1h0c0.4-0.7,1.3-1.5,2.7-1.5c2.9,0,3.4,1.9,3.4,4.3V17z"/>
                    </svg>
                  </a>
                </div>
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