import { BrowserRouter } from 'react-router-dom'
import { 
  Navbar, 
  PartnerCarrousel, 
  HeroSection, 
  TitleSection, 
  CTACards,
  PhotoGallery,
  DKLSocials 
} from './components'
import { VideoGallery } from './components/video'
import { useState } from 'react'
import { InschrijfModal, DonatieModal } from './components/modals'

export default function App() {
  const [isInschrijfModalOpen, setIsInschrijfModalOpen] = useState(false);
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  const handleInschrijfClick = () => {
    setIsInschrijfModalOpen(true);
  }

  const handleDonatieClick = () => {
    setIsDonatieModalOpen(true);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar onInschrijfClick={handleInschrijfClick} />
        <main className="pt-12">
          <PartnerCarrousel />
          <HeroSection 
            onInschrijfClick={handleInschrijfClick}
            onDonatieClick={handleDonatieClick}
          />
          <TitleSection />
          <CTACards
            onInschrijfClick={handleInschrijfClick}
            onDonatieClick={handleDonatieClick}
          />
          <PhotoGallery />
          <DKLSocials />
          <VideoGallery />
        </main>

        {/* Modals */}
        <InschrijfModal 
          isOpen={isInschrijfModalOpen}
          onClose={() => setIsInschrijfModalOpen(false)}
        />
        <DonatieModal 
          isOpen={isDonatieModalOpen}
          onClose={() => setIsDonatieModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  )
}
