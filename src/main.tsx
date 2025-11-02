import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { addResourceHints, reportWebVitals, monitorFPS, monitorMemory } from './utils/performance'
import { registerServiceWorker } from './utils/serviceWorker'
import './index.css'

// Add resource hints for better performance
addResourceHints();

// Register service worker for caching
registerServiceWorker();

// Report web vitals in development
if (import.meta.env.DEV) {
  reportWebVitals();
  monitorFPS();
  monitorMemory();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)