import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, Sparkles, RotateCcw, Download, BookOpen } from 'lucide-react';
import InsightsDashboard from '../components/InsightsDashboard';
import ConfettiAnimation from '../components/ConfettiAnimation';
import LoadingAnimation from '../components/LoadingAnimation';
import CommonDialog from '../components/CommonDialog';
import MCQQuestion from '../components/quiz_types/MCQQuestion';
import FIBQuestion from '../components/quiz_types/FIBQuestion';
import OrderingQuestion from '../components/quiz_types/OrderingQuestion';
import MatchingQuestion from '../components/quiz_types/MatchingQuestion';
import { exportQuizToPDF } from '../utils/pdfExporter';
import './QuizGeneratorPage.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
  answersList?: string[]; // for FIB (normalized to lowercase for comparison)
  orderingContents?: string[];
  orderingAnswerIndexList?: number[];
  matchingLeft?: string[];
  matchingRight?: string[];
  matchingAnswerIndexList?: number[];
}

const QuizGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium'); // New state for difficulty
  const [quizType, setQuizType] = useState<'Multiple Choice' | 'Fill in the Blanks' | 'True or False' | 'Ordering' | 'Matching'>('Multiple Choice');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [fibUserAnswers, setFibUserAnswers] = useState<{ [questionId: number]: string }>({});
  const [fibChecked, setFibChecked] = useState<{ [questionId: number]: boolean }>({});
  const [orderingUserOrders, setOrderingUserOrders] = useState<{ [questionId: number]: number[] }>({});
  const [matchingUserMatches, setMatchingUserMatches] = useState<{ [questionId: number]: number[] }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsPerStep] = useState(5);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);


  // Memoize the past quiz questions to prevent unnecessary recalculations
  const pastQuizQuestions = useMemo(() => {
    return generatedQuiz.map(q => q.question);
  }, [generatedQuiz]);

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('quizgen-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleGenerateQuiz = useCallback(async (isGenerateMore = false) => {
    if (!topic.trim() || !apiKey.trim()) {
      alert('Please provide both topic and Hugging Face API key');
      return;
    }

    // Save API key to localStorage
    localStorage.setItem('quizgen-api-key', apiKey);

    setIsGenerating(true);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const endpointMap: Record<typeof quizType, string> = {
        'Multiple Choice': 'create_mcqs',
        'Fill in the Blanks': 'create_fill_blanks',
        'True or False': 'create_true_or_false_quiz',
        'Ordering': 'create_ordering_quiz',
        'Matching': 'create_matching_quiz',
      };

      const baseUrl = 'https://quiz-generator-from-text.onrender.com';
      const selectedEndpoint = endpointMap[quizType];

      const basePayload: Record<string, unknown> = {
        text: `Generate a quiz about: ${topic}`,
        level: difficulty.toLowerCase(),
        past_quiz_qns: pastQuizQuestions,
        api_key: apiKey,
      };

      const payload = { ...basePayload };

      console.log('Making API request with:', {
        endpoint: `${baseUrl}/${selectedEndpoint}/`,
        ...payload,
        api_key: (apiKey.substring(0, 10) + '...'),
        quizType,
      });

      // Create a promise that rejects after 60 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout after 60 seconds'));
        }, 60000);
      });

      // Create the fetch promise
      const fetchPromise = fetch(`${baseUrl}/${selectedEndpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify(payload)
      });

      // Race the fetch against the timeout
      const resp = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      console.log('Response status:', resp.status);
      console.log('Response headers:', resp.headers);

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Error response:', text);

        // Handle specific error cases
        if (resp.status === 401 || resp.status === 403 || text.includes('Unauthorized')) {
          // Invalid API key
          throw new Error('Invalid API key. Please check your Hugging Face API key and try again.');
        } else if (resp.status === 429) {
          // Rate limiting
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }

        throw new Error(text || `Request failed with status ${resp.status}`);
      }

      const data = await resp.json();
      console.log('API Response:', data);

      if (quizType === 'Multiple Choice') {
        // Support both { quiz_out: [...] } and legacy { quiz: [...] }
        const mcqArray = Array.isArray(data.quiz_out)
          ? data.quiz_out
          : Array.isArray(data.quiz)
            ? data.quiz
            : null;

        if (!mcqArray) {
          console.error('Unexpected MCQ response format:', data);
          throw new Error('Invalid response format from API (Multiple Choice)');
        }

        // Expected objects: { question: string, options: string[], answer_index: number }
        const normalized = mcqArray.map((q: { question: string; options: string[]; answer_index: number }, idx: number) => ({
          id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.answer_index,
          type: 'mcq',
        }));

        console.log('Normalized MCQ questions:', normalized);

        if (isGenerateMore) {
          setGeneratedQuiz(prev => [...prev, ...normalized]);
          setShowConfetti(true);
        } else {
          setGeneratedQuiz(normalized);
          setCurrentStep(0);
          setUserAnswers({});
          setQuizMode('practice');
          setShowConfetti(true);
        }
      } else if (quizType === 'True or False') {
        // Schema: { quiz_out: [{ question: string, answer: boolean }] }
        if (!data.quiz_out || !Array.isArray(data.quiz_out)) {
          console.error('Unexpected response format for True/False:', data);
          throw new Error('Invalid response format from API (True/False)');
        }

        const normalized = data.quiz_out.map((q: { question: string; answer: boolean }, idx: number) => ({
          id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
          question: q.question,
          options: ['True', 'False'],
          correctAnswer: q.answer ? 0 : 1,
          type: 'tf',
        }));

        if (isGenerateMore) {
          setGeneratedQuiz(prev => [...prev, ...normalized]);
          setShowConfetti(true);
        } else {
          setGeneratedQuiz(normalized);
          setCurrentStep(0);
          setUserAnswers({});
          setQuizMode('practice');
          setShowConfetti(true);
        }
      } else if (quizType === 'Fill in the Blanks') {
        // Schema: { quiz_out: [{ question: string, answers_list: string[] }] }
        if (!data.quiz_out || !Array.isArray(data.quiz_out)) {
          console.error('Unexpected response format for Fill in the Blanks:', data);
          throw new Error('Invalid response format from API (Fill in the Blanks)');
        }

        const normalized = data.quiz_out.map((q: { question: string; answers_list: string[] }, idx: number) => ({
          id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
          question: q.question,
          options: [], // not used for FIB
          correctAnswer: 0, // not used for FIB
          type: 'fib',
          answersList: Array.isArray(q.answers_list) ? q.answers_list.map((a: string) => a.toLowerCase()) : [],
        }));

        if (isGenerateMore) {
          setGeneratedQuiz(prev => [...prev, ...normalized]);
          setShowConfetti(true);
        } else {
          setGeneratedQuiz(normalized);
          setCurrentStep(0);
          setUserAnswers({});
          setFibUserAnswers({});
          setFibChecked({});
          setQuizMode('practice');
          setShowConfetti(true);
        }
      } else if (quizType === 'Ordering') {
        // Schema: { quiz_out: [{ question: string, contents: string[], answer_index_list: number[] }] }
        if (!data.quiz_out || !Array.isArray(data.quiz_out)) {
          console.error('Unexpected response format for Ordering:', data);
          throw new Error('Invalid response format from API (Ordering)');
        }
        const normalized = data.quiz_out.map((q: { question: string; contents: string[]; answer_index_list: number[] }, idx: number) => ({
          id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
          question: q.question || 'Arrange the following in correct order',
          options: [],
          correctAnswer: 0,
          type: 'ordering',
          orderingContents: q.contents,
          orderingAnswerIndexList: q.answer_index_list,
        }));

        if (isGenerateMore) {
          setGeneratedQuiz(prev => [...prev, ...normalized]);
          setShowConfetti(true);
        } else {
          setGeneratedQuiz(normalized);
          setCurrentStep(0);
          setUserAnswers({});
          setFibUserAnswers({});
          setOrderingUserOrders({});
          setMatchingUserMatches({});
          setQuizMode('practice');
          setShowConfetti(true);
        }
      } else if (quizType === 'Matching') {
        // Schema: { quiz_out: [{ left_contents: string[], right_contents: string[], answer_index_list: number[] }] }
        if (!data.quiz_out || !Array.isArray(data.quiz_out)) {
          console.error('Unexpected response format for Matching:', data);
          throw new Error('Invalid response format from API (Matching)');
        }
        const normalized = data.quiz_out.map((q: { left_contents: string[]; right_contents: string[]; answer_index_list: number[] }, idx: number) => ({
          id: isGenerateMore ? generatedQuiz.length + idx + 1 : idx + 1,
          question: 'Match the following',
          options: [],
          correctAnswer: 0,
          type: 'matching',
          matchingLeft: q.left_contents,
          matchingRight: q.right_contents,
          matchingAnswerIndexList: q.answer_index_list,
        }));

        if (isGenerateMore) {
          setGeneratedQuiz(prev => [...prev, ...normalized]);
          setShowConfetti(true);
        } else {
          setGeneratedQuiz(normalized);
          setCurrentStep(0);
          setUserAnswers({});
          setFibUserAnswers({});
          setOrderingUserOrders({});
          setMatchingUserMatches({});
          setQuizMode('practice');
          setShowConfetti(true);
        }
      }

      // Reset retry attempt counter on success
      setRetryAttempt(0);
    } catch (e) {
      console.error('Full error:', e);

      // Check if it's an abort error (user cancelled)
      if (e instanceof Error && e.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }

      // Handle timeout error specifically
      if (e instanceof Error && e.message === 'Request timeout after 60 seconds') {
        // Handle timeout/retry logic for both first and second attempts
        if (retryAttempt === 0) {
          // First timeout - auto retry without showing dialog
          console.log('First timeout, auto retrying...');
          setRetryAttempt(1);
          // We don't show dialog here, just retry automatically
          // The LoadingAnimation will handle the UI update
          return;
        } else {
          // Second timeout - show server down dialog
          setDialogTitle('Server Unresponsive');
          setDialogMessage('The server appears to be down or taking too long to respond. Please try again later.');
          setShowDialog(true);
          setRetryAttempt(0); // Reset for next time
        }
        setIsGenerating(false);
        return;
      }

      // Handle specific error messages
      if (e instanceof Error && (e.message.includes('Invalid API key') || e.message.includes('Unauthorized'))) {
        // Show specific dialog for invalid API key
        setDialogTitle('Invalid API Key');
        setDialogMessage('The provided Hugging Face API key is invalid or unauthorized. Please check your key and try again.');
        setShowDialog(true);
        setRetryAttempt(0); // Reset retry counter
        setIsGenerating(false);
        return;
      }

      // Handle rate limiting
      if (e instanceof Error && e.message.includes('Rate limit exceeded')) {
        setDialogTitle('Rate Limit Exceeded');
        setDialogMessage('You have exceeded the rate limit. Please wait a moment and try again.');
        setShowDialog(true);
        setRetryAttempt(0); // Reset retry counter
        setIsGenerating(false);
        return;
      }

      // Handle other errors (network issues, etc.)
      setDialogTitle('Error Generating Quiz');
      setDialogMessage(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
      setShowDialog(true);
      setRetryAttempt(0); // Reset retry counter
    } finally {
      setIsGenerating(false);
    }
  }, [topic, apiKey, generatedQuiz, retryAttempt, pastQuizQuestions, difficulty, quizType]);

  // Auto retry function
  const handleAutoRetry = useCallback(() => {
    console.log('Auto retry triggered');
    // Call handleGenerateQuiz again for retry
    handleGenerateQuiz(false);
  }, [handleGenerateQuiz]);

  const handleRetry = () => {
    setShowDialog(false);
    // For API key errors, we don't want to retry, just close the dialog
    if (dialogTitle !== 'Invalid API Key' && dialogTitle !== 'Rate Limit Exceeded') {
      // Trigger the quiz generation again
      handleGenerateQuiz(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setRetryAttempt(0); // Reset retry counter
  };

  const handleReset = () => {
    setTopic('');
    setDifficulty('Medium'); // Reset difficulty to default
    setGeneratedQuiz([]);
    setUserAnswers({});
    setQuizMode('practice');
    setCurrentStep(0);
    setShowConfetti(false);
  };

  // Function to clear saved API key
  const clearSavedApiKey = () => {
    localStorage.removeItem('quizgen-api-key');
    setApiKey('');
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

  const handleFibInputChange = (questionId: number, value: string) => {
    if (quizMode === 'review') return;
    setFibUserAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFibCheck = (questionId: number) => {
    if (quizMode === 'review') return;
    const user = (fibUserAnswers[questionId] || '').trim();
    if (!user) return;
    setFibChecked(prev => ({ ...prev, [questionId]: true }));
  };

  const handleResetAllAnswers = () => {
    if (quizMode === 'review') return; // Don't allow changes in review mode

    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers? This action cannot be undone.'
    );

    if (confirmReset) {
      setUserAnswers({});
      setFibUserAnswers({});
      setFibChecked({});
      setOrderingUserOrders({});
      setMatchingUserMatches({});
      setCurrentStep(0); // Reset to first step
    }
  };

  const handleExportQuiz = async () => {
    if (generatedQuiz.length === 0) return;
    try {
      await exportQuizToPDF(generatedQuiz);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      // Optionally show an error message to the user
    }
  };



  const calculateScore = () => {
    let correctAnswers = 0;
    for (const q of generatedQuiz) {
      if (q.type === 'fib') {
        const user = fibUserAnswers[q.id];
        if (user && Array.isArray(q.answersList)) {
          const normalizedUser = user.trim().toLowerCase();
          if (q.answersList.map(a => a.trim().toLowerCase()).includes(normalizedUser)) {
            correctAnswers += 1;
          }
        }
      } else if (q.type === 'ordering') {
        const userOrder = orderingUserOrders[q.id];
        if (Array.isArray(userOrder) && Array.isArray(q.orderingAnswerIndexList)) {
          const isCorrect = userOrder.length === q.orderingAnswerIndexList.length &&
            userOrder.every((val, idx) => val === q.orderingAnswerIndexList![idx]);
          if (isCorrect) correctAnswers += 1;
        }
      } else if (q.type === 'matching') {
        const userMatches = matchingUserMatches[q.id];
        if (Array.isArray(userMatches) && Array.isArray(q.matchingAnswerIndexList)) {
          const isCorrect = userMatches.length === q.matchingAnswerIndexList.length &&
            userMatches.every((val, idx) => val === q.matchingAnswerIndexList![idx]);
          if (isCorrect) correctAnswers += 1;
        }
      } else {
        if (userAnswers[q.id] === q.correctAnswer) correctAnswers += 1;
      }
    }
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
    return currentQuestions.filter(q => {
      if (q.type === 'fib') {
        return fibUserAnswers[q.id] !== undefined && fibUserAnswers[q.id].trim() !== '';
      } else if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      } else if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        if (!Array.isArray(matches)) return false;
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return matches.length === leftLen && matches.every(v => typeof v === 'number');
      }
      return userAnswers[q.id] !== undefined;
    }).length;
  };

  const isCurrentStepComplete = () => {
    const currentQuestions = getCurrentStepQuestions();
    return currentQuestions.length > 0 && currentQuestions.every(q => {
      if (q.type === 'fib') {
        return fibUserAnswers[q.id] !== undefined && fibUserAnswers[q.id].trim() !== '';
      } else if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      } else if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return Array.isArray(matches) && matches.length === leftLen && matches.every(v => typeof v === 'number');
      }
      return userAnswers[q.id] !== undefined;
    });
  };

  const allQuestionsAnswered = generatedQuiz.length > 0 &&
    generatedQuiz.every(q => {
      if (q.type === 'fib') {
        return fibUserAnswers[q.id] !== undefined && fibUserAnswers[q.id].trim() !== '';
      } else if (q.type === 'ordering') {
        const order = orderingUserOrders[q.id];
        const correct = q.orderingAnswerIndexList || [];
        return Array.isArray(order) && order.length === correct.length &&
          order.every((v, i) => v === correct[i]);
      } else if (q.type === 'matching') {
        const matches = matchingUserMatches[q.id];
        const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
        return Array.isArray(matches) && matches.length === leftLen && matches.every(v => typeof v === 'number');
      }
      return userAnswers[q.id] !== undefined;
    });

  const canGoToNextStep = () => {
    return currentStep < getTotalSteps() - 1;
  };

  const canGoToPrevStep = () => {
    return currentStep > 0;
  };

  return (
    <div className="quiz-generator-page">
      {/* Common Dialog for Timeout/Server Issues */}
      <CommonDialog
        isOpen={showDialog}
        title={dialogTitle}
        message={dialogMessage}
        onRetry={handleRetry}
        onCancel={handleCancel}
        retryText={dialogTitle === 'Invalid API Key' ? 'OK' : 'Retry'}
        showRetry={dialogTitle !== 'Invalid API Key' && dialogTitle !== 'Server Unresponsive'}
        showCancel={true}
        type={dialogTitle === 'Invalid API Key' || dialogTitle === 'Rate Limit Exceeded' ? 'error' : dialogTitle === 'Request Taking Longer Than Expected' || dialogTitle === 'Server Unresponsive' ? 'warning' : 'info'}
      />

      {/* Loading Animation Overlay */}
      {isGenerating && <LoadingAnimation message="Generating your quiz..." onTimeout={handleAutoRetry} />}

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
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  className="difficulty-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quizType">Quiz Type</label>
                <select
                  id="quizType"
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value as typeof quizType)}
                  className="difficulty-select"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Fill in the Blanks">Fill in the Blanks</option>
                  <option value="True or False">True or False</option>
                  <option value="Ordering">Ordering</option>
                  <option value="Matching">Matching</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="apiKey">Hugging Face API Key</label>
                <div className="api-key-container">
                  <input
                    type="password"
                    id="apiKey"
                    placeholder="Enter your Hugging Face API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  {apiKey && (
                    <button
                      type="button"
                      className="clear-api-key-button"
                      onClick={clearSavedApiKey}
                      title="Clear saved API key"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="form-help-container">
                  <small className="form-help">
                    Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">Hugging Face Settings</a>
                  </small>
                  <a href="/documentation" className="documentation-link">
                    <BookOpen size={16} />
                    Need help? View our interactive guide
                  </a>
                </div>
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
                        <span className="step-progress">({
                          // total answered across all types
                          generatedQuiz.filter(q => {
                            if (q.type === 'fib') {
                              return (fibUserAnswers[q.id] || '').trim() !== '';
                            } else if (q.type === 'ordering') {
                              const order = orderingUserOrders[q.id];
                              const correct = q.orderingAnswerIndexList || [];
                              return Array.isArray(order) && order.length === correct.length &&
                                order.every((v, i) => v === correct[i]);
                            } else if (q.type === 'matching') {
                              const matches = matchingUserMatches[q.id];
                              const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
                              return Array.isArray(matches) && matches.length === leftLen && matches.every(v => typeof v === 'number');
                            }
                            return userAnswers[q.id] !== undefined;
                          }).length
                        }/{generatedQuiz.length} answered)</span>
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
                    Object.keys(userAnswers).length > 0 ||
                    Object.keys(fibUserAnswers).length > 0 ||
                    Object.keys(orderingUserOrders).length > 0 ||
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
                        className={`step-dot ${index === currentStep ? 'active' : ''} ${(() => {
                          const slice = generatedQuiz.slice(index * questionsPerStep, (index + 1) * questionsPerStep);
                          if (slice.length === 0) return '';
                          const complete = slice.every(q => {
                            if (q.type === 'fib') {
                              return (fibUserAnswers[q.id] || '').trim() !== '';
                            } else if (q.type === 'ordering') {
                              const order = orderingUserOrders[q.id];
                              const correct = q.orderingAnswerIndexList || [];
                              return Array.isArray(order) && order.length === correct.length &&
                                order.every((v, i) => v === correct[i]);
                            } else if (q.type === 'matching') {
                              const matches = matchingUserMatches[q.id];
                              const leftLen = q.matchingLeft ? q.matchingLeft.length : 0;
                              return Array.isArray(matches) && matches.length === leftLen && matches.every(v => typeof v === 'number');
                            }
                            return userAnswers[q.id] !== undefined;
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
                {(quizMode === 'practice' ? getCurrentStepQuestions() : generatedQuiz).map((question) => (
                  <div key={question.id} className="quiz-question-card">
                    <div className="question-header">
                      <span className="question-number">{question.id}</span>
                      <h3>{question.question}</h3>
                    </div>
                    {question.type === 'fib' ? (
                      <FIBQuestion
                        question={question as any}
                        quizMode={quizMode}
                        value={fibUserAnswers[question.id] || ''}
                        checked={!!fibChecked[question.id]}
                        onChange={(val) => handleFibInputChange(question.id, val)}
                        onCheck={() => handleFibCheck(question.id)}
                      />
                    ) : question.type === 'ordering' ? (
                      (() => {
                        const contents = question.orderingContents || [];
                        const initial = contents.map((_, idx) => idx);
                        const currentOrder = orderingUserOrders[question.id] || initial;
                        if (!orderingUserOrders[question.id]) {
                          setOrderingUserOrders(prev => ({ ...prev, [question.id]: currentOrder }));
                        }
                        return (
                          <OrderingQuestion
                            question={question as any}
                            quizMode={quizMode}
                            currentOrder={currentOrder}
                            setOrder={(next) => setOrderingUserOrders(prev => ({ ...prev, [question.id]: next }))}
                          />
                        );
                      })()
                    ) : question.type === 'matching' ? (
                      (() => {
                        const leftLen = (question.matchingLeft || []).length;
                        const current = matchingUserMatches[question.id] || Array(leftLen).fill(undefined);
                        if (!matchingUserMatches[question.id]) {
                          setMatchingUserMatches(prev => ({ ...prev, [question.id]: current }));
                        }
                        return (
                          <MatchingQuestion
                            question={question as any}
                            quizMode={quizMode}
                            currentMatches={current}
                            setMatches={(next) => setMatchingUserMatches(prev => ({ ...prev, [question.id]: next as number[] }))}
                          />
                        );
                      })()
                    ) : (
                      <MCQQuestion
                        question={question as any}
                        quizMode={quizMode}
                        userAnswer={userAnswers[question.id]}
                        onSelect={(idx) => handleOptionSelect(question.id, idx)}
                      />
                    )}
                    {/* Instant feedback is handled inside each question component */}
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
              fibUserAnswers={fibUserAnswers}
              orderingUserOrders={orderingUserOrders}
              matchingUserMatches={matchingUserMatches}
              isVisible={generatedQuiz.length > 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGeneratorPage;