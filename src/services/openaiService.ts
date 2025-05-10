
interface OpenAITextResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIErrorResponse {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string;
  };
}

// Fallback message when API is unavailable
const FALLBACK_MESSAGES = [
  "I'm sorry, but I'm unable to connect to my knowledge base right now. Let me provide some general information based on what I already know.",
  "It seems my connection to the knowledge service is limited. Here's what I can tell you based on my existing knowledge.",
  "I'm currently experiencing connection issues with my AI service. Let me share what I know without consulting external sources.",
  "My external AI service is currently unavailable, but I can still help with general information.",
  "Due to API limitations, I'll answer based on my core knowledge rather than making an external query.",
];

export const sendMessageToOpenAI = async (
  message: string, 
  apiKey: string,
  systemPrompt?: string
): Promise<string> => {
  // If the API key has quota issues, use the fallback messages
  if (apiKey && apiKey.includes("insufficient_quota")) {
    console.log("Using fallback message due to previous quota issues");
    return getFallbackResponse(message);
  }

  try {
    const defaultPrompt = "You are 'Hey Trade', a friendly AI assistant with visual presence. You have a virtual face that animates as you speak. You specialize in financial advice but can discuss any topic. Keep your responses concise and engaging as if having a face-to-face conversation. Use simple language and avoid very long explanations.";
    
    console.log("Sending message to OpenAI:", { message, systemPrompt: systemPrompt || defaultPrompt });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: "system",
          content: systemPrompt || defaultPrompt
        }, {
          role: "user",
          content: message
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as OpenAIErrorResponse;
      console.error("OpenAI API error response:", errorData);
      
      // Mark the API key as having quota issues
      if (errorData.error?.type === "insufficient_quota" || 
          errorData.error?.code === "insufficient_quota") {
        console.error("OpenAI API quota exceeded. Using fallback.");
        return getFallbackResponse(message);
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json() as OpenAITextResponse;
    console.log("OpenAI API response:", data);
    
    // Extract the text response from the structured API response
    if (data.choices && data.choices.length > 0 && 
        data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }
    
    console.error("Unexpected API response structure:", data);
    return "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return getFallbackResponse(message);
  }
};

/**
 * Provides a fallback response when the API is unavailable
 */
const getFallbackResponse = (message: string): string => {
  const intro = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
  
  // Generate simple responses for common financial topics
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("etf")) {
    return `${intro}\n\nETFs (Exchange-Traded Funds) are investment funds traded on stock exchanges. They hold assets like stocks, bonds, or commodities and typically track an index. ETFs offer diversification, lower costs than mutual funds, and the flexibility to trade throughout the day like stocks.`;
  } 
  else if (lowerMessage.includes("stock") || lowerMessage.includes("invest")) {
    return `${intro}\n\nStocks represent ownership shares in a company. When you buy a stock, you're purchasing a small piece of that company and may benefit from its growth and profits through price appreciation and dividends. Stocks vary in risk level, from stable blue-chip companies to volatile growth stocks.`;
  }
  else if (lowerMessage.includes("bond")) {
    return `${intro}\n\nBonds are debt securities where you lend money to an entity (like a government or corporation) for a defined period at a fixed interest rate. They're generally considered lower risk than stocks and provide regular income payments before returning the principal at maturity.`;
  }
  else if (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin")) {
    return `${intro}\n\nCryptocurrencies are digital or virtual currencies that use cryptography for security. Bitcoin was the first cryptocurrency, but there are now thousands of alternatives. They're known for price volatility and operate on decentralized networks based on blockchain technology.`;
  }
  else if (lowerMessage.includes("portfolio") || lowerMessage.includes("diversif")) {
    return `${intro}\n\nA well-diversified investment portfolio typically includes a mix of asset classes (stocks, bonds, cash, etc.) that align with your financial goals, time horizon, and risk tolerance. Diversification helps manage risk by spreading investments across different securities and sectors.`;
  }
  
  return `${intro}\n\nI specialize in providing financial advice and information about investing, markets, portfolio management, and related topics. Feel free to ask specific questions about investment strategies, financial planning, or market insights.`;
};
