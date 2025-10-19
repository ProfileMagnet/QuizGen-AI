import React from 'react';

const HeroSection: React.FC = () => {
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
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">View Demo</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;