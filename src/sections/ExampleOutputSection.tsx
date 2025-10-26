import React from 'react';
import './ExampleOutputSection.css';

const ExampleOutputSection: React.FC = () => {
  const exampleQuiz = {
    topic: "React Hooks",
    questions: [
      {
        id: 1,
        question: "What is the purpose of the useState hook in React?",
        options: [
          "To manage component state",
          "To handle side effects",
          "To create context providers",
          "To optimize performance"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which hook is used for performing side effects in functional components?",
        options: [
          "useEffect",
          "useContext",
          "useReducer",
          "useCallback"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "What does the useCallback hook optimize?",
        options: [
          "Component rendering performance",
          "Memory allocation",
          "Network requests",
          "State management"
        ],
        correctAnswer: 0
      }
    ]
  };

  return (
    <section className="example-section" id="examples">
      <div className="container">
        <div className="example-header">
          <h2 className="section-title">Example Output</h2>
          <p className="section-subtitle">
            See how QuizGen AI transforms your content into professional quizzes
          </p>
        </div>

        <div className="example-content">
          <div className="example-topic">
            <span className="topic-label">Topic</span>
            <h3>{exampleQuiz.topic}</h3>
          </div>

          <div className="example-questions">
            {exampleQuiz.questions.map((question, idx) => (
              <div 
                className="example-question" 
                key={question.id}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="question-number">{question.id}</div>
                <h4>{question.question}</h4>
                <div className="example-options">
                  {question.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`example-option ${index === question.correctAnswer ? 'correct' : ''}`}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{option}</span>
                      {index === question.correctAnswer && (
                        <span className="correct-indicator">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleOutputSection;