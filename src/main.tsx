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

// Handle SPA fallback redirect from static hosts (e.g., 404.html -> /?redirect=/path)
(() => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect');
    if (redirect) {
      // Replace the current history state with the intended SPA route
      const targetUrl = new URL(redirect, window.location.origin);
      window.history.replaceState({}, '', targetUrl.pathname + targetUrl.search + targetUrl.hash);
    }
  }
})();

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