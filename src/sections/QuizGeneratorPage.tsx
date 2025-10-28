import React, { useState } from 'react';
import { ArrowLeft, Sparkles, RotateCcw, Download } from 'lucide-react';
import InsightsDashboard from '../components/InsightsDashboard';
import ConfettiAnimation from '../components/ConfettiAnimation';
import LoadingAnimation from '../components/LoadingAnimation';
import { exportQuizToPDF } from '../utils/pdfExporter';
import './QuizGeneratorPage.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsPerStep] = useState(5);

  const handleGenerateQuiz = async (isGenerateMore = false) => {
    if (!topic.trim() || !apiKey.trim()) {
      alert('Please provide both topic and Hugging Face API key');
      return;
    }
    setIsGenerating(true);

    try {
      console.log('Making API request with:', {
        text: `Generate a quiz about: ${topic}`,
        api_key: apiKey.substring(0, 10) + '...' // Log partial key for debugging
      });

      const resp = await fetch('https://quiz-generator-from-text.onrender.com/create_quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: `Generate a quiz about: ${topic}`,
          api_key: apiKey
        })
      });

      console.log('Response status:', resp.status);
      console.log('Response headers:', resp.headers);

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Error response:', text);
        throw new Error(text || `Request failed with status ${resp.status}`);
      }

      const data = await resp.json();
      console.log('API Response:', data);

      // The API returns { quiz: [...] } structure
      if (!data.quiz || !Array.isArray(data.quiz)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from API');
      }

      // The API returns questions with question, options array, and answer_index
      const normalized = data.quiz.map((q: any, idx: number) => ({
        id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer_index,
      }));

      console.log('Normalized questions:', normalized);

      if (isGenerateMore) {
        setGeneratedQuiz(prev => [...prev, ...normalized]);
        // Show confetti for "Generate More" as well
        setShowConfetti(true);
      } else {
        setGeneratedQuiz(normalized);
        setCurrentStep(0);
        setUserAnswers({});
        setQuizMode('practice');
        // Show confetti celebration
        setShowConfetti(true);
      }
    } catch (e) {
      console.error('Full error:', e);
      alert(`Failed to generate quiz: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setApiKey('');
    setGeneratedQuiz([]);
    setUserAnswers({});
    setQuizMode('practice');
    setCurrentStep(0);
    setShowConfetti(false);
  };

  const handleGenerateMore = () => {
    handleGenerateQuiz(true);
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (quizMode === 'review') return; // Don't allow changes in review mode
    
    // Don't allow changing answer if already selected (fixed once selected)
    if (userAnswers[questionId] !== undefined) return;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleResetAllAnswers = () => {
    if (quizMode === 'review') return; // Don't allow changes in review mode
    
    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers? This action cannot be undone.'
    );
    
    if (confirmReset) {
      setUserAnswers({});
      setCurrentStep(0); // Reset to first step
    }
  };

  const handleExportQuiz = () => {
    if (generatedQuiz.length === 0) return;
    exportQuizToPDF(generatedQuiz);
  };

  const getOptionStatus = (questionId: number, optionIndex: number) => {
    const userAnswer = userAnswers[questionId];
    const question = generatedQuiz.find(q => q.id === questionId);

    if (!question || userAnswer === undefined) return 'default';

    if (optionIndex === question.correctAnswer) {
      return 'correct';
    } else if (optionIndex === userAnswer) {
      return 'incorrect';
    }

    return 'default';
  };

  const calculateScore = () => {
    const correctAnswers = generatedQuiz.filter(q =>
      userAnswers[q.id] === q.correctAnswer
    ).length;
    return {
      correct: correctAnswers,
      total: generatedQuiz.length,
      percentage: Math.round((correctAnswers / generatedQuiz.length) * 100)
    };
  };

  const getCurrentStepQuestions = () => {
    const startIndex = currentStep * questionsPerStep;
    const endIndex = startIndex + questionsPerStep;
    return generatedQuiz.slice(startIndex, endIndex);
  };

  const getTotalSteps = () => {
    return Math.ceil(generatedQuiz.length / questionsPerStep);
  };

  const getCurrentStepAnsweredCount = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.filter(q => userAnswers[q.id] !== undefined).length;
  };

  const isCurrentStepComplete = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.length > 0 && currentQuestions.every(q => userAnswers[q.id] !== undefined);
  };

  const allQuestionsAnswered = generatedQuiz.length > 0 &&
    generatedQuiz.every(q => userAnswers[q.id] !== undefined);

  const canGoToNextStep = () => {
    return currentStep < getTotalSteps() - 1;
  };

  const canGoToPrevStep = () => {
    return currentStep > 0;
  };

  return (
    <div className="quiz-generator-page">
      {/* Loading Animation Overlay */}
      {isGenerating && <LoadingAnimation message="Generating your quiz..." />}
      
      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiAnimation 
          onComplete={() => setShowConfetti(false)} 
          duration={4000}
        />
      )}

      <div className="container">
        <div className="quiz-header">
          <button
            className="back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Home
          </button>
          <div className="quiz-header-content">
            <h1 className="page-title">
              <img 
                src="/icon.png" 
                alt="QuizGen AI" 
                className="title-icon"
              />
              QuizGen AI
            </h1>
          </div>
        </div>

        {generatedQuiz.length === 0 ? (
          <div className="generator-form">
            <div className="form-card">
              <h2>Create Your Quiz</h2>
              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                  type="text"
                  id="topic"
                  placeholder="Enter a topic (e.g., JavaScript, History, Biology)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiKey">Hugging Face API Key</label>
                <input
                  type="password"
                  id="apiKey"
                  placeholder="Enter your Hugging Face API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <small className="form-help">
                  Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">Hugging Face Settings</a>
                </small>
              </div>

              <button
                className="generate-button"
                onClick={() => handleGenerateQuiz(false)}
                disabled={isGenerating || !topic.trim() || !apiKey.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating Quiz
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-results-container">
            <div className="quiz-results">
              <div className="results-header">
                <div className="quiz-title-section">
                  <div className={`step-indicator ${quizMode === 'review' ? 'review-mode' : ''}`}>
                    {quizMode === 'review' ? (
                      <>
                        All Questions Review
                        <span className="step-progress">({Object.keys(userAnswers).length}/{generatedQuiz.length} answered)</span>
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
                  {quizMode === 'practice' && Object.keys(userAnswers).length > 0 && (
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
                    onClick={handleGenerateMore}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="spinner"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate More
                      </>
                    )}
                  </button>
                  <button className="reset-button" onClick={handleReset}>
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
                        className={`step-dot ${index === currentStep ? 'active' : ''} ${generatedQuiz.slice(index * questionsPerStep, (index + 1) * questionsPerStep)
                          .every(q => userAnswers[q.id] !== undefined) ? 'completed' : ''
                          }`}
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
                {(quizMode === 'practice' ? getCurrentStepQuestions() : generatedQuiz).map((question) => (
                  <div key={question.id} className="quiz-question-card">
                    <div className="question-header">
                      <span className="question-number">{question.id}</span>
                      <h3>{question.question}</h3>
                    </div>
                    <div className="question-options">
                      {question.options.map((option, index) => {
                        const status = getOptionStatus(question.id, index);
                        const isSelected = userAnswers[question.id] === index;
                        const isAnswered = userAnswers[question.id] !== undefined;

                        return (
                          <div
                            key={index}
                            className={`option ${status !== 'default' ? `option-${status}` : ''} ${isSelected ? 'selected' : ''} ${quizMode === 'practice' && !isAnswered ? 'clickable' : ''} ${isAnswered ? 'disabled' : ''}`}
                            onClick={() => handleOptionSelect(question.id, index)}
                            style={{ 
                              cursor: quizMode === 'practice' && !isAnswered ? 'pointer' : 'not-allowed',
                              opacity: quizMode === 'practice' && isAnswered && !isSelected ? 0.6 : 1
                            }}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="option-text">{option}</span>
                            {isAnswered && quizMode === 'practice' && isSelected && (
                              <span className="lock-indicator" title="Answer locked - use Reset to change">🔒</span>
                            )}
                            {isAnswered && quizMode === 'review' && (
                              <>
                                {status === 'correct' && <span className="feedback-icon correct">✓</span>}
                                {status === 'incorrect' && <span className="feedback-icon incorrect">✗</span>}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {userAnswers[question.id] !== undefined && quizMode === 'practice' && (
                      <div className="instant-feedback">
                        {userAnswers[question.id] === question.correctAnswer ? (
                          <div className="feedback correct-feedback">
                            <span className="feedback-icon">✓</span>
                            Correct! Well done.
                          </div>
                        ) : (
                          <div className="feedback incorrect-feedback">
                            <div className="feedback-content">
                              <span className="feedback-icon">✗</span>
                              <span>Incorrect. The correct answer is:</span>
                            </div>
                            <strong>{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</strong>
                          </div>
                        )}
                      </div>
                    )}
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
                  onClick={handleGenerateMore}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate More
                    </>
                  )}
                </button>
              </div>
            </div>

            <InsightsDashboard
              questions={generatedQuiz}
              userAnswers={userAnswers}
              isVisible={generatedQuiz.length > 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGeneratorPage;