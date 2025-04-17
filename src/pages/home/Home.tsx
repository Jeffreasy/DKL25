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
import { ProgramSection } from '../../components/programma';
import ProgramModal from '../../components/programma/components/ProgramModal';
import { ContactModal } from '../../components/modals/ContactModal';
import ProgramSidebarTrigger from '../../components/programma/components/SidebarTrigger';

interface HomeProps {
  onDonatieClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onDonatieClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedInitialTab, setSelectedInitialTab] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  const handleOpenProgramModal = (initialTab: string) => {
    setSelectedInitialTab(initialTab);
    setIsProgramModalOpen(true);
  };

  const handleCloseProgramModal = () => {
    setIsProgramModalOpen(false);
  };

  const handleOpenContactModal = () => {
    setIsProgramModalOpen(false);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleOpenProgramFromTitle = () => {
    handleOpenProgramModal('Start/Finish/Feest');
  };
  
  const handleOpenProgramFromSidebar = () => {
    handleOpenProgramModal('Start/Finish/Feest');
  };

  return (
    <>
      <SEO 
        route="/"
        isEventPage={true}
        eventName="De Koninklijke Loop 2025"
        eventStartDate="2025-05-17T10:00:00+02:00"
        eventDescription="Het unieke wandelevenement in Apeldoorn voor en door mensen met een beperking, waarbij gelopen wordt voor het goede doel."
        eventLocationName="Paleis Het Loo, Apeldoorn"
        eventLocationAddress="Koninklijk Park 1, 7315 JA Apeldoorn"
      />
      <div className="bg-white">
        <main>
          {/* Visually hidden heading for accessibility and SEO */}
          <h2 className="sr-only">Onze Partners</h2> 
          <PartnerCarrousel />
          <HeroSection onOpenProgramModal={() => handleOpenProgramModal('Start/Finish/Feest')} />
          <TitleSection onInschrijfClick={handleInschrijven} onProgrammaClick={handleOpenProgramFromTitle} />
          <CTACards
            onInschrijfClick={handleInschrijven}
            onDonatieClick={onDonatieClick}
          />
          {/* Render Program Section */}
          <ProgramSection onOpenModal={handleOpenProgramModal} />
          <section className="py-12 px-5">
            {/* Visually hidden heading for accessibility and SEO */}
            <h2 className="sr-only">Bekijk de Video's</h2> 
            <VideoGallery />
          </section>
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Foto Impressie 2024</h2>
            <PhotoGallery onModalChange={setIsModalOpen} />
          </section>
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Luister Terug</h2>
            <RadioGallery 
              title="Radio Fragmenten 2024"
              subtitle="Luister naar onze live radio uitzending tijdens De Koninklijke Loop 2024"
              maxItems={1}
            />
          </section>
          <DKLSocials />
          <section className="py-12 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Met Dank Aan Onze Sponsors</h2>
            <DKLSponsors />
          </section>
          <InschDoneerButton
            onInschrijfClick={handleInschrijven}
            onDonatieClick={onDonatieClick}
            isModalOpen={isModalOpen}
          />
        </main>

        {/* Render Modals */}
        <ProgramModal 
          isOpen={isProgramModalOpen} 
          onClose={handleCloseProgramModal} 
          initialTab={selectedInitialTab} 
          onOpenContactModal={handleOpenContactModal}
        />
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={handleCloseContactModal} 
        />
        <ProgramSidebarTrigger onOpenModal={handleOpenProgramFromSidebar} />
      </div>
    </>
  );
};

export default Home; 