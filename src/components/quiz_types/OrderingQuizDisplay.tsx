import React, { useState, useEffect } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import InsightsDashboard from '../InsightsDashboard';
import OrderingQuestion from './OrderingQuestion';
import { exportQuizToPDF } from '../../utils/pdfExporter';
import './OrderingQuizDisplay.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
  orderingContents?: string[];
  orderingAnswerIndexList?: number[];
}

interface OrderingQuizDisplayProps {
  generatedQuiz: QuizQuestion[];
  onReset: () => void;
  onGenerateMore: () => void;
  isGenerating: boolean;
}

const OrderingQuizDisplay: React.FC<OrderingQuizDisplayProps> = ({ 
  generatedQuiz, 
  onReset, 
  onGenerateMore, 
  isGenerating 
}) => {
  // Filter only ordering questions
  const orderingQuestions = generatedQuiz.filter(q => q.type === 'ordering');
  
  const [orderingUserOrders, setOrderingUserOrders] = useState<{ [questionId: number]: number[] }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsPerStep] = useState(5);

  // Initialize ordering user orders when generatedQuiz changes
  useEffect(() => {
    const initialOrders: { [questionId: number]: number[] } = {};
    orderingQuestions.forEach(question => {
      if (question.type === 'ordering') {
        const contents = question.orderingContents || [];
        initialOrders[question.id] = contents.map((_, idx) => idx);
      }
    });
    setOrderingUserOrders(initialOrders);
  }, [orderingQuestions]);

  const handleResetAllAnswers = () => {
    if (quizMode === 'review') return;

    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers? This action cannot be undone.'
    );

    if (confirmReset) {
      const initialOrders: { [questionId: number]: number[] } = {};
      orderingQuestions.forEach(question => {
        if (question.type === 'ordering') {
          const contents = question.orderingContents || [];
          initialOrders[question.id] = contents.map((_, idx) => idx);
        }
      });
      setOrderingUserOrders(initialOrders);
      setCurrentStep(0);
    }
  };

  const handleExportQuiz = async () => {
    if (generatedQuiz.length === 0) return;
    try {
      await exportQuizToPDF(generatedQuiz);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    for (const q of orderingQuestions) {
      if (q.type === 'ordering') {
        const userOrder = orderingUserOrders[q.id];
        if (Array.isArray(userOrder) && Array.isArray(q.orderingAnswerIndexList)) {
          const isCorrect = userOrder.length === q.orderingAnswerIndexList.length &&
            userOrder.every((val, idx) => val === q.orderingAnswerIndexList![idx]);
          if (isCorrect) correctAnswers += 1;
        }
      }
    }
    return {
      correct: correctAnswers,
      total: orderingQuestions.length,
      percentage: Math.round((correctAnswers / orderingQuestions.length) * 100)
    };
  };

  const getCurrentStepQuestions = () => {
    const startIndex = currentStep * questionsPerStep;
    const endIndex = startIndex + questionsPerStep;
    return orderingQuestions.slice(startIndex, endIndex);
  };

  const getTotalSteps = () => {
    return Math.ceil(orderingQuestions.length / questionsPerStep);
  };

  const getCurrentStepAnsweredCount = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.filter(q => {
      if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      }
      return false;
    }).length;
  };

  const isCurrentStepComplete = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.length > 0 && currentQuestions.every(q => {
      if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      }
      return false;
    });
  };

  const allQuestionsAnswered = orderingQuestions.length > 0 &&
    orderingQuestions.every(q => {
      if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      }
      return false;
    });

  const canGoToNextStep = () => {
    return currentStep < getTotalSteps() - 1;
  };

  const canGoToPrevStep = () => {
    return currentStep > 0;
  };

  return (
    <div className="ordering-quiz-display">
      <div className="quiz-results-container">
        <div className="quiz-results">
          <div className="results-header">
            <div className="quiz-title-section">
              <div className={`step-indicator ${quizMode === 'review' ? 'review-mode' : ''}`}>
                {quizMode === 'review' ? (
                  <>
                    All Questions Review
                    <span className="step-progress">({
                      orderingQuestions.filter(q => {
                        if (q.type === 'ordering') {
                          const order = orderingUserOrders[q.id];
                          const correct = q.orderingAnswerIndexList || [];
                          return Array.isArray(order) && order.length === correct.length &&
                            order.every((v, i) => v === correct[i]);
                        }
                        return false;
                      }).length
                    }/{orderingQuestions.length} answered)</span>
                  </>
                ) : (
                  <>
                    Step {currentStep + 1} of {getTotalSteps()}
                    <span className="step-progress">({getCurrentStepAnsweredCount()}/{getCurrentStepQuestions().length} answered)</span>
                  </>
                )}
              </div>
            </div>
            <div className="header-actions">
              {quizMode === 'practice' && allQuestionsAnswered && (
                <button
                  className="review-button"
                  onClick={() => setQuizMode('review')}
                >
                  Review All Answers
                </button>
              )}
              {quizMode === 'review' && (
                <>
                  <button
                    className="review-button"
                    onClick={() => setQuizMode('practice')}
                  >
                    Back to Practice
                  </button>
                  <div className="score-display">
                    Score: {calculateScore().correct}/{calculateScore().total} ({calculateScore().percentage}%)
                  </div>
                </>
              )}
              {quizMode === 'practice' && (
                Object.keys(orderingUserOrders).length > 0
              ) && (
                <button
                  className="reset-all-button"
                  onClick={handleResetAllAnswers}
                  title="Reset all answers"
                >
                  <RotateCcw size={16} />
                  Reset Answers
                </button>
              )}
              <button
                className="generate-more-button"
                onClick={onGenerateMore}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    Generate More
                  </>
                )}
              </button>
              <button className="reset-button" onClick={onReset}>
                Create New Quiz
              </button>
            </div>
          </div>

          {quizMode === 'practice' && (
            <div className="step-navigation">
              <button
                className="nav-button prev"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={!canGoToPrevStep()}
              >
                ← Previous
              </button>
              <div className="step-dots">
                {Array.from({ length: getTotalSteps() }, (_, index) => (
                  <button
                    key={index}
                    className={`step-dot ${index === currentStep ? 'active' : ''} ${(() => {
                      const slice = generatedQuiz.slice(index * questionsPerStep, (index + 1) * questionsPerStep);
                      if (slice.length === 0) return '';
                      const complete = slice.every(q => {
                        if (q.type === 'ordering') {
                          const order = orderingUserOrders[q.id];
                          const correct = q.orderingAnswerIndexList || [];
                          return Array.isArray(order) && order.length === correct.length &&
                            order.every((v, i) => v === correct[i]);
                        }
                        return false;
                      });
                      return complete ? 'completed' : '';
                    })()}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="nav-button next"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canGoToNextStep()}
              >
                Next →
              </button>
            </div>
          )}

          <div className="quiz-questions">
            {(quizMode === 'practice' ? getCurrentStepQuestions() : orderingQuestions).map((question) => (
              <div key={question.id} className="quiz-question-card">
                <div className="question-header">
                  <span className="question-number">{question.id}</span>
                  <h3>{question.question}</h3>
                </div>
                {question.type === 'ordering' ? (
                  (() => {
                    const contents = question.orderingContents || [];
                    const initial = contents.map((_, idx) => idx);
                    const currentOrder = orderingUserOrders[question.id] || initial;
                    return (
                      <OrderingQuestion
                        question={{
                          id: question.id,
                          orderingContents: question.orderingContents,
                          orderingAnswerIndexList: question.orderingAnswerIndexList,
                          type: question.type,
                        }}
                        quizMode={quizMode}
                        currentOrder={currentOrder}
                        setOrder={(next) => setOrderingUserOrders(prev => ({ ...prev, [question.id]: next }))}
                      />
                    );
                  })()
                ) : null}
              </div>
            ))}
          </div>

          {quizMode === 'practice' && isCurrentStepComplete() && canGoToNextStep() && (
            <div className="step-completion">
              <div className="completion-message">
                <span className="completion-icon">🎉</span>
                Great job! You've completed this set of questions.
              </div>
              <button
                className="next-step-button"
                onClick={() => setCurrentStep(prev => prev + 1)}
              >
                Continue to Next Set →
              </button>
            </div>
          )}

          <div className="actions">
            <button
              className="btn btn-secondary"
              onClick={handleExportQuiz}
              title="Export quiz with correct answers"
            >
              <Download size={18} />
              Export Quiz
            </button>
            <button
              className="generate-more-button"
              onClick={onGenerateMore}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Generate More
                </>
              )}
            </button>
          </div>
        </div>

        <InsightsDashboard
          questions={orderingQuestions}
          userAnswers={{}}
          fibUserAnswers={{}}
          orderingUserOrders={orderingUserOrders}
          matchingUserMatches={{}}
          isVisible={orderingQuestions.length > 0}
        />
      </div>

    </div>
  );
};

export default OrderingQuizDisplay;