
// Text processing utilities for the emotion controller
import { AvatarEmotion } from '../types/avatarTypes';
import { EmotionController } from '../EmotionController';

/**
 * Process text content to determine appropriate emotional response
 */
export function processText(text: string, controller: EmotionController): EmotionController {
  // Simple sentiment analysis to determine emotion
  const lowerText = text.toLowerCase();
  
  // Check for keywords that might trigger emotions
  if (lowerText.includes("excellent") || 
      lowerText.includes("great") || 
      lowerText.includes("profit") ||
      lowerText.includes("up") && lowerText.includes("percent")) {
    return controller.setEmotion("happy", { duration: 3 });
  }
  
  if (lowerText.includes("recommend") || 
      lowerText.includes("suggest") || 
      lowerText.includes("advise")) {
    return controller.setEmotion("confident", { duration: 3 });
  }
  
  if (lowerText.includes("analyze") || 
      lowerText.includes("consider") || 
      lowerText.includes("think") ||
      lowerText.includes("calculate")) {
    return controller.setEmotion("thinking", { duration: 3 });
  }

  // New emotion triggers for business context
  if (lowerText.includes("market crash") ||
      lowerText.includes("recession") ||
      lowerText.includes("bear market") ||
      lowerText.includes("downtrend")) {
    return controller.setEmotion("concerned", { duration: 3 });
  }

  if (lowerText.includes("breaking news") ||
      lowerText.includes("unexpected") ||
      lowerText.includes("announcement") ||
      lowerText.includes("sudden")) {
    return controller.setEmotion("surprised", { duration: 2.5 });
  }
  
  // Default - return to neutral
  return controller;
}

/**
 * Handle business-themed reactions
 */
export function handleBusinessEvent(
  event: string, 
  impact: 'positive' | 'neutral' | 'negative', 
  controller: EmotionController
): EmotionController {
  switch(impact) {
    case 'positive':
      return controller.setEmotion("happy", { duration: 2, intensity: 0.8 });
    case 'negative':
      return controller.setEmotion("concerned", { duration: 2, intensity: 0.7 });
    default:
      return controller.setEmotion("neutral", { duration: 1, intensity: 0.5 });
  }
}
