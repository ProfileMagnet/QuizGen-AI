import React, { useEffect, useState } from 'react';
import AnimatedBackground from './AnimatedBackground/AnimatedBackground';
import HeroSection from './sections/HeroSection';
import OverviewSection from './sections/OverviewSection';
import FeaturesSection from './sections/FeaturesSection';
import ArchitectureSection from './sections/ArchitectureSection';
import DemoSection from './sections/DemoSection';
import ExampleOutputSection from './sections/ExampleOutputSection';
import UpcomingFeaturesSection from './sections/UpcomingFeaturesSection';
import TeamSection from './sections/TeamSection';
import './App.css';
import { Contact } from 'lucide-react';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Animated Background - Change variant: 'orbs' | 'particles' | 'waves' | 'gradient' | 'cosmic' | 'professionalStars' */}
      <AnimatedBackground />

      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">Q</div>
              <span>QuizGen AI</span>
            </div>
            <ul className="nav-links">
              <li><a href="#overview">Overview</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#architecture">Architecture</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#examples">Examples</a></li>
              <li><a href="#upcoming">Upcoming</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <button className="btn btn-primary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Try It Live</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />
      
      {/* Overview Section */}
      <OverviewSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Architecture Section */}
      <ArchitectureSection />
      
      {/* Demo Section */}
      <DemoSection />
      
      {/* Example Output Section */}
      <ExampleOutputSection />
      
      {/* Upcoming Features Section */}
      <UpcomingFeaturesSection />
      
      {/* Team Section */}
      <TeamSection />

      {/* Contact Section */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default App;