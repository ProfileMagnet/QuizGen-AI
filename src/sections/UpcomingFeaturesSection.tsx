import React from 'react';
import './UpcomingFeaturesSection.css';

const UpcomingFeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Collaborative Quiz Creation',
      description: 'Enable team-based quiz development with real-time editing and review workflows'
    },
    {
      title: 'Adaptive Learning Paths',
      description: 'Create dynamic quiz sequences that adjust difficulty based on learner performance'
    },
    {
      title: 'Multi-language Support',
      description: 'Generate quizzes in multiple languages with automatic translation and localization'
    },
    {
      title: 'File Upload Quiz Generation',
      description: 'Upload documents, PDFs, and text files to automatically generate quizzes from their content'
    },
    {
      title: 'Voice-enabled Quizzes',
      description: 'Create and take quizzes using voice commands and speech recognition technology'
    }
  ];

  // Calculate the number of cards in the last row
  const cardsInLastRow = features.length % 3;
  // Only apply centering for desktop view when there are more than 3 cards and the last row has fewer than 3 cards
  const shouldCenterLastRow = features.length > 3 && cardsInLastRow !== 0;
  // Determine which class to apply based on the number of cards in the last row
  const lastRowClass = shouldCenterLastRow
    ? cardsInLastRow === 1
      ? 'one-card-last-row'
      : 'two-cards-last-row'
    : '';

  return (
    <section className="upcoming-section" id="upcoming">
      <div className="container">
        <div className="upcoming-header">
          <h2 className="section-title">Upcoming Features</h2>
          <p className="section-subtitle">
            Exciting enhancements coming to QuizGen AI
          </p>
        </div>

        <div className={`upcoming-content ${shouldCenterLastRow ? lastRowClass : ''}`}>
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