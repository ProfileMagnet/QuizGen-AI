// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    // Use a stable version (ideally set VITE_APP_VERSION at build time). Do NOT use Date.now().
    const SW_VERSION = import.meta.env.VITE_APP_VERSION || '1';

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`/sw.js?v=${SW_VERSION}`)
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Reload once when the new SW takes control
          let hasReloaded = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (hasReloaded) return;
            hasReloaded = true;
            window.location.reload();
          });

          // If there's already a waiting worker, activate it
          const maybeActivate = (reg: ServiceWorkerRegistration) => {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          };

          maybeActivate(registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // A new SW is ready; activate it (controllerchange will handle a single reload)
                maybeActivate(registration);
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