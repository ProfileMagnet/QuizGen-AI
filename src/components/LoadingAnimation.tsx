import React from 'react';
import './LoadingAnimation.css';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating your quiz..." 
}) => {
  return (
    <div className="loading-animation-container">
      <div className="loading-content">
        {/* Animated Brain/AI Icon */}
        <div className="brain-container">
          <div className="brain-icon">
            <div className="brain-left"></div>
            <div className="brain-right"></div>
            <div className="synapse synapse-1"></div>
            <div className="synapse synapse-2"></div>
            <div className="synapse synapse-3"></div>
            <div className="synapse synapse-4"></div>
          </div>
          <div className="glow-effect"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>

        {/* Progress Text */}
        <div className="loading-text">
          <h3>{message}</h3>
          <div className="dots-container">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="fun-fact">
          <p className="fact-label">Did you know?</p>
          <p className="fact-text" id="rotating-fact">AI is analyzing patterns to create perfect questions...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;