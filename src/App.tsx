import { BrowserRouter } from 'react-router-dom'
import { Navbar, PartnerCarrousel } from './components'

export default function App() {
  const handleInschrijfClick = () => {
    console.log('Inschrijven clicked')
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar onInschrijfClick={handleInschrijfClick} />
        <main className="pt-12">
          <PartnerCarrousel />
        </main>
      </div>
    </BrowserRouter>
  )
}
