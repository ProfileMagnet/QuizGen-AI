import React, { useEffect, useState, useMemo } from 'react';
import './ConfettiAnimation.css';

interface ConfettiAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  rotation: number;
  color: string;
  size: number;
  duration: number;
  type: 'square' | 'circle' | 'triangle';
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  onComplete, 
  duration = 100 
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(true);

  const colors = useMemo(() => [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#EC4899', '#06B6D4', '#84CC16'
  ], []);

  const shapes = useMemo(() => ['square', 'circle', 'triangle'] as const, []);

  useEffect(() => {
    // Generate simple confetti pieces
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: 50 + (Math.random() - 0.5) * 60, // Start from center
        delay: Math.random() * 0.2,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 1 + 2,
        type: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    setConfetti(pieces);

    // Hide after duration
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete, colors, shapes]); // Added colors and shapes to dependency array

  if (!show) return null;

  return (
    <div className="confetti-container">
      {/* Simple Success Message */}
      <div className="success-message">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" className="checkmark">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
          </svg>
        </div>
        <h2 className="success-text">Quiz Generated!</h2>
        <p className="success-subtext">Ready to start</p>
      </div>

      {/* Simple Confetti Pieces */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.type}`}
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--rotation': `${piece.rotation}deg`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;