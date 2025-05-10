
// Utility for loading and preparing 3D models for the avatar
import { Object3D } from 'three';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Types for loaded models
export interface LoadedModel {
  scene: Object3D;
  animations: any[];
  nodes: Record<string, Object3D>;
  materials: Record<string, any>;
}

// Model loading status
export type ModelLoadingStatus = 'idle' | 'loading' | 'success' | 'error';

// Helper for preloading models
export const preloadModel = async (url: string): Promise<LoadedModel | null> => {
  // This is a placeholder that would use THREE.GLTFLoader in a real implementation
  console.log(`Would preload model from ${url}`);
  
  // For now, return null as we don't have actual loading logic yet
  return null;
};

// Map animation names to their indices in the loaded model
export const mapAnimations = (model: LoadedModel): Record<string, number> => {
  const animationMap: Record<string, number> = {};
  
  if (!model?.animations) return animationMap;
  
  model.animations.forEach((clip, index) => {
    animationMap[clip.name] = index;
  });
  
  return animationMap;
};

// Create animation mapping for common expressions
export const createExpressionMap = (model: LoadedModel): Record<string, string> => {
  // This would map emotionController expressions to actual model blendshapes/morphTargets
  return {
    'smile': 'mouthSmile',
    'frown': 'mouthFrown',
    'eyebrows_up': 'eyebrowsUp',
    'eyebrows_down': 'eyebrowsDown',
    'eyes_squint': 'eyesSquint',
    'mouth_open': 'mouthOpen',
    'mouth_narrow': 'mouthNarrow',
    // Add more mappings as needed
  };
};

// Helper to find morphTargets in a model
export const findMorphTargets = (model: LoadedModel): string[] => {
  const morphTargets: string[] = [];
  
  // Traverse the model to find all available morphTargets
  if (model?.scene) {
    model.scene.traverse((object: any) => {
      if (object.morphTargetDictionary) {
        Object.keys(object.morphTargetDictionary).forEach(key => {
          morphTargets.push(key);
        });
      }
    });
  }
  
  return morphTargets;
};
