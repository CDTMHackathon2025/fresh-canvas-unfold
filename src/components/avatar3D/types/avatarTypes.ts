
// Shared type definitions for the avatar system

export type AvatarEmotion = "neutral" | "confident" | "thinking" | "happy" | "surprised" | "concerned";
export type AvatarStatus = "idle" | "listening" | "speaking";

export interface EmotionConfig {
  intensity: number;
  duration: number;
  blendDuration: number;
}

export interface ExpressionBlendshape {
  name: string;
  value: number;
}
