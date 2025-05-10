
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
    console.log("Speech Recognition supported:", isSupported);
    
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

  // Initialize speech recognition with improved error handling
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
      console.log("Initializing voice recognition...");
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
          setWakeWordDetected(false);
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
          setWakeWordDetected(false);
          setIsWaitingForCommand(false);
          setIsListening(false);
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

  // Initialize on component mount with better cleanup
  useEffect(() => {
    console.log("useSpeechRecognition effect running...");
    
    // Start initialization process
    initializeSpeechRecognition();
    
    // Clean up on component unmount
    return () => {
      console.log("Cleaning up speech recognition");
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping voice recognition during cleanup:", e);
        }
      }
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [initializeSpeechRecognition]);

  // Implement a function to restart recognition with better error handling
  const ensureRecognitionIsRunning = useCallback(() => {
    if (!isSpeechRecognitionSupported || !voiceRecognitionRef.current) {
      console.log("Cannot ensure recognition - not supported or not initialized");
      return;
    }
    
    console.log("Ensuring recognition is running");
    try {
      // First stop any existing instance to reset state
      voiceRecognitionRef.current.stop();
      
      // Then start after a short delay
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      restartTimeoutRef.current = setTimeout(() => {
        try {
          voiceRecognitionRef.current.start();
          console.log("Voice recognition restarted by ensure function");
        } catch (err) {
          console.error("Failed to restart in ensure function:", err);
        }
      }, 500); // Slightly longer delay for more reliable restart
    } catch (err) {
      console.error("Error in ensureRecognitionIsRunning:", err);
      
      // If we get an error, reset and try to reinitialize
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on stop during recovery
        }
      }
      
      // Reset initialization flag to allow fresh start
      initializationAttempted.current = false;
      
      // Schedule reinitialization after delay
      setTimeout(() => {
        initializeSpeechRecognition();
      }, 2000);
    }
  }, [isSpeechRecognitionSupported, initializeSpeechRecognition]);

  // Set up a watchdog to ensure recognition is running correctly
  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const watchdogInterval = setInterval(() => {
        if (isListening) {
          console.log("Recognition watchdog check - currently listening");
        } else {
          console.log("Recognition watchdog check - NOT listening");
          if (voiceRecognitionRef.current) {
            ensureRecognitionIsRunning();
          }
        }
      }, 15000); // Check every 15 seconds
      
      return () => clearInterval(watchdogInterval);
    }
  }, [isSpeechRecognitionSupported, isListening, ensureRecognitionIsRunning]);

  // Toggle voice input with improved state management
  const toggleVoiceInput = useCallback(async () => {
    console.log("Toggle voice input called", { isSpeechRecognitionSupported, isListening });
    
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
          console.log("Stopping voice recognition");
          voiceRecognitionRef.current.stop();
          
          // UI state will be updated by the onListeningEnd callback
          setWakeWordDetected(false);
          setIsWaitingForCommand(false);
        } catch (e) {
          console.error("Error stopping voice recognition:", e);
          // Force UI update in case callback doesn't fire
          setIsListening(false);
          setWakeWordDetected(false);
          setIsWaitingForCommand(false);
        }
      }
    } else {
      // Not listening, so start
      if (voiceRecognitionRef.current) {
        try {
          console.log("Starting voice recognition");
          voiceRecognitionRef.current.start();
          
          // UI update will come from the onListeningStart callback
          toast({
            title: "Voice input activated",
            description: "Say 'Hey Trade' to start giving a command",
            duration: 3000,
          });
        } catch (e) {
          console.error("Error starting voice recognition:", e);
          
          // If we get an error on start, try to reinitialize
          initializationAttempted.current = false;
          setTimeout(() => {
            initializeSpeechRecognition();
          }, 1000);
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
