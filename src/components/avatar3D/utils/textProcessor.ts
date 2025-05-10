
// Text processing utilities for the emotion controller
import { AvatarEmotion } from '../types/avatarTypes';
import { EmotionController } from '../EmotionController';

/**
 * Process text content to determine appropriate emotional response
 * Enhanced with financial-specific triggers and GDL-inspired rule structure
 */
export function processText(text: string, controller: EmotionController): EmotionController {
  // Simple sentiment analysis to determine emotion
  const lowerText = text.toLowerCase();
  
  // Define emotion rules as a structured ruleset (GDL-inspired)
  const emotionRules = [
    // Happy emotion rules
    {
      condition: () => 
        lowerText.includes("excellent") || 
        lowerText.includes("great") || 
        lowerText.includes("profit") ||
        (lowerText.includes("up") && lowerText.includes("percent")) ||
        lowerText.includes("growth") ||
        lowerText.includes("gain") ||
        lowerText.includes("success"),
      action: () => controller.setEmotion("happy", { duration: 3 })
    },
    
    // Confident emotion rules
    {
      condition: () => 
        lowerText.includes("recommend") || 
        lowerText.includes("suggest") || 
        lowerText.includes("advise") ||
        lowerText.includes("strategy") ||
        lowerText.includes("plan") ||
        lowerText.includes("confident"),
      action: () => controller.setEmotion("confident", { duration: 3 })
    },
    
    // Thinking emotion rules
    {
      condition: () => 
        lowerText.includes("analyze") || 
        lowerText.includes("consider") || 
        lowerText.includes("think") ||
        lowerText.includes("calculate") ||
        lowerText.includes("evaluate") ||
        lowerText.includes("complex"),
      action: () => controller.setEmotion("thinking", { duration: 3 })
    },

    // Concerned emotion rules
    {
      condition: () => 
        lowerText.includes("market crash") ||
        lowerText.includes("recession") ||
        lowerText.includes("bear market") ||
        lowerText.includes("downtrend") ||
        lowerText.includes("loss") ||
        lowerText.includes("risk") ||
        lowerText.includes("warning") ||
        lowerText.includes("caution"),
      action: () => controller.setEmotion("concerned", { duration: 3 })
    },

    // Surprised emotion rules
    {
      condition: () => 
        lowerText.includes("breaking news") ||
        lowerText.includes("unexpected") ||
        lowerText.includes("announcement") ||
        lowerText.includes("sudden") ||
        lowerText.includes("surprising") ||
        lowerText.includes("volatility") ||
        lowerText.includes("dramatic"),
      action: () => controller.setEmotion("surprised", { duration: 2.5 })
    }
  ];
  
  // Apply the first matching rule (priority order)
  for (const rule of emotionRules) {
    if (rule.condition()) {
      return rule.action();
    }
  }
  
  // Pattern matching for numeric expressions (percentage changes)
  const percentagePattern = /([+-]?\d+(?:\.\d+)?)%/g;
  const percentMatches = [...text.matchAll(percentagePattern)];
  
  if (percentMatches.length > 0) {
    // Extract the first percentage value
    const percentValue = parseFloat(percentMatches[0][1]);
    
    // Determine emotion based on percentage value
    if (percentValue >= 5) {
      return controller.setEmotion("happy", { duration: 2.5, intensity: Math.min(percentValue / 10, 1) });
    } else if (percentValue <= -5) {
      return controller.setEmotion("concerned", { duration: 2.5, intensity: Math.min(Math.abs(percentValue) / 10, 1) });
    } else if (percentValue > 0) {
      return controller.setEmotion("confident", { duration: 2 });
    } else if (percentValue < 0) {
      return controller.setEmotion("thinking", { duration: 2 });
    }
  }
  
  // Default - return to neutral
  return controller;
}

/**
 * Handle business-themed reactions with enhanced parameterization
 */
export function handleBusinessEvent(
  event: string, 
  impact: 'positive' | 'neutral' | 'negative',
  controller: EmotionController,
  params?: {
    magnitude?: number;  // 0-1 scale of impact strength
    duration?: number;   // seconds to hold expression
    keywords?: string[]; // specific trigger words to consider
  }
): EmotionController {
  // Default parameters
  const magnitude = params?.magnitude || 0.7;
  const duration = params?.duration || 2;
  
  // Apply emotion based on impact type and magnitude
  switch(impact) {
    case 'positive':
      // Choose between happy and confident based on magnitude
      if (magnitude > 0.7) {
        return controller.setEmotion("happy", { duration, intensity: magnitude });
      } else {
        return controller.setEmotion("confident", { duration, intensity: magnitude });
      }
      
    case 'negative':
      // Choose between concerned and surprised based on magnitude
      if (magnitude > 0.7) {
        return controller.setEmotion("concerned", { duration, intensity: magnitude });
      } else {
        return controller.setEmotion("thinking", { duration, intensity: magnitude });
      }
      
    default:
      // For neutral, subtle thinking expression
      return controller.setEmotion("neutral", { duration: Math.max(1, duration / 2), intensity: 0.5 });
  }
}

