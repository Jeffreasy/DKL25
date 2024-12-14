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
import { InschrijfModal } from '@/components/modals/InschrijfModal';

interface HomeProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onInschrijfClick, onDonatieClick }) => {
  const [isInschrijfModalOpen, setIsInschrijfModalOpen] = useState(false);

  const handleInschrijfClick = () => {
    setIsInschrijfModalOpen(true);
  };

  return (
    <>
      <main className="flex-grow">
        <section className="bg-white relative">
          <PartnerCarrousel />
        </section>
        <HeroSection 
          onInschrijfClick={onInschrijfClick}
          onDonatieClick={onDonatieClick}
        />
        <TitleSection onInschrijfClick={handleInschrijfClick} />
        <CTACards
          onInschrijfClick={onInschrijfClick}
          onDonatieClick={onDonatieClick}
        />
        <VideoGallery />
        <PhotoGallery />
        <DKLSocials />
        <DKLSponsors />
      </main>
      <InschrijfModal 
        isOpen={isInschrijfModalOpen} 
        onClose={() => setIsInschrijfModalOpen(false)} 
      />
    </>
  );
};

export default Home; 