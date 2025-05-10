
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimatedVisibility } from '@/hooks/useAnimatedVisibility';
import { cn } from '@/lib/utils';

interface AnimatedNodeProps {
  title: string;
  icon: React.ReactNode;
  route: string;
  className?: string;
  glowColor?: string;
}

const AnimatedNode: React.FC<AnimatedNodeProps> = ({
  title,
  icon,
  route,
  className,
  glowColor = "rgba(66, 153, 225, 0.6)"
}) => {
  const isVisible = useAnimatedVisibility({ delay: Math.random() * 300 + 200 });
  const navigate = useNavigate();
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110",
        isVisible ? "opacity-100" : "opacity-0 translate-y-4",
        className
      )}
      onClick={() => navigate(route)}
    >
      <div 
        className={`rounded-full p-4 bg-navy mb-2 relative node-pulse`}
        style={{
          '--glow-color': glowColor,
        } as React.CSSProperties}
      >
        {icon}
      </div>
      <span className="text-xs text-white font-medium">{title}</span>
    </div>
  );
};

export default AnimatedNode;
