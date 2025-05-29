
import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  targetValue: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  targetValue, 
  duration = 2000, 
  className = "" 
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue === 0) {
      setCurrentValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = currentValue;
    const difference = targetValue - startValue;

    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newValue = Math.floor(startValue + (difference * easeOutQuart));
      setCurrentValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setCurrentValue(targetValue);
      }
    };

    requestAnimationFrame(animateValue);
  }, [targetValue, duration]);

  return (
    <span className={className}>
      {currentValue.toLocaleString()}
    </span>
  );
};

export default AnimatedCounter;
