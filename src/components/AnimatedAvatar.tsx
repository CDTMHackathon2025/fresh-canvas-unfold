
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@/hooks/useFrame';

interface AnimatedAvatarProps {
  status: "idle" | "listening" | "speaking";
  size?: "sm" | "md" | "lg";
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ 
  status = "idle", 
  size = "md" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [blinkState, setBlinkState] = useState(1);
  const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });

  // Size mapping
  const sizeMap = {
    sm: 100,
    md: 150,
    lg: 200,
  };
  
  const canvasSize = sizeMap[size];

  // Animation timing
  useEffect(() => {
    // Random eye movement
    const eyeInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEyeDirection({
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.2
        });
      }
    }, 2000);
    
    // Random blinking
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlinkState(0);
        setTimeout(() => setBlinkState(1), 150);
      }
    }, 3000);
    
    return () => {
      clearInterval(eyeInterval);
      clearInterval(blinkInterval);
    };
  }, []);
  
  // Mouth animation based on status
  useEffect(() => {
    if (status === "speaking") {
      // Animate mouth for speaking
      const mouthInterval = setInterval(() => {
        setMouthOpenness(Math.random() * 0.7);
      }, 100);
      
      return () => clearInterval(mouthInterval);
    } else {
      setMouthOpenness(status === "listening" ? 0.2 : 0);
    }
  }, [status]);

  // Draw face on canvas
  const drawFace = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const faceSize = Math.min(width, height) * 0.8;
    
    // Face
    ctx.beginPath();
    ctx.fillStyle = '#FFE0B2'; // Light skin tone
    ctx.arc(centerX, centerY, faceSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E0A370';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Eyes
    const eyeY = centerY - faceSize * 0.1;
    const eyeSize = faceSize * 0.08;
    const eyeDistance = faceSize * 0.15;
    
    // Eye whites
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(
      centerX - eyeDistance, 
      eyeY, 
      eyeSize * 1.5, 
      eyeSize * blinkState, 
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(
      centerX + eyeDistance, 
      eyeY, 
      eyeSize * 1.5, 
      eyeSize * blinkState, 
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Pupils
    const pupilSize = eyeSize * 0.6;
    ctx.fillStyle = '#1B263B';
    
    // Left pupil with direction
    ctx.beginPath();
    ctx.arc(
      centerX - eyeDistance + (eyeDirection.x * eyeSize), 
      eyeY + (eyeDirection.y * eyeSize), 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Right pupil with direction
    ctx.beginPath();
    ctx.arc(
      centerX + eyeDistance + (eyeDirection.x * eyeSize), 
      eyeY + (eyeDirection.y * eyeSize), 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Eyebrows 
    const eyebrowY = eyeY - eyeSize * 2;
    ctx.strokeStyle = '#8D5524';
    ctx.lineWidth = eyeSize * 0.4;
    ctx.lineCap = 'round';
    
    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX - eyeDistance - eyeSize * 1.2, eyebrowY);
    ctx.lineTo(centerX - eyeDistance + eyeSize * 0.8, eyebrowY - eyeSize * 0.5);
    ctx.stroke();
    
    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX + eyeDistance + eyeSize * 1.2, eyebrowY);
    ctx.lineTo(centerX + eyeDistance - eyeSize * 0.8, eyebrowY - eyeSize * 0.5);
    ctx.stroke();
    
    // Mouth
    const mouthY = centerY + faceSize * 0.2;
    const mouthWidth = faceSize * 0.3;
    const mouthHeight = faceSize * 0.1 + (mouthOpenness * faceSize * 0.2);
    
    ctx.fillStyle = '#E57373'; // Lips color
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner mouth when open
    if (mouthOpenness > 0.1) {
      ctx.fillStyle = '#484041';
      ctx.beginPath();
      ctx.ellipse(
        centerX, 
        mouthY + mouthHeight * 0.2, 
        mouthWidth * 0.8, 
        mouthHeight * 0.6, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }
    
    // Add status indicator
    ctx.fillStyle = status === "idle" 
      ? '#9E9E9E' 
      : status === "listening" 
        ? '#4CAF50' 
        : '#2196F3';
    ctx.beginPath();
    ctx.arc(centerX, centerY + faceSize / 2 + 10, faceSize * 0.05, 0, Math.PI * 2);
    ctx.fill();
  };

  // Animation loop using our custom hook
  useFrame(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawFace(ctx, canvas.width, canvas.height);
      }
    }
  });

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={canvasSize} 
        height={canvasSize} 
        className="rounded-full bg-gradient-to-b from-blue-50 to-blue-100"
      />
      <div className="text-xs text-center mt-2 text-gray-500">
        {status === "idle" 
          ? "Waiting..." 
          : status === "listening" 
            ? "Listening..." 
            : "Speaking..."}
      </div>
    </div>
  );
};

export default AnimatedAvatar;
