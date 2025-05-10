
// Financial context manager with GDL-inspired structured knowledge representation

export interface ConversationContext {
  recentStocks: string[];
  recentTopics: string[];
  userPreferences: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentStyle?: 'passive' | 'active';
    preferredAssetClasses?: string[];
    timeHorizon?: 'short' | 'medium' | 'long';
  };
  // New GDL-inspired parameterized fields
  parameters: {
    portfolioComposition?: {
      stocks?: number;
      bonds?: number;
      cash?: number;
      alternatives?: number;
      derivatives?: number;
    };
    marketConditions?: {
      volatility?: 'low' | 'medium' | 'high';
      trend?: 'bullish' | 'bearish' | 'neutral';
      interestRateEnvironment?: 'rising' | 'falling' | 'stable';
    };
    userProfile?: {
      experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
      incomeLevel?: 'low' | 'medium' | 'high';
      age?: number;
      goals?: string[];
    };
    conversationFlow?: {
      currentModule?: string;
      previousModule?: string;
      depth?: number;
      constraints?: string[];
    };
  };
  // Knowledge blocks for structured reasoning
  knowledgeBlocks: {
    [key: string]: any;
  };
}

// Initialize a new conversation context with defaults
export const createInitialContext = (): ConversationContext => {
  return {
    recentStocks: [],
    recentTopics: [],
    userPreferences: {},
    parameters: {
      portfolioComposition: {
        stocks: 0,
        bonds: 0,
        cash: 100,
        alternatives: 0,
        derivatives: 0
      },
      marketConditions: {
        volatility: 'medium',
        trend: 'neutral',
        interestRateEnvironment: 'stable'
      },
      userProfile: {
        experienceLevel: 'beginner',
        goals: []
      },
      conversationFlow: {
        depth: 0,
        constraints: []
      }
    },
    knowledgeBlocks: {
      riskAssessment: {},
      sectorAnalysis: {},
      taxConsiderations: {},
      retirementPlanning: {}
    }
  };
};

// Enhanced context update with rule-based parameter extraction
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
  
  // Extract potential topics with expanded financial concepts
  const topics = [
    'ETF', 'dividend', 'growth', 'value', 'index', 
    'stock', 'bond', 'portfolio', 'retirement', 'risk',
    'derivative', 'option', 'future', 'hedge', 'leverage',
    'volatility', 'alpha', 'beta', 'yield', 'rebalance'
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
  
  // Update user preferences based on message content
  updateUserPreferences(messageLower, newContext);
  
  // Update portfolio composition parameters based on message content
  updatePortfolioParameters(messageLower, newContext);
  
  // Update market condition parameters
  updateMarketParameters(messageLower, newContext);
  
  // Update user profile parameters
  updateUserProfileParameters(messageLower, newContext);
  
  // Update conversation flow parameters
  newContext.parameters.conversationFlow.depth += 1;
  updateConversationFlow(messageLower, newContext);
  
  return newContext;
};

// Helper function to update user preferences
const updateUserPreferences = (message: string, context: ConversationContext) => {
  // Risk tolerance detection
  if (message.includes('conservative') || 
      message.includes('safe') || 
      message.includes('low risk')) {
    context.userPreferences.riskTolerance = 'low';
  } else if (message.includes('aggressive') || 
            message.includes('high risk') ||
            message.includes('risky')) {
    context.userPreferences.riskTolerance = 'high';
  } else if (message.includes('balanced') ||
            message.includes('moderate risk') ||
            message.includes('medium risk')) {
    context.userPreferences.riskTolerance = 'medium';
  }
  
  // Investment style detection
  if (message.includes('passive') || 
      message.includes('index fund') || 
      message.includes('etf') ||
      message.includes('hands off')) {
    context.userPreferences.investmentStyle = 'passive';
  } else if (message.includes('active') || 
            message.includes('stock picking') ||
            message.includes('trading') ||
            message.includes('day trading')) {
    context.userPreferences.investmentStyle = 'active';
  }
  
  // Time horizon detection
  if (message.includes('short term') || 
      message.includes('quick') || 
      message.includes('day trade') ||
      message.includes('this year')) {
    context.userPreferences.timeHorizon = 'short';
  } else if (message.includes('long term') || 
            message.includes('retirement') ||
            message.includes('years from now') ||
            message.includes('future')) {
    context.userPreferences.timeHorizon = 'long';
  } else if (message.includes('medium term') ||
            message.includes('few years')) {
    context.userPreferences.timeHorizon = 'medium';
  }
  
  // Asset class preferences
  const assetClasses = ['stocks', 'bonds', 'etfs', 'mutual funds', 'real estate', 'crypto', 'commodities'];
  const detectedAssets = assetClasses.filter(asset => message.includes(asset));
  
  if (detectedAssets.length > 0) {
    context.userPreferences.preferredAssetClasses = 
      Array.from(new Set([...(context.userPreferences.preferredAssetClasses || []), ...detectedAssets]));
  }
};

