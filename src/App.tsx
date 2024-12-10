import { BrowserRouter } from 'react-router-dom'
import { Navbar, PartnerCarrousel, HeroSection } from './components'
import { VideoGallery } from './components/video'

export default function App() {
  const handleInschrijfClick = () => {
    console.log('Inschrijven clicked')
  }

  const handleDonatieClick = () => {
    console.log('Donatie clicked')
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
          <VideoGallery />
        </main>
      </div>
    </BrowserRouter>
  )
}
