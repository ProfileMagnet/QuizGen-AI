import React from 'react';

// Completely invisible loading component
const LoadingSpinner: React.FC<{ message?: string }> = () => (
  <div className="loading-container">
    {/* Completely invisible - nothing renders */}
  </div>
);

export default LoadingSpinner;