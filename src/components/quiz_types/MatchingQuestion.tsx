import React, { memo, useState } from 'react';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import './MatchingQuestion.css';

interface MatchingQuestionProps {
  question: {
    id: number;
    matchingLeft?: string[];
    matchingRight?: string[];
    matchingAnswerIndexList?: number[];
    type?: 'matching';
  };
  quizMode: 'practice' | 'review';
  currentMatches: (number | undefined)[];
  setMatches: (next: (number | undefined)[]) => void;
  questionNumber?: number;
  totalQuestions?: number;
  timer?: number;
  score?: number;
  onSubmit?: () => void;
  isSubmitted?: boolean;
  onQuestionSubmit?: () => void;
  onResetQuestion?: () => void;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ 
  question, 
  quizMode, 
  currentMatches, 
  setMatches,
  questionNumber,
  isSubmitted = false,
  onQuestionSubmit,
  onResetQuestion,
}) => {
  const left = question.matchingLeft || [];
  const right = question.matchingRight || [];
  const correctAnswers = question.matchingAnswerIndexList || [];
  
  // State to track selected question index and selected answer index
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const handleQuestionSelect = (index: number) => {
    if (quizMode !== 'practice') return;
    // Prevent selection if all matches are complete
    if (isComplete()) return;
    setSelectedQuestionIndex(index);
    // Clear answer selection when changing question
    setSelectedAnswerIndex(null);
  };

  const handleAnswerSelect = (index: number) => {
    if (quizMode !== 'practice' || selectedQuestionIndex === null) return;
    // Prevent selection if all matches are complete
    if (isComplete()) return;
    
    // Set the match
    const newMatches = [...currentMatches];
    newMatches[selectedQuestionIndex] = index;
    setMatches(newMatches);
    
    // Clear selections after matching
    setSelectedQuestionIndex(null);
    setSelectedAnswerIndex(null);
  };

  const handleRemoveMatch = (leftIndex: number) => {
    if (quizMode !== 'practice') return;
    // Prevent removal if all matches are complete
    if (isComplete()) return;
    
    const newMatches = [...currentMatches];
    newMatches[leftIndex] = undefined;
    setMatches(newMatches);
  };

  const isComplete = () => {
    return currentMatches.length === left.length && 
           currentMatches.every(match => typeof match === 'number');
  };

  const isCorrect = () => {
    return isComplete() && 
           currentMatches.every((match, index) => match === correctAnswers[index]);
  };

  const getMatchStatus = (leftIndex: number) => {
    if (quizMode === 'review' && currentMatches[leftIndex] !== undefined) {
      return currentMatches[leftIndex] === correctAnswers[leftIndex] ? 'correct' : 'incorrect';
    }
    return 'none';
  };

  const isRightItemUsed = (rightIndex: number) => {
    // Check if the rightIndex appears as a value in currentMatches array
    const used = currentMatches.some(match => match === rightIndex);
    return used;
  };




  return (
    <>
      {/* Header Section */}
      <div className="matching-header">
        <div>
          <h2 className="matching-title">
            {questionNumber !== undefined ? `${questionNumber}. ` : ''}
            Match the Following
          </h2>
          <p className="matching-subtitle">Select a question first, then select an answer to match them.</p>
        </div>
        <div>
          {quizMode === 'practice' && (
            <button 
              className="reset-question-btn"
              onClick={onResetQuestion}
              title="Reset this question"
            >
              ↻
            </button>
          )}
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="question-options">
        <div className="matching-container">
          {/* Left Column - Questions at the top */}
          <div className="matching-column matching-left-column">
            <div className="column-header">Questions</div>
            {left.map((leftItem, leftIndex) => {
              const matchedRightIndex = currentMatches[leftIndex];
              const status = getMatchStatus(leftIndex);
              const isSelected = selectedQuestionIndex === leftIndex;
              
              return (
                <div
                  key={leftIndex}
                  className={`matching-left-item ${isSelected ? 'selected' : ''} ${status} ${isComplete() ? 'locked' : ''}`}
                  onClick={() => handleQuestionSelect(leftIndex)}
                  style={{ cursor: isComplete() ? 'not-allowed' : 'pointer' }}
                >
                  <div className="matching-left-content">
                    <span className="matching-index">{leftIndex + 1}.</span>
                    <span className="matching-text">{leftItem}</span>
                  </div>
                  
                  <div className="matching-connection">
                    {matchedRightIndex !== undefined ? (
                      <div className="matched-item">
                        <span className="matched-text">{right[matchedRightIndex]}</span>
                        <ArrowRight size={16} className="arrow-icon" />
                        {quizMode === 'practice' && !isComplete() && (
                          <button
                            className="remove-match-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMatch(leftIndex);
                            }}
                            title="Remove match"
                          >
                            ×
                          </button>
                        )}
                        {quizMode === 'review' && (
                          <div className="match-status-icon">
                            {status === 'correct' ? (
                              <CheckCircle size={16} className="correct-icon" />
                            ) : (
                              <XCircle size={16} className="incorrect-icon" />
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="drop-zone">
                        <span className="drop-text">Select an answer</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Answers at the bottom */}
          <div className="matching-right-column">
            <div className="column-header">Answers</div>
            <div className="right-column-content">
              {right.map((rightItem, rightIndex) => {
                const isUsed = isRightItemUsed(rightIndex);
                const isSelected = selectedAnswerIndex === rightIndex;
                // Generate alphabetic labels (A, B, C, D, etc.)
                const alphabetLabel = String.fromCharCode(65 + rightIndex); // 65 is 'A' in ASCII
                
                return (
                  <div
                    key={rightIndex}
                    className={`matching-right-item ${isUsed ? 'used' : ''} ${isSelected ? 'selected' : ''} ${isComplete() ? 'locked' : ''}`}
                    onClick={() => {
                      if (!isUsed && selectedQuestionIndex !== null && !isComplete()) {
                        handleAnswerSelect(rightIndex);
                      }
                    }}
                    style={{ cursor: (isUsed || isComplete()) ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="right-item-label">{alphabetLabel}.</span>
                    <span className="right-item-text">{rightItem}</span>
                    {isUsed && (
                      <div className="used-indicator">Matched</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="matching-actions">
        {quizMode === 'practice' && !isSubmitted && (
          <>
            <button 
              className="action-btn submit-btn"
              disabled={!isComplete()}
              onClick={onQuestionSubmit}
            >
              Check Answer
            </button>
          </>
        )}
        {quizMode === 'practice' && isSubmitted && (
          <div className="question-feedback">
            {isCorrect() ? (
              <div className="feedback correct-feedback">
                <CheckCircle className="feedback-icon" size={20} />
                Correct! Well done.
              </div>
            ) : (
              <div className="feedback incorrect-feedback">
                <XCircle className="feedback-icon" size={20} />
                Some matches are incorrect. Check the correct answers below.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback - Only show this when not in submitted state */}
      {quizMode === 'practice' && isComplete() && !isSubmitted && (
        <div className="instant-feedback">
          {isCorrect() ? (
            <div className="feedback correct-feedback">
              <CheckCircle className="feedback-icon" size={20} />
              Perfect! All matches are correct.
            </div>
          ) : (
            <div className="feedback incorrect-feedback">
              <div className="feedback-content">
                <XCircle className="feedback-icon" size={20} />
                <span>Some matches are incorrect.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Mode for Individual Question */}
      {quizMode === 'practice' && isSubmitted && (
        <div className="review-mode-display">
          <h4>Correct Matches:</h4>
          <div className="review-matches-list">
            {left.map((leftItem, index) => {
              const userAnswerIndex = currentMatches[index];
              const correctAnswerIndex = correctAnswers[index];
              const isCorrect = userAnswerIndex === correctAnswerIndex;
              
              return (
                <div key={index} className={`review-match-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-match-content">
                    <span className="review-left">{leftItem}</span>
                    <div className="review-connection">
                      <ArrowRight size={16} className="review-arrow" />
                      {userAnswerIndex !== undefined ? (
                        <span className="review-user-answer">{right[userAnswerIndex]}</span>
                      ) : (
                        <span className="review-user-answer empty">No answer</span>
                      )}
                      <div className="review-status-icon">
                        {isCorrect ? (
                          <CheckCircle size={16} className="correct-icon" />
                        ) : (
                          <XCircle size={16} className="incorrect-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                  {!isCorrect && (
                    <div className="correct-answer-display">
                      <span className="correct-label">Correct:</span>
                      <span className="correct-answer">{right[correctAnswerIndex]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Mode - Show User Answers with Correct/Incorrect Indicators */}
      {quizMode === 'review' && (
        <div className="review-mode-display">
          <h4>Your Answers & Correct Matches:</h4>
          <div className="review-matches-list">
            {left.map((leftItem, index) => {
              const userAnswerIndex = currentMatches[index];
              const correctAnswerIndex = correctAnswers[index];
              const isCorrect = userAnswerIndex === correctAnswerIndex;
              
              return (
                <div key={index} className={`review-match-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-match-content">
                    <span className="review-left">{leftItem}</span>
                    <div className="review-connection">
                      <ArrowRight size={16} className="review-arrow" />
                      {userAnswerIndex !== undefined ? (
                        <span className="review-user-answer">{right[userAnswerIndex]}</span>
                      ) : (
                        <span className="review-user-answer empty">No answer</span>
                      )}
                      <div className="review-status-icon">
                        {isCorrect ? (
                          <CheckCircle size={16} className="correct-icon" />
                        ) : (
                          <XCircle size={16} className="incorrect-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                  {!isCorrect && (
                    <div className="correct-answer-display">
                      <span className="correct-label">Correct:</span>
                      <span className="correct-answer">{right[correctAnswerIndex]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


    </>
  );
};

export default memo(MatchingQuestion);