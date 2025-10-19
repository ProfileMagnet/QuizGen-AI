import React from 'react';
import './UpcomingFeaturesSection.css';

const UpcomingFeaturesSection: React.FC = () => {
  const upcomingFeatures = [
    {
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics to track quiz performance, user engagement, and learning outcomes with detailed insights and visualizations.",
      status: "In Development",
      icon: "📊"
    },
    {
      title: "Collaborative Quiz Building",
      description: "Enable multiple educators to collaborate on quiz creation in real-time with shared editing and commenting features.",
      status: "Planned",
      icon: "👥"
    },
    {
      title: "AI-Powered Difficulty Adjustment",
      description: "Automatically adjust question difficulty based on individual student performance for personalized learning experiences.",
      status: "Planned",
      icon: "🤖"
    },
    {
      title: "Multilingual Support",
      description: "Generate quizzes in multiple languages with automatic translation and localization features for global accessibility.",
      status: "In Development",
      icon: "🌐"
    },
    {
      title: "Integration with LMS Platforms",
      description: "Seamless integration with popular Learning Management Systems like Canvas, Moodle, and Google Classroom.",
      status: "Planned",
      icon: "🔗"
    },
    {
      title: "Voice-to-Quiz Generation",
      description: "Create quizzes from voice recordings or live speech using advanced speech-to-text and natural language processing.",
      status: "Research",
      icon: "🎤"
    }
  ];

  return (
    <section className="upcoming-features-section" id="upcoming">
      <div className="container">
        <div className="upcoming-features-header">
          <h2 className="section-title">Upcoming Features</h2>
          <p className="section-subtitle">
            Exciting new capabilities coming to QuizGen AI to enhance your quiz creation experience
          </p>
        </div>
        
        <div className="upcoming-features-content">
          {upcomingFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <span className="icon">{feature.icon}</span>
              </div>
              <div className="feature-content">
                <div className="feature-header">
                  <h3>{feature.title}</h3>
                  <span className={`status-badge ${feature.status.toLowerCase().replace(' ', '-')}`}>
                    {feature.status}
                  </span>
                </div>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="roadmap-cta">
          <p>Stay tuned for these exciting features and more!</p>
          <button className="btn btn-primary">Subscribe for Updates</button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeaturesSection;