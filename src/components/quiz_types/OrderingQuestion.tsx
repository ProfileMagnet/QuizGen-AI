import React, { useRef } from 'react';

interface OrderingQuestionProps {
  question: {
    id: number;
    orderingContents?: string[];
    orderingAnswerIndexList?: number[];
    type?: 'ordering';
  };
  quizMode: 'practice' | 'review';
  currentOrder: number[];
  setOrder: (nextOrder: number[]) => void;
}

const OrderingQuestion: React.FC<OrderingQuestionProps> = ({ question, quizMode, currentOrder, setOrder }) => {
  const dragIndexRef = useRef<number | null>(null);
  const contents = question.orderingContents || [];

  const onDragStart = (idx: number) => {
    if (quizMode !== 'practice') return;
    dragIndexRef.current = idx;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (idx: number) => {
    if (quizMode !== 'practice') return;
    const from = dragIndexRef.current;
    if (from === null || from === idx) return;
    const next = currentOrder.slice();
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setOrder(next);
    dragIndexRef.current = null;
  };

  return (
    <>
      <div className="question-options">
        {currentOrder.map((contentIndex, pos) => (
          <div
            key={pos}
            className="ordering-item"
            draggable={quizMode === 'practice'}
            onDragStart={() => onDragStart(pos)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(pos)}
          >
            <span className="ordering-index">{pos + 1}.</span>
            <span className="ordering-text">{contents[contentIndex]}</span>
          </div>
        ))}
      </div>
      {(currentOrder.length > 0 && quizMode === 'practice') && (
        <div className="instant-feedback">
          {(() => {
            const correct = (question.orderingAnswerIndexList || []);
            const ok = currentOrder.length === correct.length && currentOrder.every((v, i) => v === correct[i]);
            return ok ? (
              <div className="feedback correct-feedback">
                <span className="feedback-icon">✓</span>
                Order is correct.
              </div>
            ) : (
              <div className="feedback incorrect-feedback">
                <div className="feedback-content">
                  <span className="feedback-icon">✗</span>
                  <span>Current order differs from the correct solution.</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};

export default OrderingQuestion;


