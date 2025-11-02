// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Web Vitals monitoring
export const reportWebVitals = () => {
  // Simple performance logging without web-vitals dependency
  if ('performance' in window) {
    console.log('Performance monitoring enabled');
  }
};

// Resource loading optimization
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetch = (domain: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  };

  // Add common external domains
  dnsPrefetch('//fonts.googleapis.com');
  dnsPrefetch('//fonts.gstatic.com');
};

// Image optimization helper
export const createOptimizedImage = (src: string, alt: string, className?: string) => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  if (className) img.className = className;
  return img;
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    console.log('Bundle analysis available in build mode');
    console.log('Run: npm run build && npx vite-bundle-analyzer dist');
  }
};

// FPS monitoring
export const monitorFPS = () => {
  if (import.meta.env.DEV) {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        console.log(`Current FPS: ${fps}`);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
};

// Memory usage monitoring
export const monitorMemory = () => {
  if (import.meta.env.DEV && typeof performance !== 'undefined' && 'memory' in performance) {
    // Using unknown type and type assertion to avoid explicit any
    const perf = performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } };
    const memory = perf.memory;
    if (memory) {
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }
};