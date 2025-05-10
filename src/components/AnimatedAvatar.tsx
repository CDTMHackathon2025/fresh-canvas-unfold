
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@/hooks/useFrame';

interface AnimatedAvatarProps {
  status: "idle" | "listening" | "speaking";
  size?: "sm" | "md" | "lg" | "xl";
  emotion?: "neutral" | "confident" | "thinking" | "happy";
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ 
  status = "idle", 
  size = "md",
  emotion = "neutral"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [blinkState, setBlinkState] = useState(1);
  const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: 100,
    md: 150,
    lg: 200,
    xl: 300
  };
  
  const canvasSize = sizeMap[size];

  // Animation timing for blinking
  useEffect(() => {
    // Random eye movement
    const eyeInterval = setInterval(() => {
      if (Math.random() > 0.6) {
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
    
    // Subtle head tilting for more natural movement
    const tiltInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setHeadTilt((Math.random() - 0.5) * 0.05);
      } else {
        setHeadTilt(0);
      }
    }, 5000);
    
    return () => {
      clearInterval(eyeInterval);
      clearInterval(blinkInterval);
      clearInterval(tiltInterval);
    };
  }, []);
  
  // Mouth animation based on status
  useEffect(() => {
    if (status === "speaking") {
      setIsSpeaking(true);
      // Animate mouth for speaking - more varied for natural speech
      const mouthInterval = setInterval(() => {
        const openFactor = Math.random();
        setMouthOpenness(openFactor > 0.3 ? openFactor * 0.7 : 0.1);
      }, 100);
      
      return () => clearInterval(mouthInterval);
    } else {
      setIsSpeaking(false);
      setMouthOpenness(status === "listening" ? 0.2 : 0.05);
    }
  }, [status]);

  // Get emotion-based styles
  const getEmotionStyles = () => {
    switch (emotion) {
      case "confident":
        return {
          eyebrowAngle: 0.1,
          mouthCurve: 0.3,
          faceColor: '#FFE0B2',
          accentColor: '#76C7C0'
        };
      case "thinking":
        return {
          eyebrowAngle: 0.2,
          mouthCurve: -0.1,
          faceColor: '#FFE0B2',
          accentColor: '#9F9EA1'
        };
      case "happy":
        return {
          eyebrowAngle: 0,
          mouthCurve: 0.5,
          faceColor: '#FFEFD5',
          accentColor: '#95D5B2'
        };
      default:
        return {
          eyebrowAngle: 0,
          mouthCurve: 0.1,
          faceColor: '#FFE0B2',
          accentColor: '#8A898C'
        };
    }
  };

  // Draw face on canvas
  const drawFace = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const emotionStyles = getEmotionStyles();
    
    const centerX = width / 2;
    const centerY = height / 2;
    const faceSize = Math.min(width, height) * 0.8;
    
    // Apply head tilt
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(headTilt);
    ctx.translate(-centerX, -centerY);
    
    // Draw avatar background - gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, faceSize/1.5
    );
    gradient.addColorStop(0, '#F1F0FB');
    gradient.addColorStop(1, '#E5DEFF');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, faceSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Professional subtle border
    ctx.strokeStyle = '#D3E4FD';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Face
    ctx.beginPath();
    ctx.fillStyle = emotionStyles.faceColor; // Light skin tone
    ctx.arc(centerX, centerY, faceSize / 2.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    const eyeY = centerY - faceSize * 0.05;
    const eyeSize = faceSize * 0.07;
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
    
    // Pupils - with more natural coloring
    const pupilSize = eyeSize * 0.65;
    
    // Iris gradient
    const irisGradient = ctx.createRadialGradient(
      centerX - eyeDistance + (eyeDirection.x * eyeSize),
      eyeY + (eyeDirection.y * eyeSize),
      0,
      centerX - eyeDistance + (eyeDirection.x * eyeSize),
      eyeY + (eyeDirection.y * eyeSize),
      pupilSize
    );
    irisGradient.addColorStop(0, '#2A5B8C');
    irisGradient.addColorStop(0.8, '#1B263B');
    irisGradient.addColorStop(1, '#000');
    
    // Left pupil with direction and gradient
    ctx.beginPath();
    ctx.fillStyle = irisGradient;
    ctx.arc(
      centerX - eyeDistance + (eyeDirection.x * eyeSize), 
      eyeY + (eyeDirection.y * eyeSize), 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Light reflection in eyes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(
      centerX - eyeDistance + (eyeDirection.x * eyeSize) + pupilSize/3, 
      eyeY + (eyeDirection.y * eyeSize) - pupilSize/3, 
      pupilSize/5, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Right iris with same gradient
    const irisGradient2 = ctx.createRadialGradient(
      centerX + eyeDistance + (eyeDirection.x * eyeSize),
      eyeY + (eyeDirection.y * eyeSize),
      0,
      centerX + eyeDistance + (eyeDirection.x * eyeSize),
      eyeY + (eyeDirection.y * eyeSize),
      pupilSize
    );
    irisGradient2.addColorStop(0, '#2A5B8C');
    irisGradient2.addColorStop(0.8, '#1B263B');
    irisGradient2.addColorStop(1, '#000');
    
    // Right pupil
    ctx.beginPath();
    ctx.fillStyle = irisGradient2;
    ctx.arc(
      centerX + eyeDistance + (eyeDirection.x * eyeSize), 
      eyeY + (eyeDirection.y * eyeSize), 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Light reflection in right eye
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(
      centerX + eyeDistance + (eyeDirection.x * eyeSize) + pupilSize/3, 
      eyeY + (eyeDirection.y * eyeSize) - pupilSize/3, 
      pupilSize/5, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Eyebrows - emotion affected
    const eyebrowY = eyeY - eyeSize * 2;
    ctx.strokeStyle = '#8D5524';
    ctx.lineWidth = eyeSize * 0.4;
    ctx.lineCap = 'round';
    
    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX - eyeDistance - eyeSize * 1.2, eyebrowY + eyeSize * emotionStyles.eyebrowAngle);
    ctx.lineTo(centerX - eyeDistance + eyeSize * 0.8, eyebrowY - eyeSize * 0.5);
    ctx.stroke();
    
    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX + eyeDistance + eyeSize * 1.2, eyebrowY + eyeSize * emotionStyles.eyebrowAngle);
    ctx.lineTo(centerX + eyeDistance - eyeSize * 0.8, eyebrowY - eyeSize * 0.5);
    ctx.stroke();
    
    // Mouth - more sophisticated with emotion
    const mouthY = centerY + faceSize * 0.2;
    const mouthWidth = faceSize * 0.25;
    const mouthHeight = faceSize * 0.03 + (mouthOpenness * faceSize * 0.15);
    
    // Create lip shape
    ctx.fillStyle = '#E57373'; // Lips color
    
    if (mouthOpenness > 0.1) {
      // Open mouth with realistic shape
      ctx.beginPath();
      ctx.ellipse(
        centerX, 
        mouthY, 
        mouthWidth, 
        mouthHeight, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Inner mouth
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
    } else {
      // Closed mouth with subtle curve based on emotion
      ctx.beginPath();
      ctx.moveTo(centerX - mouthWidth, mouthY);
      
      // Control points for the curve - affected by emotion
      ctx.bezierCurveTo(
        centerX - mouthWidth/2, mouthY + mouthHeight * 2 * emotionStyles.mouthCurve, 
        centerX + mouthWidth/2, mouthY + mouthHeight * 2 * emotionStyles.mouthCurve, 
        centerX + mouthWidth, mouthY
      );
      
      // Bottom lip curve
      ctx.bezierCurveTo(
        centerX + mouthWidth/2, mouthY + mouthHeight, 
        centerX - mouthWidth/2, mouthY + mouthHeight, 
        centerX - mouthWidth, mouthY
      );
      
      ctx.closePath();
      ctx.fill();
    }
    
    // Professional attire hint - collar
    ctx.fillStyle = emotionStyles.accentColor;
    ctx.beginPath();
    ctx.moveTo(centerX - faceSize/3, centerY + faceSize/2.1);
    ctx.lineTo(centerX - faceSize/5, centerY + faceSize/1.8);
    ctx.lineTo(centerX, centerY + faceSize/1.7);
    ctx.lineTo(centerX + faceSize/5, centerY + faceSize/1.8);
    ctx.lineTo(centerX + faceSize/3, centerY + faceSize/2.1);
    ctx.fill();
    
    // Status indicator with glow
    const statusColor = status === "idle" 
      ? '#9E9E9E' 
      : status === "listening" 
        ? '#4CAF50' 
        : '#2196F3';
    
    // Glow
    const glowRadius = faceSize * 0.05 * (1 + Math.sin(Date.now() / 1000) * 0.2);
    const glow = ctx.createRadialGradient(
      centerX, centerY + faceSize / 1.6, 0,
      centerX, centerY + faceSize / 1.6, glowRadius * 2
    );
    glow.addColorStop(0, statusColor);
    glow.addColorStop(0.6, statusColor + '80');
    glow.addColorStop(1, statusColor + '00');
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY + faceSize / 1.6, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY + faceSize / 1.6, faceSize * 0.03, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore(); // Restore after rotation
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
    <div className="flex flex-col items-center relative">
      <canvas 
        ref={canvasRef} 
        width={canvasSize} 
        height={canvasSize} 
        className={`rounded-full shadow-lg ${
          status === "speaking" ? "animate-subtle-pulse" : ""
        }`}
      />
      <div className="text-xs text-center mt-2 text-gray-400 font-medium">
        {status === "idle" 
          ? "Hey Trade" 
          : status === "listening" 
            ? "Listening..." 
            : "Speaking..."}
      </div>
    </div>
  );
};

export default AnimatedAvatar;
