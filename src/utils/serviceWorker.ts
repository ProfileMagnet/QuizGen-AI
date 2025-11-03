// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    // Use a stable version (set VITE_APP_VERSION in your build; bump on SW changes)
    const SW_VERSION = import.meta.env.VITE_APP_VERSION || '1';

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`/sw.js?v=${SW_VERSION}`)
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Quiet update strategy:
          // - Activate the new SW in background (skipWaiting)
          // - Do NOT reload while the tab is visible
          // - If a new controller takes over and the tab is hidden, reload silently
          // - Otherwise, delay reload until tab becomes hidden once

          let pendingReload = false;

          const trySilentReload = () => {
            if (document.visibilityState === 'hidden') {
              window.location.reload();
            } else {
              pendingReload = true;
            }
          };

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // New SW took control; apply silently when safe
            trySilentReload();
          });

          document.addEventListener('visibilitychange', () => {
            if (pendingReload && document.visibilityState === 'hidden') {
              window.location.reload();
            }
          });

          const activateIfWaiting = (reg: ServiceWorkerRegistration) => {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          };

          // Activate immediately if already waiting
          activateIfWaiting(registration);

          // When a new SW is installed, ask it to take over (no prompt to user)
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                activateIfWaiting(registration);
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Unregister service worker (for development)
export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};