// Helper function to update portfolio composition parameters
const updatePortfolioParameters = (message: string, context: ConversationContext) => {
  // Simple ratio detection pattern - "XX% in stocks", "XX% bonds"
  const percentagePattern = /(\d+)%\s+(in\s+)?(stocks|bonds|cash|alternatives|derivatives)/gi;
  let match;
  
  while ((match = percentagePattern.exec(message)) !== null) {
    const percentage = parseInt(match[1], 10);
    const assetType = match[3].toLowerCase();
    
    // Update the corresponding asset type if percentage is valid
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      switch(assetType) {
        case 'stocks':
          context.parameters.portfolioComposition.stocks = percentage;
          break;
        case 'bonds':
          context.parameters.portfolioComposition.bonds = percentage;
          break;
        case 'cash':
          context.parameters.portfolioComposition.cash = percentage;
          break;
        case 'alternatives':
          context.parameters.portfolioComposition.alternatives = percentage;
          break;
        case 'derivatives':
          context.parameters.portfolioComposition.derivatives = percentage;
          break;
      }
    }
  }
  
  // Detect derivatives presence
  if (message.includes('option') || 
      message.includes('future') || 
      message.includes('swap') ||
      message.includes('derivative')) {
    if (context.parameters.portfolioComposition.derivatives === 0) {
      context.parameters.portfolioComposition.derivatives = 10; // Default allocation if mentioned
    }
  }
};

// Helper function to update market condition parameters
const updateMarketParameters = (message: string, context: ConversationContext) => {
  // Detect market volatility
  if (message.includes('high volatility') || 
      message.includes('unstable market') || 
      message.includes('market crash')) {
    context.parameters.marketConditions.volatility = 'high';
  } else if (message.includes('low volatility') || 
            message.includes('stable market') ||
            message.includes('calm market')) {
    context.parameters.marketConditions.volatility = 'low';
  }
  
  // Detect market trend
  if (message.includes('bull market') || 
      message.includes('market is up') || 
      message.includes('uptrend')) {
    context.parameters.marketConditions.trend = 'bullish';
  } else if (message.includes('bear market') || 
            message.includes('market is down') ||
            message.includes('downtrend')) {
    context.parameters.marketConditions.trend = 'bearish';
  }
  
  // Detect interest rate environment
  if (message.includes('rising rates') || 
      message.includes('interest rates up') || 
      message.includes('fed raising')) {
    context.parameters.marketConditions.interestRateEnvironment = 'rising';
  } else if (message.includes('falling rates') || 
            message.includes('interest rates down') ||
            message.includes('fed cutting')) {
    context.parameters.marketConditions.interestRateEnvironment = 'falling';
  }
};

// Helper function to update user profile parameters
const updateUserProfileParameters = (message: string, context: ConversationContext) => {
  // Detect experience level
  if (message.includes('new investor') || 
      message.includes('beginner') || 
      message.includes('just starting')) {
    context.parameters.userProfile.experienceLevel = 'beginner';
  } else if (message.includes('experienced investor') || 
            message.includes('trading for years') ||
            message.includes('professional')) {
    context.parameters.userProfile.experienceLevel = 'advanced';
  } else if (message.includes('some experience') ||
            message.includes('invested before')) {
    context.parameters.userProfile.experienceLevel = 'intermediate';
  }
  
  // Detect goals
  const goals = [
    'retirement', 'college', 'house', 'wealth building', 
    'income', 'capital appreciation', 'tax efficiency'
  ];
  
  goals.forEach(goal => {
    if (message.includes(goal) && 
        !context.parameters.userProfile.goals.includes(goal)) {
      context.parameters.userProfile.goals.push(goal);
    }
  });
};

