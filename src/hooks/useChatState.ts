import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { sendMessageToOpenAI } from "@/services/openaiService";
import { 
  createInitialContext, 
  updateContext, 
  generateSystemPrompt,
  generateModularResponseComponents,
  ConversationContext 
} from "@/utils/financialContext";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Replace the hardcoded API key with an imported value
// The API key should be properly managed by the environment
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

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
  // New state to track the current response generation mode
  const [debugMode, setDebugMode] = useState(false);

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

  // Toggle debug mode for viewing internal context
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast({
      title: debugMode ? "Debug mode disabled" : "Debug mode enabled",
      description: debugMode ? "Normal responses resumed" : "Showing context in responses",
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
    
    // Process debugging commands if in debug mode
    if (debugMode && messageText.startsWith("/debug")) {
      handleDebugCommand(messageText);
      setIsLoading(false);
      return;
    }
    
    // Update conversation context based on the user message
    const updatedContext = updateContext(conversationContext, messageText);
    setConversationContext(updatedContext);
    
    // Generate system prompt based on updated context
    const systemPrompt = generateSystemPrompt(updatedContext);
    
    // Generate modular response components
    const responseComponents = generateModularResponseComponents(updatedContext, messageText);

    try {
      // Check if API key is available
      if (!API_KEY) {
        throw new Error("OpenAI API key is not configured");
      }
      
      const response = await sendMessageToOpenAI(messageText, API_KEY, systemPrompt);
      
      // If in debug mode, append context information
      let finalResponse = response;
      if (debugMode) {
        finalResponse = `${response}\n\n---\n**Context Debug (Developer Mode)**\n\`\`\`json\n${JSON.stringify({
          recentStocks: updatedContext.recentStocks,
          recentTopics: updatedContext.recentTopics,
          userPreferences: updatedContext.userPreferences,
          portfolioParams: updatedContext.parameters.portfolioComposition,
          marketParams: updatedContext.parameters.marketConditions,
          conversationFlow: updatedContext.parameters.conversationFlow
        }, null, 2)}\n\`\`\``;
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: finalResponse,
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
      
      // Show more specific error for missing API key
      let errorMessage = "I'm having trouble connecting to my knowledge base right now.";
      if (error.message === "OpenAI API key is not configured") {
        errorMessage = "OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.";
        toast({
          title: "API Key Missing",
          description: "OpenAI API key is not configured.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug command handler - fixed to handle type conversions properly
  const handleDebugCommand = (command: string) => {
    const parts = command.split(" ");
    
    if (parts[1] === "context") {
      // Show current context debug info
      const debugMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `**Current Context (Developer Mode)**\n\`\`\`json\n${JSON.stringify(conversationContext, null, 2)}\n\`\`\``,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, debugMessage]);
    }
    else if (parts[1] === "reset") {
      // Reset context to initial state
      setConversationContext(createInitialContext());
      
      const debugMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "**Context has been reset to initial state (Developer Mode)**",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, debugMessage]);
    }
    else if (parts[1] === "set" && parts.length >= 4) {
      // Set a specific context parameter
      try {
        const path = parts[2].split('.');
        const value = parts.slice(3).join(' ');
        
        let target: any = conversationContext;
        for (let i = 0; i < path.length - 1; i++) {
          if (!target[path[i]]) {
            target[path[i]] = {};
          }
          target = target[path[i]];
        }
        
        // Try to parse as number or boolean, otherwise keep as string
        let parsedValue: string | number | boolean = value;
        
        // Convert the value to the appropriate type based on target type
        const lastKey = path[path.length - 1];
        const currentValue = target[lastKey];
        
        // Check the type of the current value and convert accordingly
        if (typeof currentValue === 'number') {
          // Convert to number if current value is a number
          parsedValue = Number(value) || 0;
        } else if (typeof currentValue === 'boolean') {
          // Convert to boolean if current value is a boolean
          parsedValue = value === 'true';
        }
        // Otherwise keep as string (default)
        
        target[lastKey] = parsedValue;
        setConversationContext({...conversationContext});
        
        const debugMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `**Context parameter ${parts[2]} updated to: ${value} (Developer Mode)**`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, debugMessage]);
      } catch (error: any) {
        const debugMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `**Error setting context parameter: ${error.message} (Developer Mode)**`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, debugMessage]);
      }
    }
    else {
      // Unknown debug command
      const debugMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "**Unknown debug command. Available commands: /debug context, /debug reset, /debug set [path] [value] (Developer Mode)**",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, debugMessage]);
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
    debugMode,
    toggleVoice,
    toggleSpeech,
    toggleDebugMode,
    handleSendVoiceMessage,
    handleSendMessage
  };
};
