import React, { memo } from 'react';
import { GripVertical, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
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

// Draggable item component
const DraggableItem: React.FC<{
  id: number;
  index: number;
  text: string;
  isUsed: boolean;
  quizMode: 'practice' | 'review';
}> = ({ id, index, text, isUsed, quizMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'answer',
    item: { id, index },
    canDrag: quizMode === 'practice' && !isUsed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (isUsed) {
    return null;
  }

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`matching-right-item ${isDragging ? 'dragging' : ''}`}
    >
      <GripVertical size={16} className="drag-handle" />
      <span className="right-item-text">{text}</span>
    </div>
  );
};

const MemoizedDraggableItem = memo(DraggableItem);

// Drop zone component
const DropZone: React.FC<{
  leftIndex: number;
  leftItem: string;
  matchedRightIndex: number | undefined;
  rightItems: string[];
  quizMode: 'practice' | 'review';
  status: string;
  onDrop: (leftIndex: number, rightIndex: number) => void;
  onRemove: (leftIndex: number) => void;
}> = ({ leftIndex, leftItem, matchedRightIndex, rightItems, quizMode, status, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'answer',
    drop: (item: { index: number }) => {
      onDrop(leftIndex, item.index);
    },
    canDrop: () => {
      const can = quizMode === 'practice';
      return can;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      className={`matching-left-item ${isOver ? 'drag-over' : ''} ${status}`}
    >
      <div className="matching-left-content">
        <span className="matching-index">{leftIndex + 1}.</span>
        <span className="matching-text">{leftItem}</span>
      </div>
      
      <div 
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className="matching-connection"
      >
        {matchedRightIndex !== undefined ? (
          <div className="matched-item">
            <span className="matched-text">{rightItems[matchedRightIndex]}</span>
            <ArrowRight size={16} className="arrow-icon" />
            {quizMode === 'practice' && (
              <button
                className="remove-match-btn"
                onClick={() => onRemove(leftIndex)}
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
            <span className="drop-text">Drop your answer here</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MemoizedDropZone = memo(DropZone);

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ 
  question, 
  quizMode, 
  currentMatches, 
  setMatches,
  questionNumber = 1,
  totalQuestions = 1,
  score = 0,
  isSubmitted = false,
  onQuestionSubmit,
  onResetQuestion
}) => {
  const left = question.matchingLeft || [];
  const right = question.matchingRight || [];
  const correctAnswers = question.matchingAnswerIndexList || [];

  const handleDrop = (leftIndex: number, rightIndex: number) => {
    if (quizMode !== 'practice') return;
    
    const newMatches = [...currentMatches];
    
    // Remove this right item from any existing matches
    for (let i = 0; i < newMatches.length; i++) {
      if (newMatches[i] === rightIndex) {
        newMatches[i] = undefined;
      }
    }
    
    // Set the new match
    newMatches[leftIndex] = rightIndex;
    setMatches(newMatches);
  };

  const handleRemoveMatch = (leftIndex: number) => {
    if (quizMode !== 'practice') return;
    
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

  const calculateProgress = () => {
    const answeredCount = currentMatches.filter(match => match !== undefined).length;
    return Math.round((answeredCount / left.length) * 100);
  };

  const getEncouragementMessage = () => {
    // Use score for encouragement message in review mode, progress for practice mode
    const value = quizMode === 'review' ? score : calculateProgress();
    if (value === 100) return "🎉 Perfect!";
    if (value >= 80) return "🔥 Keep going!";
    if (value >= 50) return "👍 Good progress!";
    if (value > 0) return "💪 Keep it up!";
    return "🚀 Start matching!";
  };

  return (
    <>
      {/* Header Section */}
      <div className="matching-header">
        <div>
          <h2 className="matching-title">Match the Following</h2>
          <p className="matching-subtitle">Drag items from the right to match with items on the left.</p>
        </div>
        <div>
          <div className="question-progress">Question {questionNumber} of {totalQuestions}</div>
          <div className="timer-score-display">Score: {score}%</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="matching-stats">
        <div className="progress-container">
          <div className="progress-label">
            <span className="progress-text">Progress</span>
            <span className="progress-text">{calculateProgress()}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        <div className="accuracy-display">Accuracy: {score}%</div>
        <div className="encouragement-message">{getEncouragementMessage()}</div>
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
              
              return (
                <MemoizedDropZone
                  key={leftIndex}
                  leftIndex={leftIndex}
                  leftItem={leftItem}
                  matchedRightIndex={matchedRightIndex}
                  rightItems={right}
                  quizMode={quizMode}
                  status={status}
                  onDrop={handleDrop}
                  onRemove={handleRemoveMatch}
                />
              );
            })}
          </div>

          {/* Right Column - Answers at the bottom */}
          <div className="matching-right-column">
            <div className="column-header">Drag Answers</div>
            <div className={`right-column-content ${right.filter((_, index) => !isRightItemUsed(index)).length === 0 ? 'all-matched' : ''}`}>
              {right.map((rightItem, rightIndex) => {
                const isUsed = isRightItemUsed(rightIndex);
                
                return (
                  <MemoizedDraggableItem
                    key={rightIndex}
                    id={rightIndex}
                    index={rightIndex}
                    text={rightItem}
                    isUsed={isUsed}
                    quizMode={quizMode}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="matching-actions">
        {quizMode === 'practice' && !isSubmitted && (
          <button 
            className="action-btn submit-btn"
            disabled={!isComplete()}
            onClick={onQuestionSubmit}
          >
            Check Answer
          </button>
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
        <button 
          className="action-btn reset-btn"
          onClick={() => {
            setMatches(Array(left.length).fill(undefined));
            if (onResetQuestion) {
              onResetQuestion();
            }
          }}
          disabled={quizMode !== 'practice' || isSubmitted}
        >
          Reset
        </button>
        <button 
          className="action-btn next-btn"
          disabled={!isComplete()}
        >
          Next
        </button>
      </div>

      {/* Feedback */}
      {quizMode === 'practice' && isComplete() && (
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
                <span>Some matches are incorrect. Try again!</span>
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