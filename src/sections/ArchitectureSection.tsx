import React from 'react';
import './ArchitectureSection.css';

const ArchitectureSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Content Input',
      description: 'Users provide educational content, articles, or documents that serve as the foundation for quiz generation.'
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our advanced NLP algorithms analyze the content to identify key concepts, facts, and relationships.'
    },
    {
      step: '03',
      title: 'Question Generation',
      description: 'The AI generates diverse question types based on the analyzed content, ensuring comprehensive coverage.'
    },
    {
      step: '04',
      title: 'Smart Review',
      description: 'Generated questions are reviewed and optimized by our AI for clarity, accuracy, and educational value.'
    },
    {
      step: '05',
      title: 'Customization',
      description: 'Users can customize difficulty levels, question types, and focus areas to match their specific needs.'
    },
    {
      step: '06',
      title: 'Export & Share',
      description: 'Final quizzes can be exported in multiple formats or shared directly with students and colleagues.'
    }
  ];

  return (
    <section className="architecture-section" id="architecture">
      <div className="container">
        <div className="architecture-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our intelligent process transforms your content into engaging quizzes in just a few simple steps
          </p>
        </div>
        
        <div className="architecture-content">
          {steps.map((step, index) => (
            <div className="architecture-step" key={index}>
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;