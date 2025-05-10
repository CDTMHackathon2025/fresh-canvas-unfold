
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { initTextToSpeech } from "@/utils/textToSpeech";

export const useTextToSpeech = () => {
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const textToSpeechRef = useRef<any>(null);
  
  useEffect(() => {
    // Initialize text-to-speech
    textToSpeechRef.current = initTextToSpeech();
    if (!textToSpeechRef.current) {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech. Some features will be limited.",
        duration: 5000,
      });
      setSpeechEnabled(false);
    }
    
    // Clean up on component unmount
    return () => {
      if (textToSpeechRef.current) {
        textToSpeechRef.current.stop();
      }
    };
  }, []);

  return {
    speechEnabled,
    setSpeechEnabled,
    textToSpeechRef
  };
};
