
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { sendMessageToOpenAI } from "@/services/openaiService";
import { 
  createInitialContext, 
  updateContext, 
  generateSystemPrompt,
  ConversationContext 
} from "@/utils/financialContext";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// API key with issue marker to indicate we should use fallback responses
const API_KEY_WITH_ISSUE = "sk-proj-x_mxurH0EM0YyAE3OxR_GGenUXkYz0TL-H37Y6TR9jw5_CRr6NfoydYWEmjD0HOdiLxMfi16qfT3BlbkFJD7b1gHSz3h0cY-MC89eklTh4RfzCbitBZuDufQ9ApD6o3kIaByF6Te_hpRO6OCVl1GG6X-IEYA_insufficient_quota";

export const useChatState = (textToSpeechRef: React.MutableRefObject<any>) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I'm Hey Trade, your financial assistant. Ask me something about investing, markets, or your portfolio.",
      timestamp: new Date()
    }
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [conversationContext, setConversationContext] = useState<ConversationContext>(
    createInitialContext()
  );

  // Reference to store the current speech instance
  const speechInstanceRef = { current: null };

  // Toggle functions for voice and speech
  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    toast({
      title: isVoiceActive ? "Voice input disabled" : "Voice input enabled",
      duration: 2000
    });
  };
  
  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    
    if (speechEnabled && textToSpeechRef.current) {
      textToSpeechRef.current.stop();
      setIsSpeaking(false);
    }
    
    toast({
      title: speechEnabled ? "Speech output disabled" : "Speech output enabled",
      duration: 2000
    });
  };

  // Function to handle sending voice message
  const handleSendVoiceMessage = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    // Check if the command is to cancel or stop
    if (
      transcript.toLowerCase().includes("stop") ||
      transcript.toLowerCase().includes("cancel") ||
      transcript.toLowerCase().includes("nevermind")
    ) {
      return;
    }
    
    await handleSendMessage(transcript);
  };

  // Main function to send message and get response
  const handleSendMessage = async (voiceMessage?: string) => {
    const messageText = voiceMessage || message;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    // Update conversation context based on the user message
    const updatedContext = updateContext(conversationContext, messageText);
    setConversationContext(updatedContext);
    
    // Generate system prompt based on updated context
    const systemPrompt = generateSystemPrompt(updatedContext);

    try {
      // Use the API key with issue marker to trigger fallback responses
      const response = await sendMessageToOpenAI(messageText, API_KEY_WITH_ISSUE, systemPrompt);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if speech is enabled
      if (speechEnabled && textToSpeechRef.current) {
        setIsSpeaking(true);
        speechInstanceRef.current = textToSpeechRef.current.speak(response, { rate: 1 });
        
        // Check when speech is done
        const checkSpeaking = setInterval(() => {
          if (speechInstanceRef.current && !speechInstanceRef.current.isPending()) {
            setIsSpeaking(false);
            clearInterval(checkSpeaking);
          }
        }, 200);
      }
    } catch (error: any) {
      console.error("Failed to get response:", error);
      
      // Even if there's an error, provide a fallback response
      const fallbackResponse = "I'm having trouble connecting to my knowledge base right now. Let me share what I know about financial topics. Feel free to ask about investing, stocks, ETFs, bonds, or portfolio management.";
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Still show an error toast to inform the user
      toast({
        title: "Connection Issue",
        description: "Using offline mode due to connection issues.",
        variant: "default",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
