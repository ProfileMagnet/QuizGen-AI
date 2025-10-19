import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, Lightbulb, Zap } from 'lucide-react';
import './DemoSection.css';

const DemoSection: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">Live Demo</h2>
          <p className="section-subtitle">
            Try our AI-powered quiz generator right now
          </p>
        </div>

        <div className="demo-content">
          <div className="demo-controls">
            <div className="input-group">
              <div className="input-wrapper">
                <Sparkles className="input-icon" size={20} />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., JavaScript, History, Biology)"
                  disabled={isGenerating}
                  className={topic ? 'has-value' : ''}
                />
              </div>
              <button 
                className="btn btn-primary demo-generate-btn" 
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
            
            <div className="demo-tips">
              <Lightbulb size={16} />
              <span>Try topics like "JavaScript", "World History", or "Biology"</span>
            </div>
          </div>

          <div className="demo-results">
            {quizQuestions.length > 0 ? (
              <div className="quiz-results">
                <div className="quiz-header">
                  <h3>Generated Quiz: {topic}</h3>
                  <button className="btn btn-secondary reset-btn" onClick={handleReset}>
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
                {quizQuestions.map((question) => (
                  <div className="quiz-question" key={question.id}>
                    <div className="question-header">
                      <span className="question-number">Q{question.id}</span>
                      <h4>{question.question}</h4>
                    </div>
                    <div className="quiz-options">
                      {question.options.map((option: string, index: number) => (
                        <div key={index} className="quiz-option">
                          <span className="option-letter">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="option-text">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="demo-actions">
                  <button className="btn btn-primary">
                    <Play size={16} />
                    Try Another Topic
                  </button>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    <RotateCcw size={16} />
                    New Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="demo-placeholder">
                <div className="placeholder-icon">
                  <Sparkles size={48} />
                </div>
                <h3>AI Quiz Generator</h3>
                <p>Enter a topic above to generate quiz questions in seconds</p>
                <div className="placeholder-example">
                  Try: "JavaScript", "World History", "Biology", "Python Programming"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;