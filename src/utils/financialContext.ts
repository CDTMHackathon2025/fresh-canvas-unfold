
// Financial context manager for ChatGPT integration

export interface ConversationContext {
  recentStocks: string[];
  recentTopics: string[];
  userPreferences: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentStyle?: 'passive' | 'active';
    preferredAssetClasses?: string[];
    timeHorizon?: 'short' | 'medium' | 'long';
  };
}

// Initialize a new conversation context
export const createInitialContext = (): ConversationContext => {
  return {
    recentStocks: [],
    recentTopics: [],
    userPreferences: {}
  };
};

// Update context based on a message
export const updateContext = (
  context: ConversationContext, 
  message: string
): ConversationContext => {
  const newContext = { ...context };
  
  // Extract potential stock symbols (simple pattern matching)
  const stockPattern = /\b[A-Z]{1,5}\b/g;
  const potentialStocks = message.match(stockPattern) || [];
  
  if (potentialStocks.length > 0) {
    // Add unique stocks to the recent stocks list (up to 5)
    const uniqueStocks = potentialStocks.filter(stock => 
      !newContext.recentStocks.includes(stock));
    
    newContext.recentStocks = [
      ...uniqueStocks, 
      ...newContext.recentStocks
    ].slice(0, 5);
  }
  
  // Extract potential topics (simple keyword matching)
  const topics = [
    'ETF', 'dividend', 'growth', 'value', 'index', 
    'stock', 'bond', 'portfolio', 'retirement', 'risk'
  ];
  
  const messageLower = message.toLowerCase();
  const detectedTopics = topics.filter(topic => 
    messageLower.includes(topic.toLowerCase()));
  
  if (detectedTopics.length > 0) {
    // Add unique topics to the recent topics list (up to 5)
    const uniqueTopics = detectedTopics.filter(topic => 
      !newContext.recentTopics.includes(topic));
    
    newContext.recentTopics = [
      ...uniqueTopics, 
      ...newContext.recentTopics
    ].slice(0, 5);
  }
  
  // Detect risk tolerance
  if (messageLower.includes('conservative') || 
      messageLower.includes('safe') || 
      messageLower.includes('low risk')) {
    newContext.userPreferences.riskTolerance = 'low';
  } else if (messageLower.includes('aggressive') || 
            messageLower.includes('high risk')) {
    newContext.userPreferences.riskTolerance = 'high';
  }
  
  return newContext;
};

// Generate system prompt based on context
export const generateSystemPrompt = (context: ConversationContext): string => {
  let systemPrompt = "You are 'Hey Trade', a financial assistant helping a user manage their long-term investment portfolio. ";
  systemPrompt += "Your tone is financially literate but beginner-friendly. ";
  systemPrompt += "Keep responses concise and actionable. ";
  
  // Add context-specific instructions
  if (context.recentStocks.length > 0) {
    systemPrompt += `User has recently asked about these stocks: ${context.recentStocks.join(', ')}. `;
  }
  
  if (context.recentTopics.length > 0) {
    systemPrompt += `User has shown interest in: ${context.recentTopics.join(', ')}. `;
  }
  
  // Add user preferences if available
  if (context.userPreferences.riskTolerance) {
    systemPrompt += `User has a ${context.userPreferences.riskTolerance} risk tolerance. `;
  }
  
  if (context.userPreferences.investmentStyle) {
    systemPrompt += `User prefers a ${context.userPreferences.investmentStyle} investment style. `;
  }
  
  return systemPrompt;
};
