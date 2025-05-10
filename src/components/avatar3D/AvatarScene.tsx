
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Placeholder for when we have an actual model
const PLACEHOLDER_MODEL_URL = '/models/placeholder_avatar.glb'; 

interface Avatar3DProps {
  status: "idle" | "listening" | "speaking";
  emotion?: "neutral" | "confident" | "thinking" | "happy";
}

// Component that renders the avatar model
const AvatarModel: React.FC<Avatar3DProps> = ({ status, emotion = "neutral" }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [animationState, setAnimationState] = useState('idle');
  
  // Refs for micro-expressions
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const pupilLeftRef = useRef<THREE.Mesh>(null);
  const pupilRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Animation timers and state
  const blinkTime = useRef(Math.random() * 5);
  const lastBlinkTime = useRef(0);
  const breathPhase = useRef(0);
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Random micro-movement factors
  const microMovements = useMemo(() => ({
    headBobFreq: 0.3 + Math.random() * 0.2,
    headTiltRange: 0.03 + Math.random() * 0.02,
    eyeDartFreq: 2 + Math.random(),
    eyeDartRange: 0.05,
    breathFreq: 0.8 + Math.random() * 0.4,
    breathDepth: 0.02 + Math.random() * 0.01
  }), []);
  
  // Syllable timing for lip sync (will be improved with actual audio analysis)
  const syllableTiming = useRef([]);
  const lastSyllableTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Base animation based on status
    if (status === "speaking") {
      // Speaking animation - subtle head movement
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
      
      // Enhanced lip sync - more natural mouth movement
      if (mouthRef.current) {
        // Simulate syllables with varying intensity
        const now = state.clock.elapsedTime;
        if (now - lastSyllableTime.current > 0.2 + Math.random() * 0.3) {
          lastSyllableTime.current = now;
          // Randomize mouth opening for a more natural speech pattern
          const openAmount = 0.1 + Math.random() * 0.4;
          mouthRef.current.scale.y = 1 + openAmount;
        } else {
          // Gradually close mouth between syllables for smoother animation
          if (mouthRef.current.scale.y > 1) {
            mouthRef.current.scale.y -= delta * 3;
            if (mouthRef.current.scale.y < 1) mouthRef.current.scale.y = 1;
          }
        }
      }
      
    } else if (status === "listening") {
      // Listening animation - more attentive head tilt and movement
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
      
      // Eyes focus more intently when listening
      if (pupilLeftRef.current && pupilRightRef.current) {
        pupilLeftRef.current.position.x = 0;
        pupilRightRef.current.position.x = 0;
      }
    } else {
      // Idle animation - subtle natural breathing and occasional head movements
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * microMovements.breathFreq) * microMovements.breathDepth;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
      
      // Occasional slight nods or head tilts during idle
      if (Math.sin(state.clock.elapsedTime * 0.1) > 0.95) {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
      }
    }
    
    // Eye blinking - random timing for more natural feel
    const timeSinceLastBlink = state.clock.elapsedTime - lastBlinkTime.current;
    if (timeSinceLastBlink > blinkTime.current) {
      setIsBlinking(true);
      lastBlinkTime.current = state.clock.elapsedTime;
      blinkTime.current = 2 + Math.random() * 4; // Random time until next blink
      
      // Reset blink after a short duration
      setTimeout(() => setIsBlinking(false), 150);
    }
    
    // Apply the blink
    if (eyeLeftRef.current && eyeRightRef.current) {
      if (isBlinking) {
        eyeLeftRef.current.scale.y = 0.1;
        eyeRightRef.current.scale.y = 0.1;
      } else {
        // Smoothly open eyes
        eyeLeftRef.current.scale.y = Math.min(eyeLeftRef.current.scale.y + delta * 5, 1);
        eyeRightRef.current.scale.y = Math.min(eyeRightRef.current.scale.y + delta * 5, 1);
      }
    }
    
    // Random eye movement - dart around occasionally
    if (pupilLeftRef.current && pupilRightRef.current && !isBlinking) {
      if (Math.random() > 0.995) { // Occasionally dart eyes
        const lookX = (Math.random() - 0.5) * microMovements.eyeDartRange;
        const lookY = (Math.random() - 0.5) * microMovements.eyeDartRange;
        
        pupilLeftRef.current.position.x = lookX;
        pupilLeftRef.current.position.y = lookY;
        pupilRightRef.current.position.x = lookX;
        pupilRightRef.current.position.y = lookY;
      }
    }
    
    // Breathing animation cycle - subtle chest movement
    breathPhase.current += delta * microMovements.breathFreq;
    const breathValue = Math.sin(breathPhase.current);
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + breathValue * 0.01;
    }
  });

  // Apply different colors and rendering based on emotion
  const getEmotionColor = () => {
    switch(emotion) {
      case "confident": return new THREE.Color(0x4a90e2);
      case "thinking": return new THREE.Color(0x9b59b6);
      case "happy": return new THREE.Color(0x2ecc71);
      default: return new THREE.Color(0x3498db);
    }
  };
  
  // Additional subtle expression based on emotion
  useEffect(() => {
    if (!groupRef.current) return;
    
    switch(emotion) {
      case "confident":
        // Slightly raise head position
        groupRef.current.position.y += 0.05;
        break;
      case "thinking":
        // Slight head tilt
        groupRef.current.rotation.z = 0.1;
        break;
      case "happy":
        // No additional positioning needed, color and face convey it
        break;
      default:
        // Reset any position changes
        groupRef.current.position.y = 0;
        groupRef.current.rotation.z = 0;
    }
  }, [emotion]);

  return (
    <group ref={groupRef}>
      {/* This is a placeholder avatar - replace with your GLB model */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color={getEmotionColor()}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Eyes with more detail and reflections */}
      <mesh ref={eyeLeftRef} position={[0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="white" 
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh ref={eyeRightRef} position={[-0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="white" 
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Pupils with reflections */}
      <mesh ref={pupilLeftRef} position={[0.5, 0.3, 1.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="black" 
          metalness={0.5}
          roughness={0.2}
          envMapIntensity={2}
        />
      </mesh>
      <mesh ref={pupilRightRef} position={[-0.5, 0.3, 1.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="black" 
          metalness={0.5}
          roughness={0.2}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Enhanced mouth for better speech animation */}
      <mesh 
        ref={mouthRef}
        position={[0, -0.3, 1.2]} 
        rotation={[0, 0, status === "speaking" ? Math.sin(Date.now() * 0.01) * 0.1 : 0]}
      >
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial 
          color="#d35400" 
          roughness={0.7}
        />
      </mesh>
      
      {/* Add subtle highlight in eyes */}
      <mesh position={[0.55, 0.35, 1.45]} rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="white" opacity={0.7} transparent={true} />
      </mesh>
      <mesh position={[-0.55, 0.35, 1.45]} rotation={[0, -0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="white" opacity={0.7} transparent={true} />
      </mesh>
    </group>
  );
};

// Enhanced lighting setup for better rendering
const Lights: React.FC = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main key light */}
      <directionalLight 
        position={[3, 3, 5]} 
        intensity={1.2} 
        castShadow 
      />
      
      {/* Rim/back light for highlighting */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.4}
        color="#b3e5fc"
      />
      
      {/* Soft fill light */}
      <pointLight position={[-2, 1, 4]} intensity={0.4} color="#fff5e6" />
    </>
  );
};

// Main avatar scene component
const AvatarScene: React.FC<Avatar3DProps> = ({ status, emotion }) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Lights />
        <AvatarModel status={status} emotion={emotion} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
        />
        {/* Environment map for better reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AvatarScene;
