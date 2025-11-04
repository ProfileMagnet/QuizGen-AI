import React, { useRef } from 'react';

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
  const rightDragIndexRef = useRef<number | null>(null);
  const left = question.matchingLeft || [];
  const right = question.matchingRight || [];

  const onRightDragStart = (idx: number) => {
    if (quizMode !== 'practice') return;
    rightDragIndexRef.current = idx;
  };

  const onLeftDrop = (leftIdx: number) => {
    if (quizMode !== 'practice') return;
    const rightIdx = rightDragIndexRef.current;
    if (rightIdx === null) return;
    const next = currentMatches.slice();
    next[leftIdx] = rightIdx;
    setMatches(next);
    rightDragIndexRef.current = null;
  };

  const onLeftDragOver = (e: React.DragEvent) => e.preventDefault();

  const isComplete = () => Array.isArray(currentMatches) && currentMatches.length === left.length && currentMatches.every(v => typeof v === 'number');

  return (
    <>
      <div className="question-options">
        <div className="matching-dnd">
          <div className="matching-left-col">
            {left.map((l, i) => (
              <div key={i} className="matching-row" onDragOver={onLeftDragOver} onDrop={() => onLeftDrop(i)}>
                <span className="matching-left">{l}</span>
                <span className="matching-assigned">{currentMatches[i] !== undefined ? right[currentMatches[i] as number] : 'Drop here'}</span>
              </div>
            ))}
          </div>
          <div className="matching-right-col">
            {right.map((r, idx) => (
              <div key={idx} className="matching-right-item" draggable={quizMode === 'practice'} onDragStart={() => onRightDragStart(idx)}>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
      {(Array.isArray(currentMatches) && quizMode === 'practice') && (
        <div className="instant-feedback">
          {(() => {
            const user = currentMatches || [];
            const correct = question.matchingAnswerIndexList || [];
            const ok = isComplete() && user.length === correct.length && user.every((v, i) => v === correct[i]);
            return ok ? (
              <div className="feedback correct-feedback">
                <span className="feedback-icon">✓</span>
                All matches are correct.
              </div>
            ) : (
              <div className="feedback incorrect-feedback">
                <div className="feedback-content">
                  <span className="feedback-icon">✗</span>
                  <span>Some matches are incorrect.</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};

export default MatchingQuestion;


