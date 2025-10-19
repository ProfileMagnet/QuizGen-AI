import React from 'react';
import { Brain, Zap, Target, BarChart3, ListChecks, Monitor } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Generation',
      description: 'Our advanced AI algorithms analyze your content and automatically generate engaging, relevant quiz questions in seconds.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Generate dozens of quiz questions in seconds, saving hours of manual work while maintaining high quality standards.'
    },
    {
      icon: <Target size={24} />,
      title: 'Precision Targeting',
      description: 'Customize quiz parameters to match your audience\'s knowledge level and learning objectives for maximum effectiveness.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Performance Analytics',
      description: 'Track quiz performance and user engagement with detailed analytics to continuously improve your content strategy.'
    },
    {
      icon: <ListChecks size={24} />,
      title: 'Multiple Question Types',
      description: 'Support for various question formats including multiple choice, true/false, fill-in-the-blank, and more.'
    },
    {
      icon: <Monitor size={24} />,
      title: 'Mobile Responsive',
      description: 'All quizzes are fully responsive and look great on any device, from desktops to smartphones.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Discover how QuizGen AI transforms content creation with intelligent quiz generation
          </p>
        </div>
        
        <div className="features-content">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                {feature.icon}
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

export default FeaturesSection;