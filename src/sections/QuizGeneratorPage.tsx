import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import './QuizGeneratorPage.css';

const QuizGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [quizType, setQuizType] = useState('multiple-choice');
  const [generatedQuiz, setGeneratedQuiz] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuiz = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI quiz generation
    setTimeout(() => {
      const sampleQuestions = [
        {
          id: 1,
          question: `What is the key concept of ${topic}?`,
          options: [
            `A fundamental principle of ${topic}`,
            `An advanced technique in ${topic}`,
            `A basic definition of ${topic}`,
            `An unrelated concept`
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: `Which of these is most important in ${topic}?`,
          options: [
            'Option A',
            'Option B', 
            'Option C',
            'Option D'
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: `How does ${topic} impact modern applications?`,
          options: [
            'Significantly',
            'Moderately',
            'Minimally',
            'Not at all'
          ],
          correctAnswer: 0
        }
      ];
      
      setGeneratedQuiz(sampleQuestions);
      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setTopic('');
    setGeneratedQuiz([]);
  };

  return (
    <div className="quiz-generator-page">
      <div className="container">
        <div className="quiz-header">
          <button 
            className="back-button" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="page-title">
            <Sparkles className="title-icon" />
            AI Quiz Generator
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="numQuestions">Number of Questions</label>
                  <select
                    id="numQuestions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quizType">Quiz Type</label>
                <select
                  id="quizType"
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>

              <button
                className="generate-button"
                onClick={handleGenerateQuiz}
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating Quiz...
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
              <button className="reset-button" onClick={handleReset}>
                Create New Quiz
              </button>
            </div>

            <div className="quiz-questions">
              {generatedQuiz.map((question) => (
                <div key={question.id} className="quiz-question-card">
                  <div className="question-header">
                    <span className="question-number">Q{question.id}</span>
                    <h3>{question.question}</h3>
                  </div>
                  <div className="question-options">
                    {question.options.map((option: string, index: number) => (
                      <div key={index} className="option">
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="option-text">{option}</span>
                      </div>
                    ))}
                  </div>
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