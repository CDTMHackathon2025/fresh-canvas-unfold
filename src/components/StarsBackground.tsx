
import React from "react";
import { useFrame } from "@/hooks/useFrame";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
}

const StarsBackground: React.FC = () => {
  const [stars, setStars] = React.useState<Star[]>([]);

  React.useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 180; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,  // Slightly smaller stars (was 3 + 0.5)
          opacity: Math.random() * 0.5 + 0.1, // Reduced opacity range to 0.1-0.6 (was 0.8 + 0.2)
          animationDuration: Math.random() * 5 + 3
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute rounded-full bg-white/70 blur-[1px]" // Added blur and reduced white intensity
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration}s ease-in-out infinite alternate`,
            boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.opacity * 0.6})` // Reduced glow intensity
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;
