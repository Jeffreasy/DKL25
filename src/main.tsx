import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initGA } from './utils/googleAnalytics.js'

// Initialiseer Google Analytics
// Vervang 'G-XXXXXXXXXX' met je eigen Google Analytics measurement ID
initGA('G-7NPD3N2N8Q')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)