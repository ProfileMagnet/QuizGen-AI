import React from 'react';
import './OverviewSection.css';

const OverviewSection: React.FC = () => {
  return (
    <section className="overview-section" id="overview">
      <div className="container">
        <div className="overview-header">
          <h2 className="section-title">Overview</h2>
          <p className="section-subtitle">
            Discover how QuizGen AI transforms content creation with intelligent quiz generation
          </p>
        </div>
        
        <div className="overview-content">
          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon">🤖</span>
            </div>
            <h3>AI-Powered Generation</h3>
            <p>
              Our advanced AI algorithms analyze your content and automatically generate 
              engaging, relevant quiz questions in seconds.
            </p>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon">⚡</span>
            </div>
            <h3>Lightning Fast</h3>
            <p>
              Generate dozens of quiz questions in seconds, saving hours of manual work 
              while maintaining high quality standards.
            </p>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon">🎯</span>
            </div>
            <h3>Precision Targeting</h3>
            <p>
              Customize quiz parameters to match your audience's knowledge level and 
              learning objectives for maximum effectiveness.
            </p>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon">📊</span>
            </div>
            <h3>Performance Analytics</h3>
            <p>
              Track quiz performance and user engagement with detailed analytics to 
              continuously improve your content strategy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;