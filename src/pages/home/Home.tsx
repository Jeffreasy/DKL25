import React, { useState } from 'react';
import { 
  PartnerCarrousel, 
  HeroSection, 
  TitleSection, 
  CTACards,
  PhotoGallery,
  DKLSocials,
  DKLSponsors,
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