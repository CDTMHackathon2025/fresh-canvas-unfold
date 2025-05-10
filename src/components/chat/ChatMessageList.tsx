
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
      <div className="flex flex-col space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
