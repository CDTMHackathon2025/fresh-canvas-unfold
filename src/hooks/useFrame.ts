
import { useEffect, useRef } from 'react';

export const useFrame = (callback: () => void) => {
  // Use useRef for mutable variables that won't cause rerenders
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      callback();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty array ensures this only runs once on mount
};
