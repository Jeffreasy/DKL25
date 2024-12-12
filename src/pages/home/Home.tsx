import React from 'react';
import PartnerCarrousel from './components/partners/PartnerCarrousel';
import HeroSection from './components/Herosection/HeroSection';
import TitleSection from './components/Title/TitleSection';
import CTACards from './components/CTACards/CTACards';
import { PhotoGallery } from './components/foto';
import DKLSocials from './components/Socials/DKLSocials';
import { DKLSponsors } from './components/sponsors';
import { VideoGallery } from './components/video';

interface HomeProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onInschrijfClick, onDonatieClick }) => (
  <main className="flex-grow">
    <section className="bg-white relative">
      <PartnerCarrousel />
    </section>
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
