
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import AnimatedAvatar from "@/components/AnimatedAvatar";
import ChatMessageList from "@/components/chat/ChatMessageList";
import MessageInput from "@/components/chat/MessageInput";
import VoiceIndicators from "@/components/chat/VoiceIndicators";
import { useChatState } from "@/hooks/useChatState";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

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
    toggleVoice,
    toggleSpeech,
    handleSendVoiceMessage,
    handleSendMessage
  } = useChatState(textToSpeechRef);
  
  // Initialize speech recognition
  const {
    isListening,
    wakeWordDetected,
    isWaitingForCommand,
    isSpeechRecognitionSupported
  } = useSpeechRecognition(handleSendVoiceMessage);
  
  // Avatar state
  const [avatarStatus, setAvatarStatus] = useState<"idle" | "listening" | "speaking">("idle");
  
  // Update avatar status based on chat state
  useEffect(() => {
    if (isListening || isWaitingForCommand) {
      setAvatarStatus("listening");
    } else if (isSpeaking) {
      setAvatarStatus("speaking");
    } else {
      setAvatarStatus("idle");
    }
  }, [isListening, isWaitingForCommand, isSpeaking]);

  // Disable voice activation if speech recognition is not supported
  useEffect(() => {
    if (!isSpeechRecognitionSupported && isVoiceActive) {
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
      
      <main className="flex-1 flex flex-col pt-16 pb-28">
        {/* Avatar section */}
        <div className="flex justify-center py-3 sticky top-16 z-10 bg-black/40 backdrop-blur-sm">
          <AnimatedAvatar status={avatarStatus} size="md" />
          
          {/* Display speech recognition not supported message */}
          {!isSpeechRecognitionSupported && (
            <div className="absolute right-3 top-2 flex items-center text-amber-400 text-xs">
              <AlertTriangle size={12} className="mr-1" />
              <span>Voice input not supported</span>
            </div>
          )}
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
            toggleVoice={toggleVoice}
            toggleSpeech={toggleSpeech}
            isSpeechRecognitionSupported={isSpeechRecognitionSupported}
          />
        </div>
      </main>
      
      <BottomNavigation activePage="chat" />
    </div>
  );
};

export default Chat;
