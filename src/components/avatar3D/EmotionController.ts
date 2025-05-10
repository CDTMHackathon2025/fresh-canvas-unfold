
// Controller for managing avatar emotions and expressions

import { AvatarEmotion, AvatarStatus, EmotionConfig, ExpressionBlendshape } from './types/avatarTypes';
import { generateBlendshapes } from './utils/expressionGenerator';
import { processText, handleBusinessEvent } from './utils/textProcessor';

// Use "export type" for re-exporting types when isolatedModules is enabled
export type { AvatarEmotion, AvatarStatus } from './types/avatarTypes';

export class EmotionController {
  private currentEmotion: AvatarEmotion = "neutral";
  private currentStatus: AvatarStatus = "idle";
  private expressionBlendshapes: ExpressionBlendshape[] = [];
  private emotionIntensity: number = 0;
  private microExpressionTimer: any = null;
  private idleExpressionInterval: any = null;
  
  constructor() {
    // Initialize with default expressions
    this.setEmotion("neutral");
    
    // Start random micro-expressions during idle
    this.startIdleMicroExpressions();
  }
  
  public setEmotion(emotion: AvatarEmotion, config: Partial<EmotionConfig> = {}) {
    const defaultConfig: EmotionConfig = {
      intensity: 1.0,
      duration: 0, // 0 means hold until changed
      blendDuration: 0.3, // seconds to blend
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    this.currentEmotion = emotion;
    this.emotionIntensity = finalConfig.intensity;
    
    // Generate appropriate blendshapes based on the emotion
    this.expressionBlendshapes = generateBlendshapes(emotion, finalConfig.intensity);
    
    // If it's a temporary emotion with duration, schedule reset
    if (finalConfig.duration > 0) {
      if (this.microExpressionTimer) {
        clearTimeout(this.microExpressionTimer);
      }
      
      this.microExpressionTimer = setTimeout(() => {
        this.setEmotion("neutral", { blendDuration: finalConfig.blendDuration });
        this.microExpressionTimer = null;
      }, finalConfig.duration * 1000);
    }
    
    return this;
  }
  
  public setStatus(status: AvatarStatus) {
    this.currentStatus = status;
    
    // Manage idle expressions based on status
    if (status !== "idle") {
      this.stopIdleMicroExpressions();
    } else if (!this.idleExpressionInterval) {
      this.startIdleMicroExpressions();
    }
    
    return this;
  }
  
  public getEmotion(): AvatarEmotion {
    return this.currentEmotion;
  }
  
  public getStatus(): AvatarStatus {
    return this.currentStatus;
  }
  
  public getBlendshapes(): ExpressionBlendshape[] {
    return this.expressionBlendshapes;
  }
  
  // Start random micro-expressions during idle time
  private startIdleMicroExpressions() {
    if (this.idleExpressionInterval) return;
    
    const triggerRandomExpression = () => {
      // Only trigger if we're in idle status
      if (this.currentStatus !== "idle") return;
      
      // Choose a random micro-expression
      const microExpressions: AvatarEmotion[] = ["neutral", "confident", "thinking", "happy"];
      const weights = [0.7, 0.1, 0.1, 0.1]; // Higher chance of neutral
      
      // Weighted random selection
      let random = Math.random();
      let expressionIndex = 0;
      let cumulativeWeight = 0;
      
      for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          expressionIndex = i;
          break;
        }
      }
      
      const randomExpression = microExpressions[expressionIndex];
      
      // Skip if it's the same as current
      if (randomExpression === this.currentEmotion) return;
      
      // Apply micro-expression briefly
      this.setEmotion(randomExpression, {
        intensity: 0.3 + Math.random() * 0.4,
        duration: 0.5 + Math.random() * 1.5, // Short random duration
        blendDuration: 0.2
      });
    };
    
    // Trigger micro-expressions randomly
    this.idleExpressionInterval = setInterval(() => {
      // Only 10% chance to trigger
      if (Math.random() < 0.1) {
        triggerRandomExpression();
      }
    }, 2000); // Check every 2 seconds
  }
  
  private stopIdleMicroExpressions() {
    if (this.idleExpressionInterval) {
      clearInterval(this.idleExpressionInterval);
      this.idleExpressionInterval = null;
    }
  }
  
  // For handling lip sync from audio
  public updateLipSync(audioLevel: number) {
    // Find and update mouth blendshape
    const mouthBlendshape = this.expressionBlendshapes.find(b => 
      b.name.includes("mouth"));
      
    if (mouthBlendshape) {
      // Scale audio level to appropriate mouth openness
      // This creates a more dynamic mouth movement based on audio volume
      const mouthOpenness = Math.min(audioLevel * 2, 1.0);
      mouthBlendshape.value = mouthOpenness;
    } else {
      this.expressionBlendshapes.push({ 
        name: "mouth_open", 
        value: Math.min(audioLevel * 2, 1.0) 
      });
    }
  }
  
  // Process text content to determine appropriate emotional response
  public processText(text: string) {
    return processText(text, this);
  }

  // Method to handle business-themed reactions
  public handleBusinessEvent(event: string, impact: 'positive' | 'neutral' | 'negative') {
    return handleBusinessEvent(event, impact, this);
  }
}

export const createEmotionController = () => new EmotionController();
