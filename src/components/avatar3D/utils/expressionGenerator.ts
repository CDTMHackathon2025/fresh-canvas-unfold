
// Utility for generating facial expressions and blendshapes
import { AvatarEmotion, ExpressionBlendshape } from '../types/avatarTypes';

/**
 * Generates blendshape values based on emotion and intensity
 */
export function generateBlendshapes(emotion: AvatarEmotion, intensity: number): ExpressionBlendshape[] {
  switch(emotion) {
    case "confident":
      return [
        { name: "eyebrows_up", value: 0.3 * intensity },
        { name: "smile", value: 0.6 * intensity },
        { name: "eyes_wide", value: 0.2 * intensity },
        { name: "head_up", value: 0.4 * intensity },
        { name: "mouth_smile", value: 0.7 * intensity },
        { name: "mouth_width", value: 0.6 * intensity }, // Wider smile
        { name: "cheeks_up", value: 0.5 * intensity }, // Business-like confidence
        { name: "tie_adjustment", value: 0.2 * intensity }, // Subtle tie adjustment
      ];
    case "thinking":
      return [
        { name: "eyebrows_down", value: 0.7 * intensity },
        { name: "eyebrows_inner_up", value: 0.5 * intensity },
        { name: "head_tilt", value: 0.6 * intensity },
        { name: "mouth_narrow", value: 0.4 * intensity },
        { name: "eyes_squint", value: 0.3 * intensity },
        { name: "mouth_pout", value: 0.2 * intensity }, // Thoughtful pout
      ];
    case "happy":
      return [
        { name: "smile_wide", value: 0.8 * intensity },
        { name: "eyes_squint", value: 0.3 * intensity },
        { name: "cheeks_up", value: 0.7 * intensity },
        { name: "nose_wrinkle", value: 0.2 * intensity },
        { name: "eyebrows_up", value: 0.4 * intensity },
        { name: "mouth_open", value: 0.2 * intensity }, // Slightly open mouth for happy expression
        { name: "eyes_sparkle", value: 0.6 * intensity }, // Sparkling eyes
      ];
    case "surprised":
      return [
        { name: "eyebrows_up", value: 0.9 * intensity },
        { name: "eyes_wide", value: 0.8 * intensity },
        { name: "mouth_open", value: 0.7 * intensity },
        { name: "head_back", value: 0.3 * intensity },
      ];
    case "concerned":
      return [
        { name: "eyebrows_inner_up", value: 0.7 * intensity },
        { name: "mouth_corners_down", value: 0.5 * intensity },
        { name: "head_forward", value: 0.3 * intensity },
        { name: "eyes_squint", value: 0.4 * intensity },
      ];
    default: // neutral
      return [
        { name: "reset", value: 1.0 },
        { name: "blink_rate", value: 0.2 + Math.random() * 0.1 }, // Random blink rate
        { name: "micro_movement", value: 0.2 * intensity }, // Subtle movements
        { name: "mouth_slight_smile", value: 0.3 * intensity }, // Default friendly expression
        { name: "business_posture", value: 1.0 }, // Professional posture
      ];
  }
}
