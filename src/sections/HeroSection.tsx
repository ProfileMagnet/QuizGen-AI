import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const fullTitle = 'AI-Powered Quiz Generation';
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">AI</span>
          <span>Powered by Advanced AI</span>
        </div>
        <h1 className="hero-title">
          <img 
            src="/icon.png" 
            alt="QuizGen AI" 
            className="hero-logo"
          />
          <span className="title-text">{displayedTitle}<span className="cursor">|</span></span>
        </h1>
        <p className="hero-subtitle">
          Transform your content into engaging quizzes instantly with our cutting-edge AI technology
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onGetStarted}>
            <span>Get Started</span>
            <span className="btn-glow"></span>
          </button>
          <button className="btn btn-secondary" onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Examples</span>
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">10,000+</div>
            <div className="stat-label">Quizzes Generated</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">500+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default HeroSection;