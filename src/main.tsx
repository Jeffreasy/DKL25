import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App'
import './index.css'
import { initGA } from './utils/googleAnalytics.js'

// Performance monitoring for app initialization
const initStartTime = performance.now();

// Initialiseer Google Analytics
// Vervang 'G-XXXXXXXXXX' met je eigen Google Analytics measurement ID
initGA('G-7NPD3N2N8Q')

// Track app initialization performance
const initEndTime = performance.now();
const initDuration = Math.round(initEndTime - initStartTime);
console.log(`🚀 App initialization completed in ${initDuration}ms`);

// Conditionally apply StrictMode based on environment for better performance in production
const AppComponent = import.meta.env.PROD ? (
  <AppWrapper />
) : (
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(AppComponent)