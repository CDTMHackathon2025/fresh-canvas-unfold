
import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import { useToast } from "@/hooks/use-toast";

// These are placeholder JSON URLs - in a production app, you would:
// 1. Download the JSON files and import them directly, or
// 2. Host them on your CDN and reference the URLs
const defaultAnimations = {
  idle: "https://assets5.lottiefiles.com/packages/lf20_xyadoh9h.json",
  listening: "https://assets3.lottiefiles.com/packages/lf20_szlepvdh.json", 
  speaking: "https://assets8.lottiefiles.com/packages/lf20_zzx5xpuz.json"
};

interface FinancialAvatarProps {
  status: "idle" | "listening" | "speaking";
  size?: "sm" | "md" | "lg";
}

const FinancialAvatar: React.FC<FinancialAvatarProps> = ({ 
  status = "idle",
  size = "md" 
}) => {
  const [animationUrl, setAnimationUrl] = useState<string>(defaultAnimations.idle);
  const [animationData, setAnimationData] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const lottieRef = useRef(null);

  // Size mappings
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  // Fetch the animation JSON when status changes
  useEffect(() => {
    setIsLoading(true);
    const url = defaultAnimations[status];
    setAnimationUrl(url);
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load animation:", error);
        toast({
          title: "Failed to load avatar animation",
          description: "Using fallback display",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [status, toast]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-blue-50 border-2 border-blue-200 relative`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
            <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        {animationData ? (
          <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="w-full h-full"
            lottieRef={lottieRef}
            onEnterFrame={() => {
              if (lottieRef.current) {
                // Ensure the animation is playing
                const instance = lottieRef.current;
                instance.setSpeed(1);
                instance.play();
              }
            }}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice"
            }}
          />
        ) : !isLoading && (
          // Fallback display if animation fails to load
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <span className="text-blue-600 font-bold">HT</span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {status === "idle" && "Hey Trade"}
        {status === "listening" && "Listening..."}
        {status === "speaking" && "Speaking..."}
      </div>
    </div>
  );
};

export default FinancialAvatar;
