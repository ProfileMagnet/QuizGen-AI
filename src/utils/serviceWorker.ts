// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const SW_VERSION = (import.meta.env.VITE_APP_VERSION || Date.now().toString());

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`/sw.js?v=${SW_VERSION}`)
        .then((registration) => {
          console.log('SW registered: ', registration);

          const activateNow = (reg: ServiceWorkerRegistration) => {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          };

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  activateNow(registration);
                  window.location.reload();
                } else {
                  registration.active?.postMessage({ type: 'CLIENTS_CLAIM' });
                }
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