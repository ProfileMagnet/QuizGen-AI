import React, { useRef, useState } from 'react';
import { GripVertical, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

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
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ question, quizMode, currentMatches, setMatches }) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<number | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  
  const left = question.matchingLeft || [];
  const right = question.matchingRight || [];
  const correctAnswers = question.matchingAnswerIndexList || [];

  const handleDragStart = (e: React.DragEvent, rightIndex: number) => {
    if (quizMode !== 'practice') return;
    
    setDraggedItem(rightIndex);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rightIndex.toString());
    
    // Create custom drag image
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    e.dataTransfer.setDragImage(dragElement, rect.width / 2, rect.height / 2);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverTarget(null);
    dragStartPos.current = null;
  };

  const handleDragOver = (e: React.DragEvent, leftIndex: number) => {
    if (quizMode !== 'practice') return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(leftIndex);
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, leftIndex: number) => {
    if (quizMode !== 'practice') return;
    
    e.preventDefault();
    const rightIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (rightIndex !== null && !isNaN(rightIndex)) {
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
    }
    
    setDragOverTarget(null);
    setDraggedItem(null);
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
    return currentMatches.includes(rightIndex);
  };

  return (
    <>
      <div className="matching-instructions">
        <div className="instruction-text">
          <GripVertical className="drag-icon" size={16} />
          Drag items from the right to match with items on the left
        </div>
      </div>

      <div className="question-options">
        <div className="matching-container">
          {/* Left Column */}
          <div className="matching-left-column">
            {left.map((leftItem, leftIndex) => {
              const matchedRightIndex = currentMatches[leftIndex];
              const status = getMatchStatus(leftIndex);
              const isDragOver = dragOverTarget === leftIndex;
              
              return (
                <div
                  key={leftIndex}
                  className={`matching-left-item ${isDragOver ? 'drag-over' : ''} ${status}`}
                  onDragOver={(e) => handleDragOver(e, leftIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, leftIndex)}
                >
                  <div className="matching-left-content">
                    <span className="matching-index">{leftIndex + 1}</span>
                    <span className="matching-text">{leftItem}</span>
                  </div>
                  
                  <div className="matching-connection">
                    {matchedRightIndex !== undefined ? (
                      <div className="matched-item">
                        <ArrowRight size={16} className="arrow-icon" />
                        <span className="matched-text">{right[matchedRightIndex]}</span>
                        {quizMode === 'practice' && (
                          <button
                            className="remove-match-btn"
                            onClick={() => handleRemoveMatch(leftIndex)}
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
                        <span className="drop-text">Drop here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="matching-right-column">
            <div className={`right-column-header ${right.filter((_, index) => !isRightItemUsed(index)).length === 0 ? 'all-matched-header' : ''}`}>
              {right.filter((_, index) => !isRightItemUsed(index)).length > 0 ? (
                <span>Drag these items ({right.filter((_, index) => !isRightItemUsed(index)).length} remaining):</span>
              ) : (
                <span className="all-matched">✓ All items matched!</span>
              )}
            </div>
            {right.map((rightItem, rightIndex) => {
              const isUsed = isRightItemUsed(rightIndex);
              const isDragging = draggedItem === rightIndex;
              
              // Don't render used items at all
              if (isUsed) return null;
              
              return (
                <div
                  key={rightIndex}
                  className={`matching-right-item ${isDragging ? 'dragging' : ''}`}
                  draggable={quizMode === 'practice'}
                  onDragStart={(e) => handleDragStart(e, rightIndex)}
                  onDragEnd={handleDragEnd}
                >
                  <GripVertical size={16} className="drag-handle" />
                  <span className="right-item-text">{rightItem}</span>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* Review Mode - Show Correct Answers */}
      {quizMode === 'review' && (
        <div className="correct-answers-display">
          <h4>Correct Matches:</h4>
          <div className="correct-matches-list">
            {left.map((leftItem, index) => (
              <div key={index} className="correct-match-item">
                <span className="correct-left">{leftItem}</span>
                <ArrowRight size={16} className="correct-arrow" />
                <span className="correct-right">{right[correctAnswers[index]]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MatchingQuestion;


