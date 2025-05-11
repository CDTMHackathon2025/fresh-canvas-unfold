
import React, { useState, useEffect } from 'react';
import AvatarScene from './AvatarScene';
import { createEmotionController, AvatarEmotion } from './EmotionController';

interface Avatar3DProps {
  status: "idle" | "listening" | "speaking";
  size?: "sm" | "md" | "lg" | "xl";
  emotion?: AvatarEmotion;
}

const Avatar3D: React.FC<Avatar3DProps> = ({ 
  status = "idle", 
  size = "md",
  emotion = "neutral"
}) => {
  // Size mapping - now with larger options
  const sizeMap = {
    sm: "h-24 w-24",
    md: "h-36 w-36",
    lg: "h-48 w-48",
    xl: "h-72 w-72"
  };

  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>("neutral");

  useEffect(() => {
    // Update emotion when prop changes
    setCurrentEmotion(emotion);
  }, [emotion]);

  return (
    <div className="flex flex-col items-center relative">
      <div className={`${sizeMap[size]} rounded-full overflow-hidden shadow-lg bg-gradient-to-b from-blue-900/30 to-blue-700/20 backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse mix-blend-overlay rounded-full"></div>
        <AvatarScene status={status} emotion={currentEmotion} />
      </div>
      
      <div className="text-xs text-center mt-2 text-blue-300 font-medium">
        {status === "idle" 
          ? "Hey Trade" 
          : status === "listening" 
            ? "Listening..." 
            : "Speaking..."}
      </div>
    </div>
  );
};

export default Avatar3D;