// Helper function to update conversation flow parameters
const updateConversationFlow = (message: string, context: ConversationContext) => {
  // Detect conversation modules
  const modules = {
    'portfolio_analysis': ['portfolio', 'holdings', 'allocation', 'assets'],
    'stock_research': ['stock', 'ticker', 'company', 'shares'],
    'market_analysis': ['market', 'index', 'economy', 'sector'],
    'planning': ['plan', 'goal', 'target', 'objective'],
    'education': ['learn', 'explain', 'how to', 'what is']
  };
  
  // Previous module tracking
  if (context.parameters.conversationFlow.currentModule) {
    context.parameters.conversationFlow.previousModule = 
      context.parameters.conversationFlow.currentModule;
  }
  
  // Detect current module
  for (const [module, keywords] of Object.entries(modules)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      context.parameters.conversationFlow.currentModule = module;
      break;
    }
  }
  
  // Detect constraints
  if (message.includes('avoid') || message.includes('don\'t recommend')) {
    const constraintPatterns = [
      /avoid\s+([a-z\s]+)/i,
      /don'?t\s+recommend\s+([a-z\s]+)/i
    ];
    
    constraintPatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match && match[1]) {
        context.parameters.conversationFlow.constraints.push(match[1].trim());
      }
    });
  }
};

// Enhanced system prompt generation based on structured context
export const generateSystemPrompt = (context: ConversationContext): string => {
  let systemPrompt = "You are 'Hey Trade', a financial assistant helping a user manage their investment portfolio. ";
  systemPrompt += "Use a structured, rule-based approach to provide financial advice. ";
  
  // Add basic context
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
  
  if (context.userPreferences.timeHorizon) {
    systemPrompt += `User has a ${context.userPreferences.timeHorizon} investment time horizon. `;
  }
  
  if (context.userPreferences.preferredAssetClasses && context.userPreferences.preferredAssetClasses.length > 0) {
    systemPrompt += `User prefers these asset classes: ${context.userPreferences.preferredAssetClasses.join(', ')}. `;
  }
  
  // Add portfolio composition parameters if defined
  const portfolioComposition = context.parameters.portfolioComposition;
  if (portfolioComposition) {
    const nonZeroAllocations = Object.entries(portfolioComposition)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${value}% in ${key}`);
    
    if (nonZeroAllocations.length > 0) {
      systemPrompt += `User's portfolio consists of ${nonZeroAllocations.join(', ')}. `;
    }
    
    // Add derivatives flag for special handling
    if (portfolioComposition.derivatives > 0) {
      systemPrompt += `User has experience with derivatives. Consider this in your advice. `;
    }
  }
  
  // Add market condition context if defined
  const marketConditions = context.parameters.marketConditions;
  if (marketConditions) {
    if (marketConditions.volatility) {
      systemPrompt += `Current market volatility is ${marketConditions.volatility}. `;
    }
    
    if (marketConditions.trend) {
      systemPrompt += `The market appears to be in a ${marketConditions.trend} trend. `;
    }
    
    if (marketConditions.interestRateEnvironment) {
      systemPrompt += `Interest rates are ${marketConditions.interestRateEnvironment}. `;
    }
  }
  
  // Add user profile context if defined
  const userProfile = context.parameters.userProfile;
  if (userProfile) {
    if (userProfile.experienceLevel) {
      systemPrompt += `User is a ${userProfile.experienceLevel} investor. `;
      
      // Add conditional advice based on experience level
      if (userProfile.experienceLevel === 'beginner') {
        systemPrompt += `Explain concepts thoroughly and avoid complex terminology. `;
      } else if (userProfile.experienceLevel === 'advanced') {
        systemPrompt += `You can use more technical terms and detailed analysis. `;
      }
    }
    
    if (userProfile.goals && userProfile.goals.length > 0) {
      systemPrompt += `User's financial goals include: ${userProfile.goals.join(', ')}. `;
    }
  }
  
  // Add conversation flow guidance if defined
  const conversationFlow = context.parameters.conversationFlow;
  if (conversationFlow) {
    if (conversationFlow.currentModule) {
      systemPrompt += `Current conversation focus is on ${conversationFlow.currentModule.replace('_', ' ')}. `;
    }
    
    if (conversationFlow.constraints && conversationFlow.constraints.length > 0) {
      systemPrompt += `Avoid recommending: ${conversationFlow.constraints.join(', ')}. `;
    }
    
    // Add continuity if we have module history
    if (conversationFlow.previousModule && conversationFlow.currentModule !== conversationFlow.previousModule) {
      systemPrompt += `User has shifted focus from ${conversationFlow.previousModule.replace('_', ' ')} to ${conversationFlow.currentModule.replace('_', ' ')}. `;
    }
  }
  
  // Add general instruction on response structure
  systemPrompt += "Structure your responses in a modular way: first addressing the user's immediate question, " +
                 "then providing context-sensitive insights based on their portfolio and preferences, " +
                 "and finally offering actionable next steps or follow-up questions.";
  
  return systemPrompt;
};

