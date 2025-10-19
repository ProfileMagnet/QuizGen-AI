import React, { useState } from 'react';
import './DemoSection.css';

const DemoSection: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sampleContent = `The water cycle, also known as the hydrological cycle, describes the continuous movement of water on, above and below the surface of the Earth. The mass of water on Earth remains fairly constant over time but the partitioning of the water into the major reservoirs of ice, fresh water, saline water and atmospheric water is variable depending on a wide range of climatic variables. The water moves from one reservoir to another, such as from river to ocean, through processes like evaporation, condensation, precipitation, infiltration, surface runoff, and subsurface flow.`;

  const handleGenerateQuiz = () => {
    if (!inputText.trim()) {
      alert('Please enter some content to generate a quiz.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate sample quiz questions based on the input
      const sampleQuestions = [
        {
          id: 1,
          question: "What is the water cycle also known as?",
          options: [
            "Hydrological cycle",
            "Evaporation cycle",
            "Precipitation cycle",
            "Condensation cycle"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "What describes the continuous movement of water on Earth?",
          options: [
            "The water cycle",
            "The evaporation process",
            "The precipitation system",
            "The condensation mechanism"
          ],
          correctAnswer: 0
        },
        {
          id: 3,
          question: "Which process is NOT part of the water cycle?",
          options: [
            "Evaporation",
            "Condensation",
            "Precipitation",
            "Photosynthesis"
          ],
          correctAnswer: 3
        }
      ];
      
      setQuizQuestions(sampleQuestions);
      setIsLoading(false);
    }, 1500);
  };

  const handleUseSample = () => {
    setInputText(sampleContent);
  };

  const handleReset = () => {
    setInputText('');
    setQuizQuestions([]);
  };

  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">Try It Live</h2>
          <p className="section-subtitle">
            Experience the power of QuizGen AI by generating quiz questions from your own content
          </p>
        </div>
        
        <div className="demo-content">
          <div className="demo-input">
            <h3>Enter Your Content</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your educational content, article, or document here..."
              rows={8}
            />
            <div className="demo-actions">
              <button className="btn btn-secondary" onClick={handleUseSample}>
                Use Sample Content
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerateQuiz}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
          
          <div className="demo-output">
            <h3>Generated Quiz</h3>
            {quizQuestions.length > 0 ? (
              <div className="quiz-results">
                {quizQuestions.map((question) => (
                  <div className="quiz-question" key={question.id}>
                    <h4>Q{question.id}: {question.question}</h4>
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
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="demo-placeholder">
                <p>Your generated quiz questions will appear here...</p>
                <div className="placeholder-icon">📝</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;