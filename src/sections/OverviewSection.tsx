import React from 'react';
import './OverviewSection.css';

const OverviewSection: React.FC = () => {
  return (
    <section className="overview-section" id="overview">
      <div className="container">
        <div className="overview-content">
          <h2 className="section-title">About QuizGen AI</h2>
          <p className="overview-description">
            QuizGen AI is an innovative platform that leverages advanced artificial intelligence to transform any text content into engaging, interactive quizzes. Whether you're an educator looking to create assessments, a content creator wanting to boost engagement, or a business professional developing training materials, our AI-powered solution makes quiz generation effortless and efficient. Simply input your content or even just specify a topic you want to create a quiz about, customize your preferences, and watch as our intelligent algorithms craft thoughtful questions that capture the essence of your material in seconds.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;