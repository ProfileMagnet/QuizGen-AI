import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import InsightsDashboard from '../InsightsDashboard';
import MCQQuestion from './MCQQuestion';
import { exportQuizToPDF } from '../../utils/pdfExporter';
import './MCQQuizDisplay.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
}

interface MCQQuizDisplayProps {
  generatedQuiz: QuizQuestion[];
  onReset: () => void;
  onGenerateMore: () => void;
  isGenerating: boolean;
  quizType?: string; // Add quizType prop
}

const MCQQuizDisplay: React.FC<MCQQuizDisplayProps> = ({
  generatedQuiz,
  onReset,
  onGenerateMore,
  isGenerating,
  quizType = 'Multiple Choice' // Default to 'Multiple Choice' if not provided
}) => {
  // Filter only MCQ and True/False questions
  const mcqQuestions = generatedQuiz.filter(q => q.type === 'mcq' || q.type === 'tf');

  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsPerStep] = useState(5);

  // Ref to track the previous number of questions
  const prevQuestionCount = useRef(mcqQuestions.length);

  // Effect to handle navigation when new questions are generated
  useEffect(() => {
    // If the number of questions increased, navigate to the next step
    if (mcqQuestions.length > prevQuestionCount.current && prevQuestionCount.current > 0) {
      // Calculate which step the new questions would be on
      const newStep = Math.floor(prevQuestionCount.current / questionsPerStep);
      // Only navigate if there's a next step to go to
      if (newStep < getTotalSteps()) {
        setCurrentStep(newStep);
      }
    }

    // Update the ref with the current question count
    prevQuestionCount.current = mcqQuestions.length;
  }, [mcqQuestions.length, questionsPerStep]);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (quizMode === 'review') return;

    if (userAnswers[questionId] !== undefined) return;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleResetAllAnswers = () => {
    if (quizMode === 'review') return;

    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers? This action cannot be undone.'
    );

    if (confirmReset) {
      setUserAnswers({});
      setCurrentStep(0);
    }
  };

  const handleExportQuiz = async () => {
    if (generatedQuiz.length === 0) return;
    try {
      await exportQuizToPDF(generatedQuiz, quizType);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    for (const q of mcqQuestions) {
      if (userAnswers[q.id] === q.correctAnswer) correctAnswers += 1;
    }
    return {
      correct: correctAnswers,
      total: mcqQuestions.length,
      percentage: Math.round((correctAnswers / mcqQuestions.length) * 100)
    };
  };

  const getCurrentStepQuestions = () => {
    const startIndex = currentStep * questionsPerStep;
    const endIndex = startIndex + questionsPerStep;
    return mcqQuestions.slice(startIndex, endIndex);
  };

  const getTotalSteps = () => {
    return Math.ceil(mcqQuestions.length / questionsPerStep);
  };

  const getCurrentStepAnsweredCount = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.filter(q => userAnswers[q.id] !== undefined).length;
  };

  const isCurrentStepComplete = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.length > 0 && currentQuestions.every(q => userAnswers[q.id] !== undefined);
  };

  const allQuestionsAnswered = mcqQuestions.length > 0 &&
    mcqQuestions.every(q => userAnswers[q.id] !== undefined);

  const canGoToNextStep = () => {
    return currentStep < getTotalSteps() - 1;
  };

  const canGoToPrevStep = () => {
    return currentStep > 0;
  };

  return (
    <div className="mcq-quiz-display">
      <div className="quiz-results-container">
        <div className="quiz-results">
          <div className="results-header">
            <div className="quiz-title-section">
              <div className={`step-indicator ${quizMode === 'review' ? 'review-mode' : ''}`}>
                {quizMode === 'review' ? (
                  <>
                    All Questions Review
                    <span className="step-progress">({
                      mcqQuestions.filter(q => userAnswers[q.id] !== undefined).length
                    }/{mcqQuestions.length} answered)</span>
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
                Object.keys(userAnswers).length > 0
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
                      const complete = slice.every(q => userAnswers[q.id] !== undefined);
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
            {(quizMode === 'practice' ? getCurrentStepQuestions() : mcqQuestions).map((question) => (
              <div key={question.id} className="quiz-question-card">
                <div className="question-header">
                  <span className="question-number">{question.id}</span>
                  <h3>{question.question}</h3>
                </div>
                <MCQQuestion
                  question={question as any}
                  quizMode={quizMode}
                  userAnswer={userAnswers[question.id]}
                  onSelect={(idx) => handleOptionSelect(question.id, idx)}
                />
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

          {/* Pagination controls at the bottom */}
          {quizMode === 'practice' && getTotalSteps() > 1 && (
            <div className="step-navigation bottom-pagination">
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
                      const slice = mcqQuestions.slice(index * questionsPerStep, (index + 1) * questionsPerStep);
                      if (slice.length === 0) return '';
                      const complete = slice.every(q => userAnswers[q.id] !== undefined);
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

          <div className="actions bottom-actions">
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
          questions={mcqQuestions}
          userAnswers={userAnswers}
          fibUserAnswers={{}}
          orderingUserOrders={{}}
          matchingUserMatches={{}}
          isVisible={mcqQuestions.length > 0}
        />
      </div>

    </div>
  );
};

export default MCQQuizDisplay;