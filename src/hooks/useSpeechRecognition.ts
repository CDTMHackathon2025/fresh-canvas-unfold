
import { useState, useEffect, useRef, useCallback } from "react";
import { initVoiceRecognition } from "@/utils/voiceRecognition";
import { toast } from "@/hooks/use-toast";

export const useSpeechRecognition = (onSpeechResult: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [isWaitingForCommand, setIsWaitingForCommand] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const voiceRecognitionRef = useRef<any>(null);
  const hasShownSupportWarning = useRef(false);
  const permissionDeniedRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializationAttempted = useRef(false);

  // Function to check if speech recognition is supported
  const checkSpeechRecognitionSupport = useCallback(() => {
    const isSupported = typeof window !== 'undefined' && 
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
    
    setIsSpeechRecognitionSupported(isSupported);
    
    // Only show the warning once
    if (!isSupported && !hasShownSupportWarning.current) {
      console.log("Speech Recognition not supported in this browser");
      toast({
        title: "Voice input not available",
        description: "Your browser doesn't support speech recognition. Text input is still available.",
        duration: 5000,
      });
      hasShownSupportWarning.current = true;
    }
    
    return isSupported;
  }, []);

  // Request microphone permission explicitly
  const requestMicrophonePermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      permissionDeniedRef.current = true;
      return false;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Success! We have permission
      setHasRequestedPermission(true);
      
      // Stop all tracks to clean up
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      permissionDeniedRef.current = true;
      
      toast({
        title: "Microphone access denied",
        description: "Voice input requires microphone permission. Please allow access in your browser settings.",
        variant: "destructive",
        duration: 5000,
      });
      
      return false;
    }
  }, []);

  // Initialize speech recognition with proper error handling
  const initializeSpeechRecognition = useCallback(async () => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;
    
    if (!checkSpeechRecognitionSupport()) return;
    
    // Request microphone permission before initializing
    if (!hasRequestedPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
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
  }, [checkSpeechRecognitionSupport, hasRequestedPermission, onSpeechResult, requestMicrophonePermission]);

  // Initialize on component mount with permission handling
  useEffect(() => {
    initializeSpeechRecognition();
    
    // Clean up on component unmount
    return () => {
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping voice recognition:", e);
        }
      }
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [initializeSpeechRecognition]);

  // Implement a function to restart recognition if it crashes or stops
  const ensureRecognitionIsRunning = useCallback(() => {
    if (isSpeechRecognitionSupported && voiceRecognitionRef.current) {
      try {
        // First stop any existing instance
        voiceRecognitionRef.current.stop();
        
        // Then start after a short delay
        restartTimeoutRef.current = setTimeout(() => {
          voiceRecognitionRef.current.start();
          console.log("Voice recognition restarted by ensure function");
        }, 300);
      } catch (err) {
        console.error("Error in ensureRecognitionIsRunning:", err);
        
        // If we get an error, try to reinitialize
        initializationAttempted.current = false;
        initializeSpeechRecognition();
      }
    }
  }, [isSpeechRecognitionSupported, initializeSpeechRecognition]);

  // Set up a periodic check to ensure recognition is running
  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const checkInterval = setInterval(ensureRecognitionIsRunning, 60000); // Check every minute
      return () => clearInterval(checkInterval);
    }
  }, [isSpeechRecognitionSupported, ensureRecognitionIsRunning]);

  // Toggle voice input with proper permission handling
  const toggleVoiceInput = useCallback(async () => {
    // If speech recognition isn't supported, show an explanation
    if (!isSpeechRecognitionSupported) {
      toast({
        title: "Voice input not available",
        description: "Your browser doesn't support speech recognition.",
        duration: 3000,
      });
      return;
    }
    
    // If we need permission, request it
    if (!hasRequestedPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    
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
          
          // If we get an error on start, try to reinitialize
          initializationAttempted.current = false;
          initializeSpeechRecognition();
        }
      } else {
        // If recognition wasn't initialized, try again
        initializationAttempted.current = false;
        initializeSpeechRecognition();
      }
    }
  }, [
    isSpeechRecognitionSupported, 
    hasRequestedPermission, 
    isListening, 
    requestMicrophonePermission,
    initializeSpeechRecognition
  ]);

  return {
    isListening,
    wakeWordDetected,
    isWaitingForCommand,
    voiceRecognitionRef,
    isSpeechRecognitionSupported,
    toggleVoiceInput,
    ensureRecognitionIsRunning,
    hasRequestedPermission
  };
};
