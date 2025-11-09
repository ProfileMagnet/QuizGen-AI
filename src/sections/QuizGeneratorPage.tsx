import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import ConfettiAnimation from '../components/ConfettiAnimation';
import LoadingAnimation from '../components/LoadingAnimation';
import CommonDialog from '../components/CommonDialog';
import MatchingQuizDisplay from '../components/quiz_types/MatchingQuizDisplay';
import MCQQuizDisplay from '../components/quiz_types/MCQQuizDisplay';
import FIBQuizDisplay from '../components/quiz_types/FIBQuizDisplay';
import OrderingQuizDisplay from '../components/quiz_types/OrderingQuizDisplay';
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

  

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);


  // Memoize the past quiz questions to prevent unnecessary recalculations
  const pastQuizQuestions = useMemo(() => {
    if (quizType === 'Matching') {
      // For matching quizzes, return array of [left_contents, right_contents] pairs
      return generatedQuiz.map(q => [q.matchingLeft || [], q.matchingRight || []]);
    }
    // For other quiz types, return array of question strings
    return generatedQuiz.map(q => q.question);
  }, [generatedQuiz, quizType]);

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
          <>
            {generatedQuiz.length > 0 && quizType === 'Matching' && (
              <MatchingQuizDisplay
                generatedQuiz={generatedQuiz}
                onReset={handleReset}
                onGenerateMore={handleGenerateMore}
                isGenerating={isGenerating}
                quizType={quizType}
              />
            )}

            {generatedQuiz.length > 0 && (quizType === 'Multiple Choice' || quizType === 'True or False') && (
              <MCQQuizDisplay
                generatedQuiz={generatedQuiz}
                onReset={handleReset}
                onGenerateMore={handleGenerateMore}
                isGenerating={isGenerating}
                quizType={quizType}
              />
            )}

            {generatedQuiz.length > 0 && quizType === 'Fill in the Blanks' && (
              <FIBQuizDisplay
                generatedQuiz={generatedQuiz}
                onReset={handleReset}
                onGenerateMore={handleGenerateMore}
                isGenerating={isGenerating}
                quizType={quizType}
              />
            )}

            {generatedQuiz.length > 0 && quizType === 'Ordering' && (
              <OrderingQuizDisplay
                generatedQuiz={generatedQuiz}
                onReset={handleReset}
                onGenerateMore={handleGenerateMore}
                isGenerating={isGenerating}
                quizType={quizType}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizGeneratorPage;