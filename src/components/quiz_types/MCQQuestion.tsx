import React from 'react';

interface MCQQuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    type?: 'mcq' | 'tf';
  };
  quizMode: 'practice' | 'review';
  userAnswer?: number;
  onSelect: (optionIndex: number) => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({ question, quizMode, userAnswer, onSelect }) => {
  const getStatus = (optionIndex: number) => {
    if (userAnswer === undefined) return 'default';
    if (optionIndex === question.correctAnswer) return 'correct';
    if (optionIndex === userAnswer) return 'incorrect';
    return 'default';
  };

  return (
    <div className="question-options">
      {question.options.map((option, index) => {
        const status = getStatus(index);
        const isSelected = userAnswer === index;
        const isAnswered = userAnswer !== undefined;
        return (
          <div
            key={index}
            className={`option ${status !== 'default' ? `option-${status}` : ''} ${isSelected ? 'selected' : ''} ${quizMode === 'practice' && !isAnswered ? 'clickable' : ''} ${isAnswered ? 'disabled' : ''}`}
            onClick={() => {
              if (quizMode === 'practice' && !isAnswered) onSelect(index);
            }}
            style={{ 
              cursor: quizMode === 'practice' && !isAnswered ? 'pointer' : 'not-allowed',
              opacity: quizMode === 'practice' && isAnswered && !isSelected ? 0.6 : 1
            }}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
            <span className="option-text">{option}</span>
            {isAnswered && quizMode === 'practice' && isSelected && (
              <span className="lock-indicator" title="Answer locked - use Reset to change">🔒</span>
            )}
            {isAnswered && quizMode === 'review' && (
              <>
                {status === 'correct' && <span className="feedback-icon correct">✓</span>}
                {status === 'incorrect' && <span className="feedback-icon incorrect">✗</span>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MCQQuestion;


