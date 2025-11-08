import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RotateCcw, Download } from 'lucide-react';
import InsightsDashboard from '../InsightsDashboard';
import MatchingQuestion from './MatchingQuestion';
import { exportQuizToPDF } from '../../utils/pdfExporter';
import { exportMatchingQuizToPDF } from '../../utils/matchingPdfExporter';
import './MatchingQuizDisplay.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
  matchingLeft?: string[];
  matchingRight?: string[];
  matchingAnswerIndexList?: number[];
}

interface MatchingQuizDisplayProps {
  generatedQuiz: QuizQuestion[];
  onReset: () => void;
  onGenerateMore: () => void;
  isGenerating: boolean;
}

const MatchingQuizDisplay: React.FC<MatchingQuizDisplayProps> = ({ 
  generatedQuiz, 
  onReset, 
  onGenerateMore, 
  isGenerating 
}) => {
  // Filter only matching questions
  const matchingQuestions = useMemo(() => generatedQuiz.filter(q => q.type === 'matching'), [generatedQuiz]);
  
  const [matchingUserMatches, setMatchingUserMatches] = useState<{ [questionId: number]: (number | undefined)[] }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsPerStep] = useState(5);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
  
  // Ref to track the previous number of questions
  const prevQuestionCount = useRef(matchingQuestions.length);
  
  // Effect to handle navigation when new questions are generated
  useEffect(() => {
    // If the number of questions increased, navigate to the page with new questions
    if (matchingQuestions.length > prevQuestionCount.current && prevQuestionCount.current > 0) {
      // Calculate which step the new questions would be on
      const newStep = Math.floor(prevQuestionCount.current / questionsPerStep);
      // Only navigate if there's a next step to go to
      if (newStep < getTotalSteps()) {
        setCurrentStep(newStep);
      }
    }
    
    // Update the ref with the current question count
    prevQuestionCount.current = matchingQuestions.length;
  }, [matchingQuestions.length, questionsPerStep]);
  
  const getTotalSteps = () => {
    return Math.ceil(matchingQuestions.length / questionsPerStep);
  };

  // Initialize matching user matches when generatedQuiz changes
  useEffect(() => {
    const initialMatches: { [questionId: number]: (number | undefined)[] } = {};
    matchingQuestions.forEach(question => {
      if (question.type === 'matching') {
        const leftLen = (question.matchingLeft || []).length;
        initialMatches[question.id] = Array(leftLen).fill(undefined);
      }
    });
    setMatchingUserMatches(initialMatches);
  }, [matchingQuestions]);

  const handleResetAllAnswers = () => {
    if (quizMode === 'review') return;

    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers? This action cannot be undone.'
    );

    if (confirmReset) {
      const initialMatches: { [questionId: number]: (number | undefined)[] } = {};
      generatedQuiz.forEach(question => {
        if (question.type === 'matching') {
          const leftLen = (question.matchingLeft || []).length;
          initialMatches[question.id] = Array(leftLen).fill(undefined);
        }
      });
      setMatchingUserMatches(initialMatches);
      setCurrentStep(0);
      setSubmittedQuestions(new Set()); // Reset submitted questions
    }
  };

  const handleExportQuiz = async () => {
    if (generatedQuiz.length === 0) return;
    try {
      // Filter matching questions
      const matchingQuestions = generatedQuiz.filter(q => q.type === 'matching');
      
      if (matchingQuestions.length > 0) {
        // Export matching questions using the specialized exporter
        await exportMatchingQuizToPDF(matchingQuestions);
      } else {
        // Export other question types using the general exporter
        await exportQuizToPDF(generatedQuiz);
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const handleSubmitAnswers = () => {
    setQuizMode('review');
  };

  const handleQuestionSubmit = (questionId: number) => {
    setSubmittedQuestions(prev => new Set(prev).add(questionId));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    for (const q of matchingQuestions) {
      if (q.type === 'matching') {
        const userMatches = matchingUserMatches[q.id];
        if (Array.isArray(userMatches) && Array.isArray(q.matchingAnswerIndexList)) {
          const isCorrect = userMatches.length === q.matchingAnswerIndexList.length &&
            userMatches.every((val, idx) => val === q.matchingAnswerIndexList![idx]);
          if (isCorrect) correctAnswers += 1;
        }
      }
    }
    return {
      correct: correctAnswers,
      total: matchingQuestions.length,
      percentage: Math.round((correctAnswers / matchingQuestions.length) * 100)
    };
  };

  const getCurrentStepQuestions = () => {
    const startIndex = currentStep * questionsPerStep;
    const endIndex = startIndex + questionsPerStep;
    return matchingQuestions.slice(startIndex, endIndex);
  };

  const getCurrentStepAnsweredCount = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.filter(q => {
      if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        if (!Array.isArray(matches)) return false;
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return matches.length === leftLen && matches.every(v => v !== undefined);
      }
      return false;
    }).length;
  };

  const isCurrentStepComplete = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.length > 0 && currentQuestions.every(q => {
      if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return Array.isArray(matches) && matches.length === leftLen && matches.every(v => v !== undefined);
      }
      return false;
    });
  };

  const allQuestionsAnswered = matchingQuestions.length > 0 &&
    matchingQuestions.every(q => {
      if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return Array.isArray(matches) && matches.length === leftLen && matches.every(v => v !== undefined);
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
    <DndProvider backend={HTML5Backend}>
      <div className="matching-quiz-display">
        <div className="quiz-results-container">
          <div className="quiz-results">
            <div className="results-header">
              <div className="quiz-title-section">
                <div className={`step-indicator ${quizMode === 'review' ? 'review-mode' : ''}`}>
                  {quizMode === 'review' ? (
                    <>
                      All Questions Review
                      <span className="step-progress">({
                        matchingQuestions.filter(q => {
                          if (q.type === 'matching') {
                            const matches = matchingUserMatches[q.id];
                            const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
                            return Array.isArray(matches) && matches.length === leftLen && matches.every(v => v !== undefined);
                          }
                          return false;
                        }).length
                      }/{matchingQuestions.length} answered)</span>
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
                  Object.keys(matchingUserMatches).length > 0
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
                          if (q.type === 'matching') {
                            const matches = matchingUserMatches[q.id];
                            const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
                            return Array.isArray(matches) && matches.length === leftLen && matches.every(v => v !== undefined);
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
              {(quizMode === 'practice' ? getCurrentStepQuestions() : matchingQuestions).map((question, index) => (
                <div key={question.id} className="quiz-question-card">
                  <div className="question-header">
                    <span className="question-number">{question.id}</span>
                    <h3>{question.question}</h3>
                  </div>
                  {question.type === 'matching' ? (
                    (() => {
                      const leftLen = (question.matchingLeft || []).length;
                      const current = matchingUserMatches[question.id] || Array(leftLen).fill(undefined);
                      return (
                        <MatchingQuestion
                          question={question as any}
                          quizMode={quizMode}
                          currentMatches={current}
                          setMatches={(next) => setMatchingUserMatches(prev => ({ ...prev, [question.id]: next }))}
                          questionNumber={(currentStep * questionsPerStep) + index + 1}
                          totalQuestions={matchingQuestions.length}
                          score={calculateScore().percentage}
                          onSubmit={handleSubmitAnswers}
                          isSubmitted={submittedQuestions.has(question.id)}
                          onQuestionSubmit={() => handleQuestionSubmit(question.id)}
                          onResetQuestion={() => {
                            setSubmittedQuestions(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(question.id);
                              return newSet;
                            });
                          }}
                        />
                      );
                    })()
                  ) : null}
                </div>
              ))}
            </div>



            {quizMode === 'practice' && isCurrentStepComplete() && (
              <>
                <div className="step-completion">
                  <div className="completion-message">
                    <span className="completion-icon">🎉</span>
                    Great job! You've completed this set of questions.
                  </div>
                  <div className="step-actions">
                    <button
                      className="submit-step-button"
                      onClick={handleSubmitAnswers}
                    >
                      Submit Answers & Review Results
                    </button>
                    {canGoToNextStep() && (
                      <button
                        className="next-step-button"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                      >
                        Continue to Next Set →
                      </button>
                    )}
                  </div>
                </div>
              </>
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
                        const slice = matchingQuestions.slice(index * questionsPerStep, (index + 1) * questionsPerStep);
                        if (slice.length === 0) return '';
                        const complete = slice.every(q => {
                          if (q.type === 'matching') {
                            const matches = matchingUserMatches[q.id];
                            const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
                            return Array.isArray(matches) && matches.length === leftLen && matches.every(v => v !== undefined);
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
            questions={matchingQuestions}
            userAnswers={{}}
            fibUserAnswers={{}}
            orderingUserOrders={{}}
            matchingUserMatches={Object.keys(matchingUserMatches).reduce((acc, key) => {
              const questionId = parseInt(key);
              const matches = matchingUserMatches[questionId];
              // Filter out undefined values and convert to number[]
              if (matches) {
                const filteredMatches = matches.filter((m): m is number => m !== undefined);
                if (filteredMatches.length > 0) {
                  acc[questionId] = filteredMatches;
                }
              }
              return acc;
            }, {} as { [questionId: number]: number[] })}
            isVisible={matchingQuestions.length > 0}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default memo(MatchingQuizDisplay);