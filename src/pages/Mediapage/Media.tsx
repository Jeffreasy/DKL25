import React, { useEffect } from 'react';
import RadioGallery from '@/components/sections/Radio/RadioGallery';
import { Helmet } from 'react-helmet-async';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';

const MediaPage: React.FC = () => {
  useEffect(() => {
    trackEvent('media', 'page_view', 'media_page');
  }, []);

  return (
    <>
      <SEO 
        title="Media Archief | De Koninklijke Loop (DKL)"
        description="Bekijk en beluister media van De Koninklijke Loop. Herbeleef de sfeer en enthousiasme van voorgaande edities via radiofragmenten en meer."
        route="/media"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-orange-100 py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans" style={{fontFamily: "'Montserrat', sans-serif"}}>
              Media Archief
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-sans" style={{fontFamily: "'Open Sans', sans-serif"}}>
              Herbeleef de sfeer en enthousiasme van De Koninklijke Loop via onze media fragmenten.
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
            Waarom Media?
          </h2>
          <div className="prose prose-lg max-w-none" style={{fontFamily: "'Open Sans', sans-serif"}}>
            <p>
              Waarom hoor je De Koninklijke Loop op de radio? We gebruiken de ether om iedereen te laten weten waarom we dit bijzondere evenement organiseren: een sponsorloop vóór en dóór mensen met een beperking. We hopen hiermee natuurlijk ook jou enthousiast te maken om volgend jaar mee te lopen!
            </p>
            <p>
              Daarnaast is het een ontzettend toffe ervaring voor de cliënten van 's Heeren Loo. Zij krijgen de kans om live op de radio verslag te doen van hun eigen evenement – een unieke belevenis die perfect past bij de gedachte achter De Koninklijke Loop.
            </p>
            <p>
              Dit media archief is een plek waar we die mooie herinneringen bewaren. Luister terug naar de fragmenten en herbeleef de energie en het enthousiasme van de uitzendingen.
            </p>
            <p>
              Heb je vragen over onze media-uitingen of wil je meer weten? Neem dan <a href="/contact" className="text-primary hover:text-primary-dark underline">contact</a> met ons op!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaPage; 