import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
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
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [quizMode, setQuizMode] = useState<'practice' | 'review'>('practice');

  const handleGenerateQuiz = async () => {
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
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer_index,
      }));

      console.log('Normalized questions:', normalized);
      setGeneratedQuiz(normalized);
    } catch (e) {
      console.error('Full error:', e);
      alert(`Failed to generate quiz: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setGeneratedQuiz([]);
    setUserAnswers({});
    setQuizMode('practice');
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (quizMode === 'review') return; // Don't allow changes in review mode

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
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

  const allQuestionsAnswered = generatedQuiz.length > 0 &&
    generatedQuiz.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="quiz-generator-page">
      <div className="container">
        <div className="quiz-header">
          <button
            className="back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Home
          </button>
          <h1 className="page-title">
            <Sparkles className="title-icon" />
             QuizGen AI
          </h1>
          <p className="page-subtitle">
            Create custom quizzes powered by artificial intelligence
          </p>
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
                onClick={handleGenerateQuiz}
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
          <div className="quiz-results">
            <div className="results-header">
              <h2>Generated Quiz: {topic}</h2>
              <div className="header-actions">
                {quizMode === 'practice' && allQuestionsAnswered && (
                  <button
                    className="review-button"
                    onClick={() => setQuizMode('review')}
                  >
                    Review Answers
                  </button>
                )}
                {quizMode === 'review' && (
                  <div className="score-display">
                    Score: {calculateScore().correct}/{calculateScore().total} ({calculateScore().percentage}%)
                  </div>
                )}
                <button className="reset-button" onClick={handleReset}>
                  Create New Quiz
                </button>
              </div>
            </div>

            <div className="quiz-questions">
              {generatedQuiz.map((question) => (
                <div key={question.id} className="quiz-question-card">
                  <div className="question-header">
                    <span className="question-number">Q{question.id}</span>
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
                          className={`option ${status !== 'default' ? `option-${status}` : ''} ${isSelected ? 'selected' : ''} ${quizMode === 'practice' ? 'clickable' : ''}`}
                          onClick={() => handleOptionSelect(question.id, index)}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="option-text">{option}</span>
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
                          <span className="feedback-icon">✗</span>
                          Incorrect. The correct answer is: <strong>{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-secondary">
                <Send size={18} />
                Export Quiz
              </button>
              <button className="btn btn-primary" onClick={handleReset}>
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGeneratorPage;