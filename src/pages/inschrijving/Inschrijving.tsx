import React from 'react';
import InschrijfForm from './components/InschrijfForm';

const Inschrijving: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50/90">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Inschrijven voor de Koninklijke Loop
        </h1>
        <p className="text-xl text-gray-600">
          Doe mee aan dit bijzondere evenement en steun een goed doel
        </p>
      </div>

      {/* Info Cards */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Beschikbare Afstanden Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Beschikbare Afstanden
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                2.5 km
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                6 km
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                10 km
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                15 km
              </li>
            </ul>
          </div>

          {/* Inschrijving Includes Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Inschrijving Includes
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Medaille voor alle finishers
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Verzorgingsposten onderweg
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Rustplekken langs de route
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Vervoer naar startlocatie
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Rolstoelvriendelijke route
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Inschrijf Form */}
      <InschrijfForm />
    </div>
  );
};

export default Inschrijving;