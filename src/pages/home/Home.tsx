import React, { useState } from 'react';
import { 
  PartnerCarrousel, 
  HeroSection, 
  TitleSection, 
  CTACards,
  PhotoGallery,
  DKLSocials,
  DKLSponsors,
  RadioGallery,
} from '../../components';
import { VideoGallery } from '../../components/video';
import { useNavigate } from 'react-router-dom';
import InschDoneerButton from '../../components/inschrijfdonatebutton/inschdoneerbutton';
import { SEO } from '../../components/SEO';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  return (
    <>
      <SEO 
        route="/"
        isEventPage={true}
        eventName="De Koninklijke Loop (DKL) 2025"
        eventStartDate="2025-05-17T10:00:00+02:00"
        eventDescription="Het unieke, rolstoelvriendelijke wandelevenement (DKL) in Apeldoorn voor en door mensen met een beperking, waarbij gelopen wordt voor het goede doel."
        eventLocationName="Paleis Het Loo, Apeldoorn"
        eventLocationAddress="Koninklijk Park 1, 7315 JA Apeldoorn"
      />
      <div className="bg-white">
        <main>
          {/* Visually hidden heading for accessibility and SEO */}
          <h2 className="sr-only">Onze Partners</h2> 
          <PartnerCarrousel />
          <HeroSection />
          <TitleSection onInschrijfClick={handleInschrijven} />
          <CTACards
            onInschrijfClick={handleInschrijven}
          />
          <section className="py-12 px-5">
            {/* Visually hidden heading for accessibility and SEO */}
            <h2 className="sr-only">Bekijk de Video's</h2> 
            <VideoGallery />
          </section>
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Foto Impressie</h2>
            <PhotoGallery onModalChange={setIsModalOpen} />
          </section>
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Luister Terug</h2>
            <RadioGallery 
              title="Radio Fragmenten"
              subtitle="Luister naar onze Radio Fragmenten"
              maxItems={2}
            />
          </section>
          <DKLSocials />
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Met Dank Aan Onze Sponsors</h2>
            <DKLSponsors />
          </section>
          <InschDoneerButton
            onInschrijfClick={handleInschrijven}
            isModalOpen={isModalOpen}
          />
        </main>
      </div>
    </>
  );
};

export default Home; 