/**
 * New: Process financial terms to determine appropriate emotional response
 */
export function processFinancialTerms(text: string, controller: EmotionController): EmotionController {
  // Define financial term categories
  const financialTerms = {
    positive: [
      'bull market', 'growth', 'profit', 'dividend', 'yield', 'return', 
      'appreciation', 'uptrend', 'rally', 'outperform'
    ],
    negative: [
      'bear market', 'recession', 'loss', 'default', 'bankruptcy', 'downtrend',
      'crash', 'correction', 'underperform', 'debt'
    ],
    complex: [
      'derivative', 'option', 'future', 'swap', 'hedge', 'leverage',
      'volatility', 'arbitrage', 'correlation', 'diversification'
    ],
    neutral: [
      'market', 'stock', 'bond', 'portfolio', 'asset', 'investment',
      'equity', 'security', 'fund', 'etf'
    ]
  };
  
  // Count term occurrences in each category
  const lowerText = text.toLowerCase();
  const counts = {
    positive: financialTerms.positive.filter(term => lowerText.includes(term)).length,
    negative: financialTerms.negative.filter(term => lowerText.includes(term)).length,
    complex: financialTerms.complex.filter(term => lowerText.includes(term)).length,
    neutral: financialTerms.neutral.filter(term => lowerText.includes(term)).length
  };
  
  // Determine dominant category
  const dominant = Object.entries(counts).reduce(
    (max, [category, count]) => count > max.count ? { category, count } : max,
    { category: 'neutral', count: 0 }
  );
  
  // Set emotion based on dominant category
  if (dominant.count > 0) {
    switch (dominant.category) {
      case 'positive':
        return controller.setEmotion("happy", { duration: 2 });
      case 'negative':
        return controller.setEmotion("concerned", { duration: 2 });
      case 'complex':
        return controller.setEmotion("thinking", { duration: 2.5 });
      default:
        return controller.setEmotion("neutral", { duration: 1 });
    }
  }
  
  // Default - no change
  return controller;
}

/**
 * Analyze speaker tone from text cues to adjust emotion
 */
export function analyzeSpeakerTone(text: string): {
  confidence: number;
  emotion: 'happy' | 'confident' | 'thinking' | 'surprised' | 'concerned' | 'neutral';
} {
  const lowerText = text.toLowerCase();
  
  // Text markers for different emotional tones
  const toneMarkers = {
    happy: ['!', 'great', 'excellent', 'amazing', 'fantastic', 'awesome', 'wow'],
    confident: ['definitely', 'absolutely', 'certainly', 'without doubt', 'confident'],
    concerned: ['worried', 'concerned', 'unfortunately', 'problem', 'issue', 'careful'],
    surprised: ['wow', 'oh', 'unexpected', 'surprised', 'shocking', 'unbelievable'],
    thinking: ['perhaps', 'maybe', 'consider', 'might', 'could', 'possibly']
  };
  
  // Count markers for each tone
  const counts = {
    happy: toneMarkers.happy.filter(marker => lowerText.includes(marker)).length,
    confident: toneMarkers.confident.filter(marker => lowerText.includes(marker)).length,
    concerned: toneMarkers.concerned.filter(marker => lowerText.includes(marker)).length,
    surprised: toneMarkers.surprised.filter(marker => lowerText.includes(marker)).length,
    thinking: toneMarkers.thinking.filter(marker => lowerText.includes(marker)).length,
    neutral: 0 // Default
  };
  
  // Exclamation point adds to happy or surprised
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    if (counts.happy > counts.surprised) {
      counts.happy += exclamationCount;
    } else {
      counts.surprised += exclamationCount;
    }
  }
  
  // Question marks add to thinking
  const questionCount = (text.match(/\?/g) || []).length;
  counts.thinking += questionCount;
  
  // Find the dominant tone
  const dominant = Object.entries(counts).reduce(
    (max, [tone, count]) => count > max.count ? { tone, count } : max,
    { tone: 'neutral', count: 0 }
  );
  
  // Calculate confidence based on count and text length
  // Higher count and shorter text = higher confidence
  const totalMarkers = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const wordCount = text.split(/\s+/).length;
  const confidence = Math.min(totalMarkers / Math.max(wordCount / 10, 1), 1);
  
  return {
    confidence,
    emotion: dominant.tone as any // Type cast to emotion type
  };
}
