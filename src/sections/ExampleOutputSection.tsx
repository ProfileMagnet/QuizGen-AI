import React from 'react';
import './ExampleOutputSection.css';

const ExampleOutputSection: React.FC = () => {
  // Sample example outputs
  const examples = [
    {
      title: "History Lesson Quiz",
      content: "The American Civil War was fought from 1861 to 1865 between the North (Union) and the South (Confederacy). The primary cause was the dispute over slavery and states' rights. The war ended with the surrender of Confederate General Robert E. Lee to Union General Ulysses S. Grant at Appomattox Court House.",
      questions: [
        {
          question: "What years were the American Civil War fought?",
          options: ["1855-1860", "1861-1865", "1865-1870", "1850-1855"],
          answer: "1861-1865"
        },
        {
          question: "What was the primary cause of the American Civil War?",
          options: ["Taxation", "Slavery and states' rights", "Trade disputes", "Religious differences"],
          answer: "Slavery and states' rights"
        },
        {
          question: "Who surrendered to end the Civil War?",
          options: ["Abraham Lincoln", "Jefferson Davis", "Robert E. Lee", "Ulysses S. Grant"],
          answer: "Robert E. Lee"
        }
      ]
    },
    {
      title: "Science Lesson Quiz",
      content: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct.",
      questions: [
        {
          question: "What is photosynthesis?",
          options: [
            "A process that breaks down food",
            "A process that uses sunlight to make food",
            "A process that removes carbon dioxide from the air",
            "A process that creates chlorophyll"
          ],
          answer: "A process that uses sunlight to make food"
        },
        {
          question: "What pigment is generally involved in photosynthesis?",
          options: ["Melanin", "Chlorophyll", "Carotene", "Anthocyanin"],
          answer: "Chlorophyll"
        },
        {
          question: "What is produced as a byproduct of photosynthesis?",
          options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Methane"],
          answer: "Oxygen"
        }
      ]
    }
  ];

  return (
    <section className="example-output-section" id="examples">
      <div className="container">
        <div className="example-output-header">
          <h2 className="section-title">Example Outputs</h2>
          <p className="section-subtitle">
            See how QuizGen AI transforms educational content into engaging quizzes
          </p>
        </div>
        
        <div className="example-output-content">
          {examples.map((example, index) => (
            <div className="example-card" key={index}>
              <div className="example-header">
                <h3>{example.title}</h3>
              </div>
              
              <div className="example-content">
                <div className="example-text">
                  <h4>Input Content:</h4>
                  <p>{example.content}</p>
                </div>
                
                <div className="example-quiz">
                  <h4>Generated Quiz:</h4>
                  <div className="quiz-questions">
                    {example.questions.map((q, qIndex) => (
                      <div className="quiz-question" key={qIndex}>
                        <p className="question-text">{qIndex + 1}. {q.question}</p>
                        <div className="quiz-options">
                          {q.options.map((option, oIndex) => (
                            <div 
                              className={`quiz-option ${option === q.answer ? 'correct' : ''}`} 
                              key={oIndex}
                            >
                              <span className="option-letter">
                                {String.fromCharCode(65 + oIndex)}.
                              </span>
                              <span className="option-text">{option}</span>
                              {option === q.answer && (
                                <span className="correct-indicator">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleOutputSection;