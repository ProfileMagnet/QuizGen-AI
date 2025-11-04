import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import '../../sections/QuizGeneratorPage.css';

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

  const isAnswered = userAnswer !== undefined;
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <>
      <div className="question-options">
        {question.options.map((option, index) => {
          const status = getStatus(index);
          const isSelected = userAnswer === index;
          return (
            <div
              key={index}
              className={`option ${status !== 'default' ? `option-${status}` : ''} ${isSelected ? 'selected' : ''} ${quizMode === 'practice' && !isAnswered ? 'clickable' : ''} ${isAnswered ? 'disabled' : ''}`}
              onClick={() => {
                if (quizMode === 'practice' && !isAnswered) onSelect(index);
              }}
              style={{ 
                cursor: quizMode === 'practice' && !isAnswered ? 'pointer' : 'not-allowed',
                opacity: quizMode === 'practice' && isAnswered && !isSelected && status !== 'correct' ? 0.6 : 1
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
              {/* Show correct/incorrect indicators in practice mode after answering for all options */}
              {isAnswered && quizMode === 'practice' && status === 'correct' && (
                <span className="feedback-icon correct">✓</span>
              )}
              {isAnswered && quizMode === 'practice' && status === 'incorrect' && (
                <span className="feedback-icon incorrect">✗</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Instant feedback for practice mode */}
      {quizMode === 'practice' && isAnswered && (
        <div className="instant-feedback">
          {isCorrect ? (
            <div className="feedback correct-feedback">
              <CheckCircle className="feedback-icon" size={20} />
              Correct! Well done.
            </div>
          ) : (
            <div className="feedback incorrect-feedback">
              <XCircle className="feedback-icon" size={20} />
              Incorrect. The correct answer is: {question.options[question.correctAnswer]}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MCQQuestion;