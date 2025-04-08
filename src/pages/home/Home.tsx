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

interface HomeProps {
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onDonatieClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  return (
    <div className="bg-white">
      <main>
        <PartnerCarrousel />
        <HeroSection />
        <TitleSection onInschrijfClick={handleInschrijven} />
        <CTACards
          onInschrijfClick={handleInschrijven}
          onDonatieClick={onDonatieClick}
        />
        <VideoGallery />
        <PhotoGallery onModalChange={setIsModalOpen} />
        <RadioGallery 
          title="Radio Fragmenten 2024"
          subtitle="Luister naar onze live radio uitzending tijdens De Koninklijke Loop 2024"
          maxItems={1}
        />
        <DKLSocials />
        <DKLSponsors />
        <InschDoneerButton
          onInschrijfClick={handleInschrijven}
          onDonatieClick={onDonatieClick}
          isModalOpen={isModalOpen}
        />
      </main>
    </div>
  );
};

export default Home; 