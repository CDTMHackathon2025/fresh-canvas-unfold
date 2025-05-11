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
        isWakeWordMode,
        hasAccumulatedText: accumulatedTranscript.length > 0
      });
    };
    
    // Variables to track state
    let isListeningForCommand = false;
    let commandTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastTranscript = '';
    let fullCommand = ''; // Store the complete command
    let hasErrored = false;
    let recognitionRestartCount = 0;
    let isListeningActive = true; // Track if we actually want to be listening
    let isProcessingSpeech = false; // Track if we're currently processing speech
    let accumulatedTranscript = ''; // Accumulate transcript over multiple segments
    let lastSubmissionTime = 0; // Track when we last submitted to prevent duplicates
    let isWakeWordMode = true; // NEW: Explicitly track if we're just listening for wake word
    
    // Handle results with improved wake word detection and command accumulation
    recognition.onresult = (event: any) => {
      // Don't process if we're not supposed to be listening
      if (!isListeningActive) {
        console.log("Ignoring speech result - listening is inactive");
        return;
      }
      
      console.log("Speech recognition result received", { 
        results: event.results.length, 
        isListeningForCommand,
        isWakeWordMode // Log our new state
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
      if (isWakeWordMode) {
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
          isWakeWordMode = false; // Exit wake word mode
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
                  isWakeWordMode = true; // FIXED: Return to wake word mode
                  submitCommand(fullCommand);
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
              isWakeWordMode = true; // FIXED: Return to wake word mode
              onListeningEnd();
            } else {
              // We have content, submit it
              fullCommand = accumulatedTranscript;
              isListeningForCommand = false;
              isProcessingSpeech = false;
              isWakeWordMode = true; // FIXED: Return to wake word mode
              submitCommand(fullCommand);
            }
          }, 7000); // Increased from 3 seconds to 7 seconds to give more time for speech input
        }
      } 
      // Command mode - already listening for a command
      else if (isListeningForCommand) {
        const lowerTranscript = transcript.toLowerCase();
        
        // Check for explicit stop commands
        if (lowerTranscript.includes("stop listening") || 
            lowerTranscript.includes("cancel command") ||
            lowerTranscript.includes("nevermind")) {
          console.log("Stop command detected");
          isListeningForCommand = false;
          isProcessingSpeech = false;
          isWakeWordMode = true; // FIXED: Return to wake word mode
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
                isWakeWordMode = true; // FIXED: Return to wake word mode
                submitCommand(fullCommand);
              }, 1000); // Increased from 300ms to 1000ms to allow for continued speech
              return;
            }
            
            // Reset timeout to give more time for additional speech
            if (commandTimeout) clearTimeout(commandTimeout);
            
            // Longer timeout for commands to allow more speech input time
            const timeoutDuration = accumulatedTranscript.length > 20 ? 5000 : 7000; // Increased timeout durations
            
            commandTimeout = setTimeout(() => {
              // Only submit if we have reasonable content
              if (accumulatedTranscript.length > 2) {
                console.log("Command complete after timeout - submitting:", accumulatedTranscript);
                fullCommand = accumulatedTranscript;
                isListeningForCommand = false;
                isProcessingSpeech = false;
                isWakeWordMode = true; // FIXED: Return to wake word mode
                submitCommand(fullCommand);
              } else {
                console.log("Command timeout with insufficient content");
                isListeningForCommand = false;
                isProcessingSpeech = false;
                isWakeWordMode = true; // FIXED: Return to wake word mode
                onListeningEnd();
              }
            }, timeoutDuration);
          }
        } 
        // Still speaking - extend the timeout
        else if (transcript.trim().length > 0) {
          console.log("Interim result, extending timeout");
          if (commandTimeout) clearTimeout(commandTimeout);
          
          // Natural pauses should give more time to continue speaking
          // but still complete eventually if no more input is detected
          const timeoutDuration = accumulatedTranscript.length > 15 ? 6000 : 8000; // Increased timeouts
          
          commandTimeout = setTimeout(() => {
            // If we have content when timeout expires, submit it
            if (accumulatedTranscript.length > 2) {
              console.log("Command timeout reached with content - submitting:", accumulatedTranscript);
              fullCommand = accumulatedTranscript;
              isListeningForCommand = false;
              isProcessingSpeech = false;
              isWakeWordMode = true; // FIXED: Return to wake word mode
              submitCommand(fullCommand);
            } else {
              console.log("Command timeout reached without valid content");
              isListeningForCommand = false;
              isProcessingSpeech = false;
              isWakeWordMode = true; // FIXED: Return to wake word mode
              onListeningEnd();
            }
          }, timeoutDuration);
        }
      }
      // FIXED: If we're not in command mode or wake word mode, ignore speech
      else {
        console.log("Speech detected but not in active listening mode - ignoring");
      }
    };
    
    // Helper function to prevent duplicate submissions
    const submitCommand = (command: string) => {
      const now = Date.now();
      // Prevent duplicate submissions within 1.5 seconds
      if (now - lastSubmissionTime < 1500) {
        console.log("Preventing duplicate submission");
        return;
      }
      
      // Force all states to be reset correctly
      isListeningForCommand = false;
      isProcessingSpeech = false;
      isWakeWordMode = true; // FIXED: Always return to wake word mode after submission
      
      // Update submission time
      lastSubmissionTime = now;
      
      // Actually submit the command
      console.log("SUBMITTING COMMAND:", command);
      onSpeechResult(command);
      
      // Ensure UI is updated
      setTimeout(() => {
        onListeningEnd();
      }, 100);
    };
    
    // Improved recognition end handling with state management
    recognition.onend = () => {
      console.log("Recognition ended", { 
        hasErrored, 
        isListeningActive,
        isListeningForCommand,
        isProcessingSpeech,
        isWakeWordMode, // Log our new state
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
            isWakeWordMode = true; // FIXED: Return to wake word mode
            submitCommand(fullCommand);
          }
        }, 300);
        return;
      }
      
      // FIXED: Ensure we're in wake word mode if recognition ends
      if (!isWakeWordMode) {
        isWakeWordMode = true;
        console.log("Resetting to wake word mode after recognition ended");
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
                isWakeWordMode,
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
    
    // Add a specific handler for no-speech timeout
    recognition.onnomatch = (event: any) => {
      console.log("No match for speech input - continuing to listen");
      // Don't stop listening - this helps with longer sentences
      if (isListeningForCommand && accumulatedTranscript.length > 0) {
        // Extended timeout on no match to give more time for speech input
        if (commandTimeout) clearTimeout(commandTimeout);
        commandTimeout = setTimeout(() => {
          if (accumulatedTranscript.length > 2) {
            console.log("No more matches - submitting accumulated text");
            fullCommand = accumulatedTranscript;
            isListeningForCommand = false;
            isProcessingSpeech = false;
            isWakeWordMode = true; // FIXED: Return to wake word mode
            submitCommand(fullCommand);
          } else {
            // FIXED: Return to wake word mode if we don't have enough text
            isListeningForCommand = false;
            isProcessingSpeech = false;
            isWakeWordMode = true;
            onListeningEnd();
          }
        }, 8000); // Long timeout for sentence completion
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
          
          // IMPORTANT: If we've been in command mode too long with no speech, finish up
          // BUT only if we have substantial content already
          if (isListeningForCommand && accumulatedTranscript.length > 10) {
            console.log("No speech detected but we have substantial text - submitting");
            fullCommand = accumulatedTranscript;
            isListeningForCommand = false;
            isProcessingSpeech = false;
            isWakeWordMode = true; // FIXED: Return to wake word mode
            submitCommand(fullCommand);
          } else if (isListeningForCommand) {
            // Set a longer timeout for continuing to listen
            console.log("No speech detected but continuing to listen for more input");
            if (commandTimeout) clearTimeout(commandTimeout);
            commandTimeout = setTimeout(() => {
              if (accumulatedTranscript.length > 2) {
                fullCommand = accumulatedTranscript;
                isListeningForCommand = false;
                isProcessingSpeech = false;
                isWakeWordMode = true; // FIXED: Return to wake word mode
                submitCommand(fullCommand);
              } else {
                isListeningForCommand = false;
                isProcessingSpeech = false;
                isWakeWordMode = true; // FIXED: Return to wake word mode
                onListeningEnd();
              }
            }, 6000); // Give more time for user to continue their sentence
          }
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
        submitCommand(fullCommand);
      }
      
      if (isListeningForCommand) {
        isListeningForCommand = false;
        isWakeWordMode = true; // FIXED: Always return to wake word mode
        if (commandTimeout) clearTimeout(commandTimeout);
      }
      
      if (isProcessingSpeech) {
        isProcessingSpeech = false;
        onListeningEnd();
      }
    };
    
    // Add audiostart event to handle recognition starting successfully
    recognition.onaudiostart = () => {
      console.log("Audio capture has started");
      // This confirms the microphone is actually capturing audio
    };
    
    // Interface for controlling speech recognition
    return {
      start: () => {
        try {
          // Mark as active before starting
          isListeningActive = true;
          recognitionRestartCount = 0;
          isListeningForCommand = false;
          isWakeWordMode = true; // FIXED: Start in wake word mode
          hasErrored = false;
          lastTranscript = '';
          accumulatedTranscript = '';
          fullCommand = '';
          
          if (commandTimeout) {
            clearTimeout(commandTimeout);
            commandTimeout = null;
          }
          
          recognition.start();
          console.log("Voice recognition started successfully in wake word mode");
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
          isWakeWordMode = true; // FIXED: Reset to wake word mode when stopped
          if (commandTimeout) {
            clearTimeout(commandTimeout);
            commandTimeout = null;
          }
          
          // If we have accumulated content, send it before stopping
          if (accumulatedTranscript && accumulatedTranscript.length > 2) {
            console.log("Sending accumulated speech before stopping:", accumulatedTranscript);
            fullCommand = accumulatedTranscript;
            submitCommand(fullCommand);
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