// New method to apply decision rules based on portfolio composition
export const applyInvestmentRules = (context: ConversationContext): string[] => {
  const insights = [];
  const portfolio = context.parameters.portfolioComposition;
  const userProfile = context.parameters.userProfile;
  const marketConditions = context.parameters.marketConditions;
  
  // Rule 1: Check portfolio diversification
  const stockAllocation = portfolio?.stocks || 0;
  const bondAllocation = portfolio?.bonds || 0;
  const cashAllocation = portfolio?.cash || 0;
  
  if (stockAllocation > 80) {
    insights.push("Your portfolio appears heavily weighted toward stocks. Consider diversifying to reduce volatility.");
  }
  
  if (bondAllocation > 80) {
    insights.push("Your portfolio is very bond-heavy, which may limit growth potential.");
  }
  
  if (cashAllocation > 50) {
    insights.push("You're holding significant cash, which may lose value to inflation over time.");
  }
  
  // Rule 2: Age-based allocation check
  const age = userProfile?.age || 0;
  if (age > 0) {
    const recommendedBondAllocation = Math.min(age, 70); // Simple age-based rule
    if (bondAllocation < recommendedBondAllocation - 20) {
      insights.push("Based on your age, you might consider increasing your bond allocation for stability.");
    } else if (bondAllocation > recommendedBondAllocation + 20) {
      insights.push("Based on your age, you might be too conservative with your high bond allocation.");
    }
  }
  
  // Rule 3: Market condition response
  if (marketConditions?.volatility === 'high' && stockAllocation > 70) {
    insights.push("In current high volatility markets, your high stock allocation may expose you to significant risk.");
  }
  
  if (marketConditions?.trend === 'bearish' && cashAllocation < 20) {
    insights.push("In the current bearish trend, consider increasing your cash reserves for future opportunities.");
  }
  
  // Rule 4: Derivatives check
  if ((portfolio?.derivatives || 0) > 15) {
    insights.push("Your derivatives allocation exceeds 15%, which introduces significant complexity and risk.");
  }
  
  return insights;
};

// New method to generate modular response components
export const generateModularResponseComponents = (
  context: ConversationContext,
  query: string
): { [key: string]: string } => {
  const components: { [key: string]: string } = {};
  
  // Generate greeting based on conversation depth
  if (context.parameters.conversationFlow.depth <= 1) {
    components.greeting = "Hello! I'm Hey Trade, your financial assistant.";
  } else {
    components.greeting = "Thanks for the follow-up.";
  }
  
  // Generate personalization based on context
  if (context.userPreferences.riskTolerance || context.parameters.userProfile.experienceLevel) {
    const riskLevel = context.userPreferences.riskTolerance || 'balanced';
    const experience = context.parameters.userProfile.experienceLevel || 'thoughtful';
    components.personalization = `As a ${riskLevel} risk, ${experience} investor, here's what you should consider:`;
  } else {
    components.personalization = "Based on what you've shared, here's my analysis:";
  }
  
  // Generate disclaimer based on content
  if (query.toLowerCase().includes('recommend') || 
      query.toLowerCase().includes('should i buy') ||
      query.toLowerCase().includes('invest in')) {
    components.disclaimer = "Remember: This is educational information, not personalized investment advice.";
  } else {
    components.disclaimer = "Feel free to ask if you need more specific information on any financial topic.";
  }
  
  // Generate insights from rules engine
  const ruleBasedInsights = applyInvestmentRules(context);
  if (ruleBasedInsights.length > 0) {
    components.insights = "Based on your portfolio structure:\n• " + ruleBasedInsights.join('\n• ');
  }
  
  return components;
};

// Example usage in a response template:
// const responseComponents = generateModularResponseComponents(context, userMessage);
// const response = `${responseComponents.greeting}\n\n${responseComponents.personalization}\n\n[Main answer here]\n\n${responseComponents.insights || ""}\n\n${responseComponents.disclaimer}`;
