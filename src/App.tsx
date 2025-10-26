import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground/AnimatedBackground';
import HeroSection from './sections/HeroSection';
import OverviewSection from './sections/OverviewSection';
import FeaturesSection from './sections/FeaturesSection';
import ArchitectureSection from './sections/ArchitectureSection';
import DemoSection from './sections/DemoSection';
import ExampleOutputSection from './sections/ExampleOutputSection';
import UpcomingFeaturesSection from './sections/UpcomingFeaturesSection';
import TeamSection from './sections/TeamSection';
import QuizGeneratorPage from './sections/QuizGeneratorPage';
import './App.css';
import { Menu, X } from 'lucide-react';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    
    { id: 'architecture', label: 'Architecture' },
    { id: 'examples', label: 'Examples' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="app">
      {/* Animated Background - Change variant: 'orbs' | 'particles' | 'waves' | 'gradient' | 'cosmic' | 'professionalStars' */}
      <AnimatedBackground />

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

            {/* Hero Section */}
            <HeroSection onGetStarted={handleGetStarted} />
            
            {/* Overview Section */}
            <OverviewSection />
            
            {/* Features Section */}
            
            
            {/* Architecture Section */}
            <ArchitectureSection />
            
            {/* Demo Section */}
            
            
            {/* Example Output Section */}
            <ExampleOutputSection />
            
            {/* Upcoming Features Section */}
            <UpcomingFeaturesSection />
            
            {/* Team Section */}
            <TeamSection />

            {/* Contact Section */}
            <ContactSection />
            <Footer />
          </>
        } />
        <Route path="/quiz-generator" element={<QuizGeneratorPage />} />
      </Routes>
    </div>
  );
};

export default App;