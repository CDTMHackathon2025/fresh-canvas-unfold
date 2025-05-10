
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import VoiceControls from "./VoiceControls";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isVoiceActive: boolean;
  speechEnabled: boolean;
  toggleVoice: () => void;
  toggleSpeech: () => void;
  isSpeechRecognitionSupported?: boolean;
  isListening?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
  isLoading,
  isVoiceActive,
  speechEnabled,
  toggleVoice,
  toggleSpeech,
  isSpeechRecognitionSupported = true,
  isListening = false
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center space-x-2">
        <Textarea 
          placeholder="Ask Hey Trade about finance and investing..." 
          className="flex-1 min-h-[60px] resize-none bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="flex flex-col space-y-2">
          <VoiceControls 
            isVoiceActive={isVoiceActive}
            speechEnabled={speechEnabled}
            toggleVoice={toggleVoice}
            toggleSpeech={toggleSpeech}
            isSpeechRecognitionSupported={isSpeechRecognitionSupported}
            isListening={isListening}
          />
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-xs text-center text-gray-400 mt-2">
          Thinking...
        </div>
      )}
    </div>
  );
};

export default MessageInput;
