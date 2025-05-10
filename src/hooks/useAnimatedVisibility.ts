
import { useState, useEffect } from 'react';

interface AnimatedVisibilityOptions {
  delay?: number;
  initialVisible?: boolean;
}

export const useAnimatedVisibility = (options?: AnimatedVisibilityOptions) => {
  const { delay = 0, initialVisible = false } = options || {};
  const [isVisible, setIsVisible] = useState(initialVisible);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
};
