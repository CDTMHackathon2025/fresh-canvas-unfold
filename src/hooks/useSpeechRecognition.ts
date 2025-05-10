
import { useState, useEffect, useRef } from "react";
import { initVoiceRecognition } from "@/utils/voiceRecognition";
import { toast } from "@/hooks/use-toast";

export const useSpeechRecognition = (onSpeechResult: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [isWaitingForCommand, setIsWaitingForCommand] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const voiceRecognitionRef = useRef<any>(null);
  const hasShownSupportWarning = useRef(false);

  useEffect(() => {
    // Check if speech recognition is supported more reliably
    const isSupported = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    
    setIsSpeechRecognitionSupported(isSupported);
    
    if (!isSupported) {
      console.log("Speech Recognition not supported in this browser");
      
      // Only show the toast once
      if (!hasShownSupportWarning.current) {
        toast({
          title: "Voice input not available",
          description: "Your browser doesn't support speech recognition. Text input is still available.",
          duration: 5000,
        });
        hasShownSupportWarning.current = true;
      }
      return () => {};
    }
    
    try {
      // Only initialize if we haven't already
      if (!voiceRecognitionRef.current) {
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
      }
    } catch (error) {
      console.error("Error initializing voice recognition:", error);
      setIsSpeechRecognitionSupported(false);
      
      // Only show the toast once
      if (!hasShownSupportWarning.current) {
        toast({
          title: "Voice input error",
          description: "Failed to initialize voice recognition.",
          duration: 5000,
        });
        hasShownSupportWarning.current = true;
      }
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

  const toggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported) return;
    
    if (isListening) {
      // Currently listening, so stop
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
          setIsListening(false);
          setIsWaitingForCommand(false);
        } catch (e) {
          console.error("Error stopping voice recognition:", e);
        }
      }
    } else {
      // Not listening, so start
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.start();
          
          // Only show the toast once when activating
          toast({
            title: "Voice input activated",
            description: "Say 'Hey Trade' to start giving a command",
            duration: 3000,
          });
        } catch (e) {
          console.error("Error starting voice recognition:", e);
        }
      } else {
        // If recognition wasn't initialized, try again
        try {
          voiceRecognitionRef.current = initVoiceRecognition(
            () => {
              setWakeWordDetected(true);
              setIsWaitingForCommand(true);
            },
            (transcript) => {
              setIsWaitingForCommand(false);
              if (transcript && transcript.trim().length > 0) {
                onSpeechResult(transcript);
              }
            },
            () => {
              setIsListening(true);
            },
            () => {
              setIsListening(false);
              setIsWaitingForCommand(false);
            }
          );
          
          if (voiceRecognitionRef.current) {
            voiceRecognitionRef.current.start();
          }
        } catch (error) {
          console.error("Error re-initializing voice recognition:", error);
        }
      }
    }
  };

  return {
    isListening,
    wakeWordDetected,
    isWaitingForCommand,
    voiceRecognitionRef,
    isSpeechRecognitionSupported,
    toggleVoiceInput
  };
};
