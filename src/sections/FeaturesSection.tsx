import React from 'react';
import { Brain, Zap, Target, ListChecks, Monitor, Settings, BarChart3 } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Generation',
      description: 'Generate engaging quiz questions instantly using advanced AI models. Simply enter a topic and watch the magic happen.'
    },
    {
      icon: <ListChecks size={24} />,
      title: '5 Quiz Types Available',
      description: 'Create Multiple Choice, True/False, Fill in the Blanks, Ordering, and Matching quizzes to suit different learning styles.'
    },
    {
      icon: <Target size={24} />,
      title: 'Difficulty Levels',
      description: 'Choose from Easy, Medium, or Hard difficulty levels to match your audience\'s knowledge and challenge requirements.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Smart Question Generation',
      description: 'Avoid duplicate questions with intelligent tracking. Generate more questions that build on previous ones seamlessly.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Insights Dashboard',
      description: 'Track your quiz performance with detailed analytics. View completion rates, difficulty trends, and learning progress insights.'
    },
    {
      icon: <Settings size={24} />,
      title: 'Smart & Responsive',
      description: 'Your API key and preferences are saved locally for a smooth experience. Fully responsive design works perfectly on all devices.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Features</h2>
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