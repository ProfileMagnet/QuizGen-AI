import React from 'react';
import './OverviewSection.css';

const OverviewSection: React.FC = () => {
  const features = [
    {
      title: 'AI-Powered Generation',
      description: 'Our advanced algorithms analyze your content and automatically generate engaging, relevant quiz questions in seconds.'
    },
    {
      title: 'Lightning Fast Processing',
      description: 'Generate dozens of quiz questions in seconds, saving hours of manual work while maintaining high quality standards.'
    },
    {
      title: 'Precision Targeting',
      description: 'Customize quiz parameters to match your audience\'s knowledge level and learning objectives for maximum effectiveness.'
    },
    {
      title: 'Performance Analytics',
      description: 'Track quiz performance and user engagement with detailed analytics to continuously improve your content strategy.'
    }
  ];

  return (
    <section className="overview-section" id="overview">
      <div className="container">
        <div className="overview-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Transform your content into engaging quizzes with our intelligent platform
          </p>
        </div>
        
        <div className="overview-content">
          {features.map((feature, index) => (
            <div className="overview-card" key={index}>
              <div className="feature-number">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;