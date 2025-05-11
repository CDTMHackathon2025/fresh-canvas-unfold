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
  if (!transcript) return false;
  
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
    
    // Add helper function to log state transitions for debugging
    const logStateTransition = (action: string, detail: string = '') => {
      console.log(`STATE TRANSITION [${action}]${detail ? ': ' + detail : ''}`, {
        isListeningForCommand,
        isProcessingSpeech,
        hasAccumulatedText: accumulatedTranscript.length > 0
      });
    };
    
    // Variables to track state
    let isListeningForCommand = false;
    let commandTimeout: ReturnType<typeof setTimeout> | null = null; // Fixed NodeJS.Timeout to work in browser
    let lastTranscript = '';
    let fullCommand = ''; // Store the complete command
    let hasErrored = false;
    let recognitionRestartCount = 0;
    let isListeningActive = true; // Track if we actually want to be listening
    let isProcessingSpeech = false; // Track if we're currently processing speech
    let accumulatedTranscript = ''; // Accumulate transcript over multiple segments
    
    // Handle results with improved wake word detection and command accumulation
    recognition.onresult = (event: any) => {
      // Don't process if we're not supposed to be listening
      if (!isListeningActive) {
        console.log("Ignoring speech result - listening is inactive");
        return;
      }
      
      console.log("Speech recognition result received", { 
        results: event.results.length, 
        isListeningForCommand
      });
      
      if (!event.results || event.results.length === 0) {
        console.log("No results in speech event");
        return;
      }
      
      const latestResult = event.results[event.results.length - 1];
      if (!latestResult || latestResult.length === 0) {
        console.log("Invalid result format");
        return;
      }
      
      const transcript = latestResult[0].transcript || "";
      
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
          accumulatedTranscript = ''; // Reset accumulated transcript
          fullCommand = ''; // Reset full command
          onWakeWordDetected();
          isProcessingSpeech = true;
          
          // Filter out the wake word from initial transcript for better command capture
          let initialCommandText = transcript;
          const wakeWordVariations = ["hey trade", "hey tray", "trade", "hey traid", "heytrade", "hi trade"];
          for (const wakeWord of wakeWordVariations) {
            initialCommandText = initialCommandText.replace(new RegExp(wakeWord, 'i'), '').trim();
          }
          
          // If there's remaining text after the wake word, start accumulating it
          if (initialCommandText.length > 0) {
            accumulatedTranscript = initialCommandText;
            console.log("Initial command content detected:", initialCommandText);
            
            // Check for quick complete commands (wake word plus complete command)
            if (initialCommandText.length > 10) {
              // Look for natural ending in the command
              const endsWithPunctuation = /[.!?]$/.test(initialCommandText);
              
              // Immediate command submission for commands that appear complete
              if (endsWithPunctuation || latestResult.isFinal) {
                console.log("Immediate command completion detected");
                if (commandTimeout) clearTimeout(commandTimeout);
                commandTimeout = setTimeout(() => {
                  fullCommand = accumulatedTranscript;
                  isListeningForCommand = false;
                  isProcessingSpeech = false;
                  onSpeechResult(fullCommand);
                }, 800); // Short delay to see if there's more coming
                return;
              }
            }
          }
          
          // Reset after timeout if no further input received
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(() => {
            console.log("Command timeout reached with no further input");
            // Only end if we don't have significant accumulated text
            if (accumulatedTranscript.length <= 2) {
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
            } else {
              // We have content, submit it
              fullCommand = accumulatedTranscript;
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onSpeechResult(fullCommand);
            }
          }, 5000); // Shortened from 10 seconds to 5 seconds to complete command
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
        
        // If this is a continued transcript, accumulate it
        if (latestResult.isFinal) {
          console.log("Final result received for command:", transcript);
          
          // Remove any wake word phrases from the transcript
          let cleanedTranscript = transcript;
          const wakeWordVariations = ["hey trade", "hey tray", "trade"];
          for (const wakeWord of wakeWordVariations) {
            cleanedTranscript = cleanedTranscript.replace(new RegExp(wakeWord, 'i'), '').trim();
          }
          
          // Only add to accumulation if it has content
          if (cleanedTranscript.length > 0) {
            // If we're getting content, add it to accumulation
            if (accumulatedTranscript.length > 0) {
              accumulatedTranscript += " " + cleanedTranscript;
            } else {
              accumulatedTranscript = cleanedTranscript;
            }
            
            console.log("Accumulated transcript so far:", accumulatedTranscript);
            
            // Check for natural command completion phrases
            const completionPhrases = [
              "thank you", "thanks", "that's all", "that is all", 
              "please", "go ahead", "submit", "send", "do it",
              "that's it", "that is it", "got it", "done", "over"
            ];
            
            let shouldCompleteCommand = false;
            for (const phrase of completionPhrases) {
              if (cleanedTranscript.toLowerCase().includes(phrase) || 
                  accumulatedTranscript.toLowerCase().endsWith(phrase)) {
                console.log("Command completion phrase detected:", phrase);
                shouldCompleteCommand = true;
                break;
              }
            }
            
            // Also check for natural ending (complete sentence with pause)
            const endsWithPunctuation = /[.!?]$/.test(cleanedTranscript.trim());
            const pauseAfterSentence = latestResult.isFinal && endsWithPunctuation;
            
            // Detect natural pause after a reasonable-length command
            if ((pauseAfterSentence && accumulatedTranscript.length > 10) || shouldCompleteCommand) {
              console.log("Natural command completion detected - submitting:", accumulatedTranscript);
              // Small delay to catch any other final results
              clearTimeout(commandTimeout);
              commandTimeout = setTimeout(() => {
                fullCommand = accumulatedTranscript;
                isListeningForCommand = false;
                isProcessingSpeech = false;
                onSpeechResult(fullCommand);
              }, 500);
              return;
            }
            
            // Reset timeout to give more time for additional speech
            if (commandTimeout) clearTimeout(commandTimeout);
            
            // Shorter timeout for commands that already have substantial content
            const timeoutDuration = accumulatedTranscript.length > 20 ? 2000 : 3000;
            
            commandTimeout = setTimeout(() => {
              // Only submit if we have reasonable content
              if (accumulatedTranscript.length > 2) {
                console.log("Command complete after timeout - submitting:", accumulatedTranscript);
                fullCommand = accumulatedTranscript;
                isListeningForCommand = false;
                isProcessingSpeech = false;
                onSpeechResult(fullCommand);
              } else {
                console.log("Command timeout with insufficient content");
                isListeningForCommand = false;
                isProcessingSpeech = false;
                onListeningEnd();
              }
            }, timeoutDuration);
          }
        } 
        // Still speaking - extend the timeout
        else if (transcript.trim().length > 0) {
          console.log("Interim result, extending timeout");
          if (commandTimeout) clearTimeout(commandTimeout);
          
          // Natural pauses should trigger command completion faster
          // if we already have substantial content
          const timeoutDuration = accumulatedTranscript.length > 15 ? 2000 : 5000;
          
          commandTimeout = setTimeout(() => {
            // If we have content when timeout expires, submit it
            if (accumulatedTranscript.length > 2) {
              console.log("Command timeout reached with content - submitting:", accumulatedTranscript);
              fullCommand = accumulatedTranscript;
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onSpeechResult(fullCommand);
            } else {
              console.log("Command timeout reached without valid content");
              isListeningForCommand = false;
              isProcessingSpeech = false;
              onListeningEnd();
            }
          }, timeoutDuration);
        }
      }
    };
    
    // Improved recognition end handling with state management
    recognition.onend = () => {
      console.log("Recognition ended", { 
        hasErrored, 
        isListeningActive,
        isListeningForCommand,
        isProcessingSpeech,
        accumulatedTranscript
      });
      
      // If we have accumulated content when recognition ends, submit it
      if (isListeningForCommand && accumulatedTranscript.length > 2) {
        console.log("Recognition ended with content - submitting:", accumulatedTranscript);
        fullCommand = accumulatedTranscript;
        // Delay clearing listening state to prevent race conditions with onresult events
        setTimeout(() => {
          if (isListeningForCommand) { // Check if still in command mode
            isListeningForCommand = false;
            isProcessingSpeech = false;
            onSpeechResult(fullCommand);
          }
        }, 300);
        return;
      }
      
      // Still in command mode but not enough content
      if (isListeningForCommand) {
        console.log("Still in command mode but recognition ended - preserving command state");
        // Don't reset command mode, just restart recognition to continue listening
      }
      
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
        setTimeout(() => {
          if (isListeningActive) {
            try {
              // Log additional info about command state before restart
              console.log("Restarting recognition with state:", {
                isListeningForCommand,
                accumulatedTranscript,
                isProcessingSpeech
              });
              
              recognition.start();
              console.log("Recognition restarted automatically");
              
              // If we were in command mode, make sure UI reflects this
              if (isListeningForCommand && !isProcessingSpeech) {
                isProcessingSpeech = true;
                // Signal that we're still processing commands
                onWakeWordDetected(); 
              }
            } catch (error) {
              console.error("Error restarting recognition:", error);
              hasErrored = true;
              if (isProcessingSpeech) {
                isProcessingSpeech = false;
                onListeningEnd();
              }
            }
          }
        }, 300); // Small delay before restarting
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
                
                // Preserve command mode state through network errors
                if (isListeningForCommand && !isProcessingSpeech) {
                  isProcessingSpeech = true;
                  onWakeWordDetected();
                }
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
          // Important: Do NOT exit command mode on no-speech error!
          hasErrored = false; // Make sure we don't prevent restart
          break;
          
        case 'aborted':
          console.log("Recognition aborted - this is normal for stop/start");
          // This happens during normal stop/start cycles
          hasErrored = false; // Make sure we don't prevent restart
          break;
          
        default:
          console.error(`Unexpected recognition error: ${event.error}`);
          // Allow restart but don't count minor errors as fatal
          hasErrored = false;
      }
      
      // Clean up command state if needed
      if (isListeningForCommand && accumulatedTranscript.length > 2) {
        // If we have accumulated text, send it despite the error
        console.log("Sending accumulated speech before handling error:", accumulatedTranscript);
        fullCommand = accumulatedTranscript;
        onSpeechResult(fullCommand);
      }
      
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
          accumulatedTranscript = '';
          fullCommand = '';
          
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
          
          // If we have accumulated content, send it before stopping
          if (accumulatedTranscript && accumulatedTranscript.length > 2) {
            console.log("Sending accumulated speech before stopping:", accumulatedTranscript);
            fullCommand = accumulatedTranscript;
            onSpeechResult(fullCommand);
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