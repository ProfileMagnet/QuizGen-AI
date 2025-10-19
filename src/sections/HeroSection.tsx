import React from 'react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          AI-Powered Quiz Generation
        </h1>
        <p className="hero-subtitle">
          Transform your content into engaging quizzes instantly with our cutting-edge AI technology
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onGetStarted}>Get Started</button>
          <button className="btn btn-secondary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>View Demo</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;