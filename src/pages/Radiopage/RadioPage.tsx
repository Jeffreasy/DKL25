import React from 'react';
import { RadioGallery } from '@/components';
import { Helmet } from 'react-helmet-async';

const RadioPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Radio Uitzendingen | De Koninklijke Loop</title>
        <meta
          name="description"
          content="Luister naar de radio-uitzendingen van De Koninklijke Loop. Herbeleef de sfeer en enthousiasme van voorgaande edities."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-orange-100 py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans" style={{fontFamily: "'Montserrat', sans-serif"}}>
              Radio Uitzendingen
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-sans" style={{fontFamily: "'Open Sans', sans-serif"}}>
              Herbeleef de sfeer en enthousiasme van De Koninklijke Loop door onze radio-uitzendingen te beluisteren.
            </p>
          </div>
        </div>

        {/* Radio Gallery */}
        <RadioGallery 
          title="Radio Uitzendingen 2024"
          subtitle="Luister naar fragmenten van onze live radio-uitzending tijdens De Koninklijke Loop 2024"
        />

        {/* Additional Content */}
        <div className="max-w-4xl mx-auto py-16 px-5">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-sans" style={{fontFamily: "'Montserrat', sans-serif"}}>
            Over Onze Radio Uitzendingen
          </h2>
          <div className="prose prose-lg max-w-none" style={{fontFamily: "'Open Sans', sans-serif"}}>
            <p>
              Tijdens De Koninklijke Loop verzorgen we een live radio-uitzending om de sfeer van het evenement vast te leggen en te delen met iedereen die niet fysiek aanwezig kan zijn.
            </p>
            <p>
              Onze radio-uitzendingen bevatten interviews met deelnemers, vrijwilligers en organisatoren, sfeerimpressies vanaf de route, en natuurlijk muziek om iedereen te motiveren.
            </p>
            <p>
              Door de fragmenten op deze pagina te beluisteren, krijg je een indruk van hoe een dag bij De Koninklijke Loop eruitziet en wat voor bijzondere momenten er plaatsvinden.
            </p>
            <p>
              Wil je zelf meehelpen bij onze radio-uitzending van de volgende editie? Neem dan <a href="/contact" className="text-primary hover:text-primary-dark underline">contact</a> met ons op!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RadioPage; 