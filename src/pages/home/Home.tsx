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

interface HomeProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onInschrijfClick, onDonatieClick }) => (
  <main className="pt-12 flex-grow">
    <PartnerCarrousel />
    <HeroSection 
      onInschrijfClick={onInschrijfClick}
      onDonatieClick={onDonatieClick}
    />
    <TitleSection />
    <CTACards
      onInschrijfClick={onInschrijfClick}
      onDonatieClick={onDonatieClick}
    />
    <VideoGallery />
    <PhotoGallery />
    <DKLSocials />
    <DKLSponsors />
  </main>
);

export default Home; 