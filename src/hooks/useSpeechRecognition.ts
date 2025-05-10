
import { useState, useEffect, useRef } from "react";
import { initVoiceRecognition } from "@/utils/voiceRecognition";
import { toast } from "@/hooks/use-toast";

export const useSpeechRecognition = (onSpeechResult: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [isWaitingForCommand, setIsWaitingForCommand] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const voiceRecognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported more reliably
    const isSupported = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    
    setIsSpeechRecognitionSupported(isSupported);
    
    if (!isSupported) {
      console.log("Speech Recognition not supported in this browser");
      toast({
        title: "Voice input not available",
        description: "Your browser doesn't support speech recognition. Text input is still available.",
        duration: 5000,
      });
      return () => {};
    }
    
    try {
      // Initialize voice recognition with callbacks
      voiceRecognitionRef.current = initVoiceRecognition(
        // Wake word detected
        () => {
          console.log("Wake word detected!");
          setWakeWordDetected(true);
          setIsWaitingForCommand(true);
          // Show toast when wake word is detected
          toast({
            title: "Voice activated",
            description: "I'm listening...",
            duration: 3000,
          });
        },
        // Speech result received
        (transcript) => {
          console.log("Speech result received:", transcript);
          setIsWaitingForCommand(false);
          if (transcript && transcript.trim().length > 0) {
            onSpeechResult(transcript);
          }
        },
        // Listening started
        () => {
          console.log("Voice listening started");
          setIsListening(true);
        },
        // Listening ended
        () => {
          console.log("Voice listening ended");
          setIsListening(false);
          setIsWaitingForCommand(false);
        }
      );
      
      // Start voice recognition if available
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.start();
      }
    } catch (error) {
      console.error("Error initializing voice recognition:", error);
      setIsSpeechRecognitionSupported(false);
      toast({
        title: "Voice input error",
        description: "Failed to initialize voice recognition.",
        duration: 5000,
      });
    }
    
    // Clean up on component unmount
    return () => {
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping voice recognition:", e);
        }
      }
    };
  }, [onSpeechResult]);

  return {
    isListening,
    wakeWordDetected,
    isWaitingForCommand,
    voiceRecognitionRef,
    isSpeechRecognitionSupported
  };
};
