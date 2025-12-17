import React, { useState, ReactNode } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  disabled?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, className = '', disabled = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={isFlipped ? 'Click to show equation' : 'Click to show visualization'}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="flip-card-content">
            {front}
          </div>
        </div>
        <div className="flip-card-back">
          <div className="flip-card-content">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
