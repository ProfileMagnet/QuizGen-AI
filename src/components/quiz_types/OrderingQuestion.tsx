import React, { useRef, useState } from 'react';
import { Eye, GripVertical } from 'lucide-react';

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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showCorrectOrder, setShowCorrectOrder] = useState(false);
  const contents = question.orderingContents || [];

  const onDragStart = (e: React.DragEvent, idx: number) => {
    if (quizMode !== 'practice') return;
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback to the dragged element
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const onDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(idx);
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
  };

  const onDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (quizMode !== 'practice') return;
    const from = dragIndexRef.current;
    if (from === null || from === idx) return;
    
    const next = currentOrder.slice();
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setOrder(next);
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const isCorrectOrder = () => {
    const correct = question.orderingAnswerIndexList || [];
    return currentOrder.length === correct.length && 
           currentOrder.every((v, i) => v === correct[i]);
  };

  const getCorrectOrderText = () => {
    const correct = question.orderingAnswerIndexList || [];
    return correct.map(index => contents[index]);
  };

  const isLocked = isCorrectOrder() && quizMode === 'practice';

  return (
    <>
      {quizMode === 'practice' && !isLocked && (
        <div className="ordering-instructions">
          <div className="instruction-text">
            <GripVertical size={16} className="drag-icon" />
            Drag and drop the items to arrange them in the correct order
          </div>
          <button
            className="hint-button"
            onClick={() => setShowCorrectOrder(!showCorrectOrder)}
            title="Show/hide correct order"
          >
            <Eye size={16} />
            {showCorrectOrder ? 'Hide' : 'Show'} Answer
          </button>
        </div>
      )}

      {isLocked ? (
        // Locked state - show correct order as static list
        <div className="ordering-locked">
          <div className="locked-header">
            <span className="lock-icon">🔒</span>
            <span className="locked-text">Correct Order Achieved!</span>
          </div>
          <div className="correct-order-display">
            {getCorrectOrderText().map((text, index) => (
              <div key={index} className="correct-order-item">
                <span className="correct-index">{index + 1}.</span>
                <span className="correct-text">{text}</span>
                <span className="check-mark">✓</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Interactive drag and drop state
        <div className="question-options">
          {currentOrder.map((contentIndex, pos) => (
            <div
              key={pos}
              className={`ordering-item ${quizMode === 'practice' ? 'draggable' : ''} ${
                dragOverIndex === pos ? 'drag-over' : ''
              }`}
              draggable={quizMode === 'practice'}
              onDragStart={(e) => onDragStart(e, pos)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOver(e, pos)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, pos)}
            >
              {quizMode === 'practice' && (
                <div className="drag-handle">
                  <GripVertical size={16} />
                </div>
              )}
              <span className="ordering-index">{pos + 1}.</span>
              <span className="ordering-text">{contents[contentIndex]}</span>
            </div>
          ))}
        </div>
      )}

      {showCorrectOrder && !isLocked && (
        <div className="correct-order-hint">
          <h4>Correct Order:</h4>
          <ol className="correct-order-list">
            {getCorrectOrderText().map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};

export default OrderingQuestion;


