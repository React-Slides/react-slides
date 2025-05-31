import React from 'react';

interface AnimationConfig {
  type: 'spin' | 'ping' | 'bounce' | 'pulse';
  duration?: string;
  delay?: string;
}

interface AnimationWrapperProps {
  config: AnimationConfig;
  children: React.ReactNode;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({ config, children }) => {
  const getAnimationClasses = () => {
    switch (config.type) {
      case 'spin': 
        return 'animate-spin'
      case 'ping':
        return 'animate-ping'
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const animationStyles = {
    animationDuration: config.duration || '1s',
    animationDelay: config.delay || '0s',
  };

  return (
    <div className={getAnimationClasses()} style={animationStyles}>
      {children}
    </div>
  );
};

export default AnimationWrapper;