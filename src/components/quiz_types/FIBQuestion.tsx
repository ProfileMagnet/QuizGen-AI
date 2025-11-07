import React from 'react';

interface FIBQuestionProps {
  question: {
    id: number;
    question: string;
    answersList?: string[];
    type?: 'fib';
  };
  quizMode: 'practice' | 'review';
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  onCheck: () => void;
}

const FIBQuestion: React.FC<FIBQuestionProps> = ({ question, quizMode, value, checked, onChange, onCheck }) => {
  const answers = (question.answersList || []).map(a => a.trim().toLowerCase());
  const userValue = (value || '').trim().toLowerCase();
  const isCorrect = checked && answers.includes(userValue);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quizMode !== 'review' && !checked && (value || '').trim()) {
      onCheck();
    }
  };

  return (
    <>
      <div className="question-options">
        <input
          type="text"
          placeholder="Type your answer"
          value={value || ''}
          onChange={(e) => quizMode !== 'review' && !checked ? onChange(e.target.value) : undefined}
          onKeyDown={handleKeyDown}
          disabled={quizMode === 'review' || !!checked}
        />
        <button
          className="fib-submit-button"
          onClick={() => quizMode !== 'review' && !checked && (value || '').trim() ? onCheck() : undefined}
          disabled={quizMode === 'review' || !(value || '').trim() || !!checked}
          title={checked ? 'Submitted' : 'Submit answer'}
        >
          {checked ? 'Submitted' : 'Submit'}
        </button>
      </div>
      {(!!checked && quizMode === 'practice') && (
        <div className="instant-feedback">
          {isCorrect ? (
            <div className="feedback correct-feedback">
              <div className="feedback-content">
                <span className="feedback-icon">✓</span>
                <span>Correct! Well done.</span>
              </div>
            </div>
          ) : (
            <div className="feedback incorrect-feedback">
              <div className="feedback-content">
                <span className="feedback-icon">✗</span>
                <span>Incorrect.</span>
              </div>
              <strong>Correct answer: {(question.answersList || [])[0] || ''}</strong>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FIBQuestion;