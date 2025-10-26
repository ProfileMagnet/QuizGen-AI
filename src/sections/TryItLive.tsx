import React, { useState } from 'react';
import { Sparkles, RotateCcw, Lightbulb, Zap, ArrowRight, Rocket, Brain, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TryItLive.css';

const TryItLive: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the primary benefit of using AI for quiz generation?",
      options: [
        "Reduced time and effort in content creation",
        "Elimination of all human involvement",
        "Guaranteed perfect accuracy",
        "Complete replacement of educators"
      ]
    },
    {
      id: 2,
      question: "Which factor is most important for effective quiz generation?",
      options: [
        "Complexity of the source material",
        "Clarity of learning objectives",
        "Length of the quiz",
        "Number of participants"
      ]
    }
  ];

  const handleGenerate = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setQuizQuestions(sampleQuestions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleReset = () => {
    setTopic('');
    setQuizQuestions([]);
  };

  const handleTryFullVersion = () => {
    navigate('/quiz-generator');
  };

  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">Try It Live</h2>
          <p className="section-subtitle">
            Experience the power of AI-driven quiz generation in real-time
          </p>
          <div className="demo-features">
            <div className="demo-feature">
              <Brain className="feature-icon" size={20} />
              <span>AI-Powered Intelligence</span>
            </div>
            <div className="demo-feature">
              <Clock className="feature-icon" size={20} />
              <span>Instant Generation</span>
            </div>
            <div className="demo-feature">
              <Rocket className="feature-icon" size={20} />
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