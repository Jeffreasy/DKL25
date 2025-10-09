import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaEnvelope, FaClock } from 'react-icons/fa';
import { SEO } from './SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';
import Countdown from 'react-countdown'; // Voor countdown timer

const OnderConstructie: React.FC = () => {
  const { data, loading, error } = useUnderConstruction();

  if (loading) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
          noIndex={true} // Voorkom indexing tijdens onderhoud
        />
        <div className="min-h-screen pt-20 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-56 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
          noIndex={true}
        />
        <div className="min-h-screen pt-20 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Fout bij laden</h1>
                <p className="text-gray-600">Er is een probleem opgetreden bij het laden van de pagina.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-primary font-semibold hover:underline"
                  aria-label="Probeer opnieuw"
                >
                  Probeer opnieuw
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Countdown renderer
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <p className="text-gray-600 font-body">We zijn bijna klaar!</p>;
    }
    return (
      <div className="flex gap-4 justify-center mb-4" aria-label="Countdown tot lancering">
        <div className="text-center">
          <span className="block text-lg font-bold text-primary">{days}</span>
          <span className="text-sm text-gray-600">Dagen</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-primary">{hours}</span>
          <span className="text-sm text-gray-600">Uren</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-primary">{minutes}</span>
          <span className="text-sm text-gray-600">Minuten</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-primary">{seconds}</span>
          <span className="text-sm text-gray-600">Seconden</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        route="/onder-constructie"
        title={`${data.title} - De Koninklijke Loop`}
        description={data.message}
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-roboto antialiased">
        <div className="w-full max-w-4xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Logo */}
            {data.logo_url && (
              <div className="flex justify-center mb-6">
                <img
                  src={data.logo_url}
                  alt="De Koninklijke Loop Logo"
                  className="h-20 w-auto"
                />
              </div>
            )}
            <div className="flex justify-center mb-6">
              <FaTools className="w-16 h-16 text-primary" aria-label="Onder constructie" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight font-heading leading-tight">
              {data.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-body max-w-2xl mx-auto leading-relaxed">
              {data.message}
            </p>
            {/* Countdown Timer */}
            {data.expected_date && (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FaClock className="w-6 h-6 text-primary" aria-hidden="true" />
                  <span className="text-lg font-semibold text-gray-700">
                    Verwachte lancering
                  </span>
                </div>
                <Countdown date={data.expected_date} renderer={countdownRenderer} />
              </div>
            )}
            {/* Progress Bar */}
            {data.progress_percentage !== null && (
              <div className="mb-6 max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${data.progress_percentage}%` }}
                    role="progressbar"
                    aria-valuenow={data.progress_percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <p className="text-base text-gray-600 mt-2">
                  Voortgang: {data.progress_percentage}%
                </p>
              </div>
            )}
            {/* Social Links */}
            {data.social_links && data.social_links.length > 0 && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 font-semibold mb-4">Volg ons</p>
                <div className="flex justify-center gap-6">
                  {data.social_links.map((link: { platform: string; url: string }) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-indigo-700 transition-colors"
                      aria-label={`Volg ons op ${link.platform}`}
                    >
                      {link.platform === 'Twitter' && (
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {link.platform === 'Instagram' && (
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Contact Email */}
            {data.contact_email && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 font-semibold mb-4">Neem contact op</p>
                <a
                  href={`mailto:${data.contact_email}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-indigo-700 transition-colors text-lg"
                  aria-label="Contacteer ons via email"
                >
                  <FaEnvelope className="w-6 h-6" aria-hidden="true" />
                  <span>{data.contact_email}</span>
                </a>
              </div>
            )}
            {/* Nieuwsbrief Signup */}
            {data.newsletter_enabled && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 font-semibold mb-4">
                  Blijf op de hoogte
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Nieuwsbrief signup nog te implementeren!');
                  }}
                  className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="Vul je emailadres in"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                    aria-label="Emailadres voor nieuwsbrief"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold"
                    aria-label="Aanmelden voor nieuwsbrief"
                  >
                    Aanmelden
                  </button>
                </form>
              </div>
            )}
            <p className="text-lg sm:text-xl text-primary font-semibold font-body">
              {data.footer_text}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OnderConstructie;