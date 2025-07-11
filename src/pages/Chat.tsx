
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import Avatar3D from "@/components/avatar3D/Avatar3D";
import ChatMessageList from "@/components/chat/ChatMessageList";
import MessageInput from "@/components/chat/MessageInput";
import VoiceIndicators from "@/components/chat/VoiceIndicators";
import { useChatState } from "@/hooks/useChatState";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "@/hooks/use-toast";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const Chat = () => {
  // Initialize text-to-speech
  const { textToSpeechRef } = useTextToSpeech();
  
  // Initialize chat state
  const { 
    messages,
    message,
    setMessage,
    isLoading,
    isVoiceActive,
    isSpeaking,
    speechEnabled,
    debugMode,
    toggleVoice,
    toggleSpeech,
    toggleDebugMode,
    handleSendVoiceMessage,
    handleSendMessage
  } = useChatState(textToSpeechRef);
  
  // Initialize speech recognition with enhanced wake word detection
  const {
    isListening,
    wakeWordDetected,
    isWaitingForCommand,
    isSpeechRecognitionSupported,
    toggleVoiceInput,
    ensureRecognitionIsRunning
  } = useSpeechRecognition(handleSendVoiceMessage);
  
  // Avatar state
  const [avatarStatus, setAvatarStatus] = useState<"idle" | "listening" | "speaking">("idle");
  const [avatarEmotion, setAvatarEmotion] = useState<"neutral" | "confident" | "thinking" | "happy" | "surprised" | "concerned">("neutral");
  
  // Update avatar status based on chat state
  useEffect(() => {
    if (isListening || isWaitingForCommand) {
      setAvatarStatus("listening");
      setAvatarEmotion(wakeWordDetected ? "thinking" : "neutral");
    } else if (isSpeaking) {
      setAvatarStatus("speaking");
      setAvatarEmotion("confident");
    } else {
      setAvatarStatus("idle");
      setAvatarEmotion("neutral");
    }
  }, [isListening, isWaitingForCommand, isSpeaking, wakeWordDetected]);

  // Ensure recognition is running on mount with improved startup logic
  useEffect(() => {
    console.log("Chat component mounted, checking speech recognition");
    
    const delayedInit = setTimeout(() => {
      // Start voice recognition if supported
      if (isSpeechRecognitionSupported && !isListening) {
        console.log("Initializing voice recognition on mount");
        toggleVoiceInput();
        toggleVoice(); // Update UI state
      }
    }, 1000); // Small delay to ensure components are fully mounted
    
    return () => clearTimeout(delayedInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeechRecognitionSupported]);

  // More reliable recognition watchdog
  useEffect(() => {
    // Set up watchdog timer for voice recognition
    const checkRecognitionInterval = setInterval(() => {
      if (isVoiceActive && !isListening) {
        console.log("Voice watchdog: Active but not listening - restarting");
        ensureRecognitionIsRunning();
      }
    }, 20000); // Check every 20 seconds
    
    return () => clearInterval(checkRecognitionInterval);
  }, [isVoiceActive, isListening, ensureRecognitionIsRunning]);

  // Improved synchronization between UI state and actual listening
  useEffect(() => {
    // Avoid unnecessary toggles by checking both sides
    if (isVoiceActive && !isListening) {
      console.log("Syncing state: Voice active but not listening");
      toggleVoiceInput();
    } else if (!isVoiceActive && isListening) {
      console.log("Syncing state: Voice inactive but still listening");
      toggleVoiceInput();
    }
  }, [isVoiceActive, isListening, toggleVoiceInput]);

  // Handle voice toggle with clearer log messages
  const handleToggleVoice = () => {
    console.log("User toggled voice input", { currentState: isVoiceActive, isListening });
    toggleVoice();
    toggleVoiceInput();
  };

  // Disable voice activation if speech recognition is not supported
  useEffect(() => {
    if (!isSpeechRecognitionSupported && isVoiceActive) {
      console.log("Disabling voice - not supported by browser");
      toggleVoice();
    }
  }, [isSpeechRecognitionSupported, isVoiceActive, toggleVoice]);

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative animate-fade-in">
      <Header activeTab="Hey Trade" onTabChange={() => {}} showTabs={false} />
      
      {/* Increased top padding from pt-20 to pt-24 and increased mt-4 to mt-6 */}
      <main className="flex-1 flex flex-col pt-28 mt-8 pb-28">
        {/* Avatar section with more space */}
        <div className="flex justify-center py-4 sticky top-16 z-10 bg-black/40 backdrop-blur-sm">
          <Avatar3D 
            status={avatarStatus} 
            emotion={avatarEmotion} 
            size="lg" 
          />
          
          {/* Display speech recognition not supported message */}
          {!isSpeechRecognitionSupported && (
            <div className="absolute right-3 top-2 flex items-center text-amber-400 text-xs">
              <span>Voice input not supported</span>
            </div>
          )}
          
          {/* Debug mode toggle button */}
          <div className="absolute right-3 bottom-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-7 px-2 rounded-full text-xs border-gray-700 ${
                debugMode ? 'bg-blue-900/50 text-blue-200' : 'bg-transparent text-gray-400'
              }`}
              onClick={toggleDebugMode}
              title="Toggle Debug Mode"
            >
              <Code size={14} className="mr-1" />
              <span>{debugMode ? 'Debug On' : 'Debug'}</span>
            </Button>
          </div>
        </div>
        
        {/* Messages list - taking available space */}
        <div className="flex-1 px-4 overflow-hidden">
          <ChatMessageList messages={messages} />
        </div>
        
        {/* Voice indicators */}
        <VoiceIndicators 
          isListening={isListening} 
          isWaitingForCommand={isWaitingForCommand}
          wakeWordDetected={wakeWordDetected}
          isSpeaking={isSpeaking}
        />
        
        {/* Message input - fixed at bottom */}
        <div className="px-4 py-3 sticky bottom-16 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-10">
          <MessageInput 
            message={message}
            setMessage={setMessage}
            handleSendMessage={() => handleSendMessage()}
            handleKeyDown={handleKeyDown}
            isLoading={isLoading}
            isVoiceActive={isVoiceActive}
            speechEnabled={speechEnabled}
            toggleVoice={handleToggleVoice}
            toggleSpeech={toggleSpeech}
            isSpeechRecognitionSupported={isSpeechRecognitionSupported}
            isListening={isListening}
          />
        </div>
      </main>
      
      <BottomNavigation activePage="chat" />
    </div>
  );
};

export default Chat;
