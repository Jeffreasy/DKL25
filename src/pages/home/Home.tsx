import React from 'react';
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
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  return (
    <main className="flex-grow">
      <section className="bg-white relative">
        <PartnerCarrousel />
      </section>
      <HeroSection />
      <TitleSection onInschrijfClick={handleInschrijven} />
      <CTACards
        onInschrijfClick={handleInschrijven}
        onDonatieClick={onDonatieClick}
      />
      <VideoGallery />
      <PhotoGallery />
      <DKLSocials />
      <DKLSponsors />
      <InschDoneerButton 
        onInschrijfClick={handleInschrijven}
        onDonatieClick={onDonatieClick}
      />
    </main>
  );
};

export default Home; 