import React from 'react';
import { BarChart3, Target, TrendingUp, Award, Brain } from 'lucide-react';
import './InsightsDashboard.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface InsightsDashboardProps {
  questions: QuizQuestion[];
  userAnswers: { [questionId: number]: number };
  isVisible: boolean;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  questions,
  userAnswers,
  isVisible
}) => {
  const calculateStats = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    const accuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracy,
      progress,
      remaining: totalQuestions - answeredQuestions
    };
  };

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: '#22c55e', icon: '🏆' };
    if (accuracy >= 75) return { level: 'Good', color: '#3b82f6', icon: '👍' };
    if (accuracy >= 60) return { level: 'Average', color: '#f59e0b', icon: '📈' };
    return { level: 'Needs Work', color: '#ef4444', icon: '💪' };
  };

  const stats = calculateStats();
  const performance = getPerformanceLevel(stats.accuracy);

  if (!isVisible) return null;

  return (
    <div className="insights-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <BarChart3 size={20} />
          <span>Real-time Insights</span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Progress Overview */}
        <div className="insight-card progress-card">
          <div className="card-header">
            <Target size={16} />
            <span>Progress</span>
          </div>
          <div className="progress-stats">
            <div className="progress-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${stats.progress}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  {stats.progress}%
                </text>
              </svg>
            </div>
            <div className="progress-details">
              <div className="stat-item">
                <span className="stat-value">{stats.answeredQuestions}</span>
                <span className="stat-label">Answered</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.remaining}</span>
                <span className="stat-label">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="insight-card performance-card">
          <div className="card-header">
            <Award size={16} />
            <span>Performance</span>
          </div>
          <div className="performance-content">
            <div className="performance-level" style={{ color: performance.color }}>
              <span className="performance-icon">{performance.icon}</span>
              <span className="performance-text">{performance.level}</span>
            </div>
            <div className="accuracy-display">
              <span className="accuracy-value">{stats.accuracy}%</span>
              <span className="accuracy-label">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="insight-card stats-card">
          <div className="card-header">
            <TrendingUp size={16} />
            <span>Quick Stats</span>
          </div>
          <div className="stats-grid">
            <div className="stat-box correct">
              <div className="stat-number">{stats.correctAnswers}</div>
              <div className="stat-text">Correct</div>
            </div>
            <div className="stat-box incorrect">
              <div className="stat-number">{stats.answeredQuestions - stats.correctAnswers}</div>
              <div className="stat-text">Incorrect</div>
            </div>
            <div className="stat-box total">
              <div className="stat-number">{stats.totalQuestions}</div>
              <div className="stat-text">Total</div>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        {stats.answeredQuestions > 0 && (
          <div className="insight-card tips-card">
            <div className="card-header">
              <Brain size={16} />
              <span>Study Tips</span>
            </div>
            <div className="tips-content">
              {stats.accuracy >= 90 && (
                <div className="tip">
                  <span className="tip-icon">🌟</span>
                  <span>Excellent work! You're mastering this topic.</span>
                </div>
              )}
              {stats.accuracy >= 75 && stats.accuracy < 90 && (
                <div className="tip">
                  <span className="tip-icon">📚</span>
                  <span>Good progress! Review incorrect answers to improve.</span>
                </div>
              )}
              {stats.accuracy >= 60 && stats.accuracy < 75 && (
                <div className="tip">
                  <span className="tip-icon">🎯</span>
                  <span>Focus on understanding key concepts better.</span>
                </div>
              )}
              {stats.accuracy < 60 && stats.answeredQuestions >= 3 && (
                <div className="tip">
                  <span className="tip-icon">💡</span>
                  <span>Consider reviewing the material before continuing.</span>
                </div>
              )}
              {stats.remaining > 0 && (
                <div className="tip">
                  <span className="tip-icon">⏰</span>
                  <span>{stats.remaining} questions left to complete!</span>
                </div>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default InsightsDashboard;