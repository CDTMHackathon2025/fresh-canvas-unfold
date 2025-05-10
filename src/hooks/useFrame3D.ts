
// Custom hook for animation frames in Three.js/React Three Fiber
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from 'three';

// Hook for managing animation frames with cleanup
export const useFrame3D = (callback: (state: any) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback({ time, deltaTime });
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
  }, []);
};
