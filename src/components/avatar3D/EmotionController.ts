
// Controller for managing avatar emotions and expressions

export type AvatarEmotion = "neutral" | "confident" | "thinking" | "happy";
export type AvatarStatus = "idle" | "listening" | "speaking";

interface EmotionConfig {
  intensity: number;
  duration: number;
  blendDuration: number;
}

interface ExpressionBlendshape {
  name: string;
  value: number;
}

export class EmotionController {
  private currentEmotion: AvatarEmotion = "neutral";
  private currentStatus: AvatarStatus = "idle";
  private expressionBlendshapes: ExpressionBlendshape[] = [];
  private emotionIntensity: number = 0;
  
  constructor() {
    // Initialize with default expressions
    this.setEmotion("neutral");
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
    
    // In a real implementation, this would generate appropriate blendshapes
    // based on the emotion type
    this.generateBlendshapes(emotion, finalConfig.intensity);
    
    return this;
  }
  
  public setStatus(status: AvatarStatus) {
    this.currentStatus = status;
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
  
  private generateBlendshapes(emotion: AvatarEmotion, intensity: number) {
    // This would be replaced with actual blendshape generation logic
    // based on the specific avatar model being used
    
    // Placeholder implementation
    switch(emotion) {
      case "confident":
        this.expressionBlendshapes = [
          { name: "eyebrows_up", value: 0.3 * intensity },
          { name: "smile", value: 0.6 * intensity },
        ];
        break;
      case "thinking":
        this.expressionBlendshapes = [
          { name: "eyebrows_down", value: 0.7 * intensity },
          { name: "mouth_narrow", value: 0.4 * intensity },
        ];
        break;
      case "happy":
        this.expressionBlendshapes = [
          { name: "smile_wide", value: 0.8 * intensity },
          { name: "eyes_squint", value: 0.3 * intensity },
        ];
        break;
      default: // neutral
        this.expressionBlendshapes = [
          { name: "reset", value: 1.0 },
        ];
    }
  }
  
  // For handling lip sync from audio
  public updateLipSync(audioLevel: number) {
    // This method would update mouth-related blendshapes
    // based on incoming audio levels for speech animation
    
    // Placeholder for actual implementation
    const mouthOpenness = Math.min(audioLevel * 2, 1.0);
    
    // Find and update mouth blendshape
    const mouthBlendshape = this.expressionBlendshapes.find(b => 
      b.name.includes("mouth") || b.name.includes("smile"));
      
    if (mouthBlendshape) {
      mouthBlendshape.value = mouthOpenness;
    } else {
      this.expressionBlendshapes.push({ 
        name: "mouth_open", 
        value: mouthOpenness 
      });
    }
  }
}

export const createEmotionController = () => new EmotionController();
