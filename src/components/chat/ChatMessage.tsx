
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      key={message.id} 
      className={`${
        message.role === 'assistant' 
          ? "bg-blue-900/50 self-start" 
          : "bg-gray-800/80 self-end"
      } rounded-lg p-3 max-w-[80%] flex items-start animate-fade-in`}
    >
      {message.role === 'assistant' && (
        <div className="mr-2 flex-shrink-0 mt-1">
          <Avatar className="h-6 w-6 bg-blue-900/30 ring-1 ring-blue-400/30">
            <AvatarImage src="/placeholder.svg" alt="Hey Trade" className="opacity-70" />
            <AvatarFallback className="bg-blue-600/50 text-blue-100 text-xs border border-blue-400/20 backdrop-blur-sm">HT</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div>
        <p className="text-sm whitespace-pre-wrap text-white">{message.content}</p>
        <span className="text-xs text-gray-400 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
