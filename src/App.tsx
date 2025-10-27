import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Critical components - load immediately
import HeroSection from './sections/HeroSection';
import OverviewSection from './sections/OverviewSection';

// Lazy loaded components
import {
  LazyAnimatedBackground,
  LazyArchitectureSection,
  LazyTryItLive,
  LazyExampleOutputSection,
  LazyUpcomingFeaturesSection,
  LazyTeamSection,
  LazyContactSection,
  LazyFooter,
  LazyQuizGeneratorPage
} from './components/LazyComponents';

import LazySection from './components/LazySection';
import { preloadComponent } from './utils/lazyLoader';

// Import styles
import './App.css';
import './utils/lazyLoader.css';

// Performance monitoring (development only)
import PerformanceMonitor from './components/PerformanceMonitor';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Preload critical components on user interaction and add loaded class
  useEffect(() => {
    // Add app-loaded class after initial render to enable complex background
    const timer = setTimeout(() => {
      document.body.classList.add('app-loaded');
    }, 100); // Small delay to ensure smooth transition

    const preloadCriticalComponents = () => {
      // Preload quiz generator when user shows intent
      preloadComponent(() => import('./sections/QuizGeneratorPage'));
    };

    // Preload on first user interaction
    const handleFirstInteraction = () => {
      preloadCriticalComponents();
      document.removeEventListener('mouseenter', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('mouseenter', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseenter', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/quiz-generator');
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const navItems = [
    { id: 'try', label: 'Try It Live' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'examples', label: 'Examples' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="app">
      {/* Performance monitoring in development */}
      {import.meta.env.DEV && <PerformanceMonitor />}

      {/* Lazy loaded Animated Background */}
      <LazyAnimatedBackground />

      <Routes>
        <Route path="/" element={
          <>
            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
              <div className="container">
                <div className="nav-content">
                  <div className="logo">
                    <div className="logo-icon">
                      <img
                        src="/icon.png"
                        alt="QuizGen AI"
                        className="logo-image"
                        loading="lazy"
                      />
                    </div>
                    <span>QuizGen AI</span>
                  </div>

                  {/* Desktop Navigation */}
                  <ul className="nav-links">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>{item.label}</a>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Menu Button */}
                  <button
                    className="mobile-menu-button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                  <ul className="mobile-nav-links">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            {/* Critical sections - load immediately */}
            <HeroSection onGetStarted={handleGetStarted} />
            <OverviewSection />

            {/* Lazy loaded sections with intersection observer */}
            <LazySection id="architecture" threshold={0.2}>
              <LazyArchitectureSection />
            </LazySection>

            <LazySection id="examples" threshold={0.2}>
              <LazyExampleOutputSection />
            </LazySection>

            <LazySection id="try" threshold={0.2}>
              <LazyTryItLive />
            </LazySection>

            <LazySection id="upcoming" threshold={0.2}>
              <LazyUpcomingFeaturesSection />
            </LazySection>

            <LazySection id="team" threshold={0.2}>
              <LazyTeamSection />
            </LazySection>

            <LazySection id="contact" threshold={0.2}>
              <LazyContactSection />
            </LazySection>

            <LazyFooter />
          </>
        } />
        <Route path="/quiz-generator" element={<LazyQuizGeneratorPage />} />
      </Routes>
    </div>
  );
};

export default App;