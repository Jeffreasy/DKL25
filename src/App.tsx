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
        <main className="pt-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center py-8">
            De Koninklijke Loop
          </h1>
          <PartnerCarrousel />
        </main>
      </div>
    </BrowserRouter>
  )
}
