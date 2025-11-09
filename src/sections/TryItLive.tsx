import React from 'react';
import { Sparkles, Zap, ArrowRight, Rocket, Brain, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TryItLive.css';

const TryItLive: React.FC = () => {
  const navigate = useNavigate();


  const handleTryFullVersion = () => {
    navigate('/quiz-generator');
  };

  return (
    <section className="demo-section" id="try">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">Try It Live</h2>
          <p className="section-subtitle">
            Experience the power of AI-driven quiz generation in real-time
          </p>
          <div className="demo-features">
            <div className="demo-feature">
              <Brain className="feature-icon" size={14} />
              <span>AI-Powered Intelligence</span>
            </div>
            <div className="demo-feature">
              <Clock className="feature-icon" size={14} />
              <span>Instant Generation</span>
            </div>
            <div className="demo-feature">
              <Rocket className="feature-icon" size={14} />
              <span>Production Ready</span>
            </div>
          </div>
        </div>

        <div className="demo-content">
          <div className="demo-controls">



          </div>

          <div className="demo-results">
            <div className="demo-placeholder">
              <div className="placeholder-icon">
                <Sparkles size={48} />
              </div>
              <h3>AI Quiz Generator Preview</h3>
              <p>Get a taste of our intelligent quiz generation system. Enter any topic and watch as our AI creates relevant, engaging questions in seconds.</p>
              <div className="placeholder-features">
                <div className="placeholder-feature">
                  <Zap size={16} />
                  <span>Lightning Fast Generation</span>
                </div>
                <div className="placeholder-feature">
                  <Brain size={16} />
                  <span>Context-Aware Questions</span>
                </div>
              </div>
              <div className="placeholder-example">
                Try: "JavaScript", "World History", "Biology", "Python Programming"
              </div>
              <button className="btn btn-primary cta-button" onClick={handleTryFullVersion}>
                <Rocket size={18} />
                Experience Full Platform
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TryItLive;