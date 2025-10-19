import React from 'react';
import './UpcomingFeaturesSection.css';

const UpcomingFeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive insights into quiz performance and user engagement metrics'
    },
    {
      title: 'Collaborative Team Features',
      description: 'Enable multiple users to collaborate on quiz creation and management'
    },
    {
      title: 'AI Content Enhancement',
      description: 'Automatically improve and optimize your existing quiz content'
    },
    {
      title: 'Multi-language Support',
      description: 'Generate quizzes in multiple languages with automatic translation'
    },
    {
      title: 'Integration Hub',
      description: 'Connect with popular LMS platforms and educational tools'
    },
    {
      title: 'Voice-enabled Quizzes',
      description: 'Create and take quizzes using voice commands and speech recognition'
    }
  ];

  return (
    <section className="upcoming-section" id="upcoming">
      <div className="container">
        <div className="upcoming-header">
          <h2 className="section-title">Upcoming Features</h2>
          <p className="section-subtitle">
            Exciting enhancements coming to QuizGen AI
          </p>
        </div>
        
        <div className="upcoming-content">
          {features.map((feature, index) => (
            <div className="upcoming-card" key={index}>
              <div className="upcoming-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeaturesSection;