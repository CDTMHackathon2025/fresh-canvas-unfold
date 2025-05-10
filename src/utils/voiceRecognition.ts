
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

// Enhanced wake word detection with improved sensitivity
const detectWakeWord = (transcript: string): boolean => {
  const lowerTranscript = transcript.toLowerCase().trim();
  console.log("Checking for wake word in:", lowerTranscript);
  
  // Different possible variations of "Hey Trade"
  const wakeWordVariations = [
    "hey trade",
    "hey tray",
    "hey traid",
    "heytrade",
    "hey trayd",
    "hay trade",
    "hay tray",
    "hey trading",
    "hi trade",
    "hi tray",
    "okay trade",
    "ok trade",
    "yotrade",
    // Add even more variations for better wake word detection
    "a trade",
    "trade",
    "hey train",
    "hey grade",
    "hey tres",
    "hey trey"
  ];
  
  // Check if any variation is in the transcript
  for (const variation of wakeWordVariations) {
    if (lowerTranscript.includes(variation)) {
      console.log("Wake word detected:", variation);
      return true;
    }
  }
  return false;
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
    // Create a fresh recognition instance
    const recognition = new SpeechRecognition();
    
    // Configure recognition with improved settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3; // Balance between accuracy and performance
    
    // Variables to track state
    let isListeningForCommand = false;
    let commandTimeout: NodeJS.Timeout | null = null;
    let lastTranscript = '';
    let hasErrored = false;
    let recognitionRestartCount = 0;
    let isListeningActive = true; // Track if we actually want to be listening
    let isProcessingSpeech = false; // Track if we're currently processing speech
    
    // Handle results with improved wake word detection and command completion
    recognition.onresult = (event: any) => {
      console.log("Speech recognition result received", { 
        results: event.results.length, 
        isListeningForCommand
      });
      
      const latestResult = event.results[event.results.length - 1];
      const transcript = latestResult[0].transcript;
      
      // Don't process if we're not supposed to be listening
      if (!isListeningActive) {
        console.log("Ignoring speech result - listening is inactive");
        return;
      }

      console.log("Speech recognized:", transcript, "isFinal:", latestResult.isFinal);
      
      // Wake word detection mode
      if (!isListeningForCommand) {
        // Check for wake word in any of the alternatives
        let wakeWordFound = false;
        for (let i = 0; i < Math.min(latestResult.length, 3); i++) {
          const alternativeTranscript = latestResult[i]?.transcript || "";
          if (detectWakeWord(alternativeTranscript)) {
            wakeWordFound = true;
            break;
          }
        }
        
        if (wakeWordFound || detectWakeWord(transcript)) {
          console.log("Wake word detected in:", transcript);
          isListeningForCommand = true;
          lastTranscript = '';
          onWakeWordDetected();
          isProcessingSpeech = true;
          
          // Reset after timeout if no further input received
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            console.log("Command timeout reached - ending command mode");
            isListeningForCommand = false;
            isProcessingSpeech = false;
            onListeningEnd();
          }, 8000); // 8 seconds to complete command
        }
      } 
      // Command mode - already listening for a command
      else {
        const lowerTranscript = transcript.toLowerCase();
        
        // Check for explicit stop commands
        if (lowerTranscript.includes("stop listening") || 
            lowerTranscript.includes("cancel command") ||
            lowerTranscript.includes("nevermind")) {
          console.log("Stop command detected");
          isListeningForCommand = false;
          isProcessingSpeech = false;
          onListeningEnd();
          if (commandTimeout) clearTimeout(commandTimeout);
          return;
        }
        
        // Final result - ready to process command
        if (latestResult.isFinal) {
          console.log("Final result received:", transcript);
          // This is a final result, capture it
          lastTranscript = transcript;
          
          // Only process if we have meaningful content
          if (lastTranscript.trim().length > 3) {
            console.log("Processing final command:", lastTranscript);
            // Clear any existing timeout
            if (commandTimeout) clearTimeout(commandTimeout);
            
            // Set a short timeout to allow for any additional speech segments
            commandTimeout = setTimeout(() => {
              console.log("Command complete - sending result:", lastTranscript);
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
              onSpeechResult(lastTranscript);
            }, 1000); // 1 second grace period
          } else {
            // Reset the timeout for short results that might not be complete
            if (commandTimeout) clearTimeout(commandTimeout);
            commandTimeout = setTimeout(() => {
              console.log("Command timeout with short input - ending command mode");
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
            }, 5000); // Extended timeout for short inputs
          }
        } 
        // Still speaking - extend the timeout
        else if (transcript.trim().length > 0) {
          console.log("Extending command timeout for ongoing speech");
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            // If we have content when timeout expires, submit it
            if (lastTranscript.trim().length > 3) {
              console.log("Command timeout reached with content - submitting:", lastTranscript);
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
              onSpeechResult(lastTranscript);
            } else {
              console.log("Command timeout reached without valid content - ending command mode");
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
            }
          }, 3000); // 3 second timeout for ongoing speech
        }
      }
    };
    
    // Improved recognition end handling with state management
    recognition.onend = () => {
      console.log("Recognition ended", { 
        hasErrored, 
        isListeningActive,
        isListeningForCommand,
        isProcessingSpeech 
      });
      
      // Don't restart if we had an error or if listening is deactivated
      if (hasErrored || !isListeningActive) {
        console.log("Not restarting recognition - error or deactivated");
        // Ensure UI is updated
        if (isProcessingSpeech) {
          isProcessingSpeech = false;
          onListeningEnd();
        }
        return;
      }
      
      // Limit restart attempts to prevent browser throttling
      if (recognitionRestartCount > 5) {
        console.log("Too many restart attempts - cooling down");
        setTimeout(() => {
          if (isListeningActive) {
            recognitionRestartCount = 0;
            try {
              recognition.start();
              console.log("Recognition restarted after cooling period");
            } catch (error) {
              console.error("Error restarting recognition after cooling:", error);
              hasErrored = true;
              if (isProcessingSpeech) {
                isProcessingSpeech = false;
                onListeningEnd();
              }
            }
          }
        }, 5000); // 5 second cooling period
        return;
      }
      
      // Normal restart with small delay to prevent rapid cycling
      if (isListeningActive) {
        recognitionRestartCount++;
        try {
          setTimeout(() => {
            if (isListeningActive) {
              recognition.start();
              console.log("Recognition restarted automatically");
            }
          }, 300); // Small delay before restarting
        } catch (error) {
          console.error("Error restarting recognition:", error);
          hasErrored = true;
          if (isProcessingSpeech) {
            isProcessingSpeech = false;
            onListeningEnd();
          }
        }
      }
    };
    
    // Better error handling
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific error types
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          console.error("Microphone access denied");
          hasErrored = true;
          break;
          
        case 'network':
          console.error("Network error in speech recognition");
          // Network errors may recover, allow restart after delay
          setTimeout(() => {
            if (isListeningActive) {
              try {
                recognition.start();
                console.log("Attempting restart after network error");
              } catch (e) {
                console.error("Failed to restart after network error:", e);
                hasErrored = true;
              }
            }
          }, 3000);
          break;
          
        case 'no-speech':
          console.log("No speech detected - this is normal");
          // Common and expected, let onend handle restart
          break;
          
        case 'aborted':
          console.log("Recognition aborted - this is normal for stop/start");
          // This happens during normal stop/start cycles
          break;
          
        default:
          console.error(`Unexpected recognition error: ${event.error}`);
          // Allow restart but track error state
          hasErrored = false;
      }
      
      // Clean up command state if needed
      if (isListeningForCommand) {
        isListeningForCommand = false;
        if (commandTimeout) clearTimeout(commandTimeout);
      }
      
      if (isProcessingSpeech) {
        isProcessingSpeech = false;
        onListeningEnd();
      }
    };
    
    // Interface for controlling speech recognition
    return {
      start: () => {
        try {
          // Mark as active before starting
          isListeningActive = true;
          recognitionRestartCount = 0;
          isListeningForCommand = false;
          hasErrored = false;
          lastTranscript = '';
          
          if (commandTimeout) {
            clearTimeout(commandTimeout);
            commandTimeout = null;
          }
          
          recognition.start();
          console.log("Voice recognition started successfully");
          onListeningStart();
        } catch (err) {
          console.error("Failed to start speech recognition:", err);
          
          // Try with explicit permission if initial start failed
          if (mightRequirePermission()) {
            requestMicrophonePermission()
              .then(granted => {
                if (granted && isListeningActive) {
                  try {
                    recognition.start();
                    console.log("Recognition started after permission grant");
                    onListeningStart();
                  } catch (err2) {
                    console.error("Still failed after permission grant:", err2);
                    hasErrored = true;
                    onListeningEnd();
                  }
                } else {
                  hasErrored = true;
                  onListeningEnd();
                }
              })
              .catch(err => {
                console.error("Permission request error:", err);
                hasErrored = true;
                onListeningEnd();
              });
          } else {
            hasErrored = true;
            onListeningEnd();
          }
        }
      },
      stop: () => {
        try {
          // Mark as inactive before stopping
          isListeningActive = false;
          isListeningForCommand = false;
          if (commandTimeout) {
            clearTimeout(commandTimeout);
            commandTimeout = null;
          }
          
          recognition.stop();
          console.log("Voice recognition stopped successfully");
          if (isProcessingSpeech) {
            isProcessingSpeech = false;
            onListeningEnd();
          }
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
