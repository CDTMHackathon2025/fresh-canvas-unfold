// Voice recognition utility for "Hey Trade" wake word detection

// Browser compatibility check - support Firefox, Safari, Chrome and Edge
const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 
     'webkitSpeechRecognition' in window);
};

// Get the appropriate SpeechRecognition constructor based on browser support
const getSpeechRecognition = (): any => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }
  
  // Try different browser implementations
  // @ts-ignore - TypeScript doesn't know about these browser-specific APIs
  return window.SpeechRecognition || 
         window.webkitSpeechRecognition;
};

// Check if the browser requires permission for microphone access
const mightRequirePermission = (): boolean => {
  // Chrome, Edge and newer browsers require explicit permission
  return !!navigator.mediaDevices && 
    typeof navigator.mediaDevices.getUserMedia === 'function';
};

// Create a mock recognition implementation for unsupported environments
const createMockRecognition = (
  onListeningStart: () => void,
  onListeningEnd: () => void
) => {
  console.log("Using fallback mock recognition (speech recognition not supported)");
  
  return {
    start: () => {
      console.log("Mock voice recognition would start here (if supported)");
      // We don't actually trigger onListeningStart to avoid confusing the user
      // with UI that suggests voice is working when it isn't
    },
    stop: () => {
      console.log("Mock voice recognition would stop here (if supported)");
      onListeningEnd();
    }
  };
};

// Attempt to request microphone permission explicitly
const requestMicrophonePermission = async (): Promise<boolean> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Success! We have permission
    // Stop all tracks to clean up
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("Microphone permission denied:", error);
    return false;
  }
};

// Initialize speech recognition with wake word detection
export const initVoiceRecognition = (
  onWakeWordDetected: () => void,
  onSpeechResult: (transcript: string) => void,
  onListeningStart: () => void,
  onListeningEnd: () => void
) => {
  if (!isSpeechRecognitionSupported()) {
    console.error("Speech Recognition not supported in this browser");
    return createMockRecognition(onListeningStart, onListeningEnd);
  }

  const SpeechRecognition = getSpeechRecognition();
  if (!SpeechRecognition) {
    console.error("Could not initialize Speech Recognition");
    return createMockRecognition(onListeningStart, onListeningEnd);
  }
  
  // Try to request microphone permission first if needed
  if (mightRequirePermission()) {
    requestMicrophonePermission()
      .then(granted => {
        console.log("Microphone permission explicitly requested:", granted ? "granted" : "denied");
      })
      .catch(err => {
        console.error("Error requesting microphone permission:", err);
      });
  }
  
  try {
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Variables to track state
    let isListeningForCommand = false;
    let commandTimeout: NodeJS.Timeout | null = null;
    let lastTranscript = '';
    let hasErrored = false;
    
    // Handle results
    recognition.onresult = (event: any) => {
      const latestResult = event.results[event.results.length - 1];
      const transcript = latestResult[0].transcript;

      console.log("Speech recognized:", transcript);
      
      // Wake word detection
      if (!isListeningForCommand) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes("hey trade")) {
          isListeningForCommand = true;
          lastTranscript = '';
          onWakeWordDetected();
          onListeningStart();
          
          // Reset after 10 seconds of no activity
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            isListeningForCommand = false;
            onListeningEnd();
          }, 10000);
        }
      } else {
        // We're already listening for a command
        const lowerTranscript = transcript.toLowerCase();
        
        if (lowerTranscript.includes("stop") || 
            lowerTranscript.includes("cancel")) {
          isListeningForCommand = false;
          onListeningEnd();
          if (commandTimeout) clearTimeout(commandTimeout);
        } else if (latestResult.isFinal) {
          // This is a final result, send it to the callback
          lastTranscript = transcript;
          // Keep command mode active for a short period to let user continue
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            isListeningForCommand = false;
            onListeningEnd();
            onSpeechResult(lastTranscript);
          }, 1500);
        } else {
          // Still speaking, extend the timeout
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            if (lastTranscript) {
              isListeningForCommand = false;
              onListeningEnd();
              onSpeechResult(lastTranscript);
            } else {
              isListeningForCommand = false;
              onListeningEnd();
            }
          }, 3000);
        }
      }
    };
    
    recognition.onend = () => {
      // If this is due to an error, don't restart automatically
      if (hasErrored) {
        console.log("Recognition ended after error, not restarting automatically");
        hasErrored = false;
        return;
      }
      
      // Otherwise restart recognition to keep listening for wake word
      try {
        recognition.start();
      } catch (error) {
        console.error("Error restarting speech recognition:", error);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      
      // Handle specific error types
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          console.error("Microphone access was denied by the user or system");
          hasErrored = true;
          break;
          
        case 'network':
          console.error("Network error occurred during speech recognition");
          break;
          
        case 'no-speech':
          console.log("No speech detected");
          // This is a common error that shouldn't stop recognition
          break;
          
        default:
          console.error(`Unexpected speech recognition error: ${event.error}`);
      }
      
      isListeningForCommand = false;
      onListeningEnd();
    };
    
    // For Firefox, which might have different behavior
    // @ts-ignore
    if (typeof recognition.addEventListener === 'function') {
      // @ts-ignore
      recognition.addEventListener('audiostart', () => {
        console.log("Audio capture started");
      });
      
      // @ts-ignore
      recognition.addEventListener('audioend', () => {
        console.log("Audio capture ended");
      });
    }
    
    return {
      start: () => {
        try {
          recognition.start();
          console.log("Voice recognition started");
        } catch (err) {
          console.error("Failed to start speech recognition:", err);
          
          // Try with explicit permission if this failed
          if (mightRequirePermission()) {
            requestMicrophonePermission()
              .then(granted => {
                if (granted) {
                  try {
                    recognition.start();
                    console.log("Voice recognition started after explicit permission");
                  } catch (err2) {
                    console.error("Still failed to start recognition after permission:", err2);
                  }
                }
              })
              .catch(err => console.error("Error requesting permission:", err));
          }
        }
      },
      stop: () => {
        try {
          recognition.stop();
          isListeningForCommand = false;
          if (commandTimeout) clearTimeout(commandTimeout);
          console.log("Voice recognition stopped");
        } catch (err) {
          console.error("Failed to stop speech recognition:", err);
        }
      }
    };
  } catch (error) {
    console.error("Exception initializing speech recognition:", error);
    return createMockRecognition(onListeningStart, onListeningEnd);
  }
};
