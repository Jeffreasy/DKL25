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
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onDonatieClick }) => (
  <main className="flex-grow">
    <section className="bg-white relative">
      <PartnerCarrousel />
    </section>
    <HeroSection 
      onDonatieClick={onDonatieClick}
    />
    <TitleSection />
    <CTACards
      onDonatieClick={onDonatieClick}
    />
    <VideoGallery />
    <PhotoGallery />
    <DKLSocials />
    <DKLSponsors />
  </main>
);

export default Home;
