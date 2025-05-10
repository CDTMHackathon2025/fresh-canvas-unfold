
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarEmotion } from './EmotionController';

// Placeholder for when we have an actual model
const PLACEHOLDER_MODEL_URL = '/models/placeholder_avatar.glb'; 

interface Avatar3DProps {
  status: "idle" | "listening" | "speaking";
  emotion?: AvatarEmotion;
}

// Component that renders the avatar model
const AvatarModel: React.FC<Avatar3DProps> = ({ status, emotion = "neutral" }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [animationState, setAnimationState] = useState('idle');
  
  // Refs for facial features
  const headRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const pupilLeftRef = useRef<THREE.Mesh>(null);
  const pupilRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const noseRef = useRef<THREE.Mesh>(null);
  const eyebrowLeftRef = useRef<THREE.Mesh>(null);
  const eyebrowRightRef = useRef<THREE.Mesh>(null);
  const cheekLeftRef = useRef<THREE.Mesh>(null);
  const cheekRightRef = useRef<THREE.Mesh>(null);
  // Business suit elements
  const suitCollarRef = useRef<THREE.Mesh>(null);
  const suitTorsoRef = useRef<THREE.Mesh>(null);
  const tieRef = useRef<THREE.Mesh>(null);
  
  // NEW: Hair & facial details
  const hairRef = useRef<THREE.Group>(null);
  const earsRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Mesh>(null);
  
  // Enhanced materials states
  const [headMaterial] = useState(() => new THREE.MeshStandardMaterial({
    color: 0xffe0bd, // Skin tone
    roughness: 0.5,
    metalness: 0.1,
    envMapIntensity: 1.0
  }));

  // Animation timers and state
  const blinkTime = useRef(Math.random() * 5);
  const lastBlinkTime = useRef(0);
  const breathPhase = useRef(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const mouthOpenness = useRef(0);
  const lastSyllableTime = useRef(0);

  // Micro-expression state
  const microExpressionState = useRef({
    eyebrowRaise: 0,
    smile: 0,
    frown: 0,
    concerned: 0,
    lastChange: 0,
    currentExpression: 'neutral'
  });
  
  // Random micro-movement factors
  const microMovements = useMemo(() => ({
    headBobFreq: 0.3 + Math.random() * 0.2,
    headTiltRange: 0.03 + Math.random() * 0.02,
    eyeDartFreq: 2 + Math.random(),
    eyeDartRange: 0.05,
    breathFreq: 0.8 + Math.random() * 0.4,
    breathDepth: 0.02 + Math.random() * 0.01,
    blinkInterval: 2 + Math.random() * 4,
    blinkSpeed: 0.15 + Math.random() * 0.1,
    mouthIdleMovement: 0.002 + Math.random() * 0.001
  }), []);
  
  // Syllable timing for lip sync (will be improved with actual audio analysis)
  const syllableTiming = useRef([]);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Base animation based on status
    if (status === "speaking") {
      // Speaking animation - subtle head movement
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 0.7) * 0.03;
      
      // Enhanced lip sync - more natural mouth movement
      if (mouthRef.current) {
        // Simulate syllables with varying intensity
        const now = time;
        if (now - lastSyllableTime.current > 0.15 + Math.random() * 0.25) {
          lastSyllableTime.current = now;
          // Randomize mouth opening for a more natural speech pattern
          mouthOpenness.current = 0.1 + Math.random() * 0.4;
          
          // Also move eyebrows occasionally during speech for emphasis
          if (Math.random() > 0.7 && eyebrowLeftRef.current && eyebrowRightRef.current) {
            const emphasisAmount = 0.05 + Math.random() * 0.1;
            eyebrowLeftRef.current.position.y += emphasisAmount;
            eyebrowRightRef.current.position.y += emphasisAmount;
            
            // Reset eyebrows after a short delay
            setTimeout(() => {
              if (eyebrowLeftRef.current && eyebrowRightRef.current) {
                eyebrowLeftRef.current.position.y -= emphasisAmount;
                eyebrowRightRef.current.position.y -= emphasisAmount;
              }
            }, 150);
          }
        } else {
          // Gradually close mouth between syllables for smoother animation
          mouthOpenness.current = Math.max(mouthOpenness.current - delta * 3, 0);
        }
        
        // Apply mouth openness to the mesh - vary based on shape
        const mouthShape = emotion === "happy" ? 1 : (emotion === "confident" ? 0.5 : 0);
        mouthRef.current.scale.y = 1 + mouthOpenness.current;
        
        // Create mouth curve for expressions
        if (emotion === "happy") {
          mouthRef.current.rotation.z = 0.2; // Smile
          // Wider smile when happy
          mouthRef.current.scale.x = 1.2;
        } else if (emotion === "thinking" && !mouthOpenness.current) {
          mouthRef.current.rotation.z = -0.1; // Slight frown
          mouthRef.current.scale.x = 0.9; 
        } else {
          mouthRef.current.rotation.z = Math.sin(time * 0.5) * 0.05; // Subtle movement
          mouthRef.current.scale.x = 1.0;
        }
      }
      
    } else if (status === "listening") {
      // Listening animation - more attentive head tilt and movement
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
      groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.03;
      
      // More alert expression when listening
      if (eyebrowLeftRef.current && eyebrowRightRef.current) {
        eyebrowLeftRef.current.position.y = 0.05 + Math.sin(time * 1.2) * 0.02;
        eyebrowRightRef.current.position.y = 0.05 + Math.sin(time * 1.2) * 0.02;
      }
      
      // Eyes focus more intently when listening
      if (pupilLeftRef.current && pupilRightRef.current) {
        pupilLeftRef.current.position.x = 0;
        pupilRightRef.current.position.x = 0;
      }
      
      // Subtle mouth movement indicating attention
      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.8 + Math.sin(time * 3) * 0.05;
      }
      
    } else {
      // Idle animation - subtle natural breathing and occasional head movements
      groupRef.current.position.y = Math.sin(time * microMovements.breathFreq) * microMovements.breathDepth;
      groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.02;
      
      // Occasional slight nods or head tilts during idle
      if (Math.sin(time * 0.1) > 0.95) {
        groupRef.current.rotation.x = Math.sin(time) * 0.05;
      }
      
      // Subtle mouth movement during idle to show "presence"
      if (mouthRef.current) {
        // Very subtle idle mouth movement
        mouthRef.current.scale.y = 0.9 + Math.sin(time * 1.3) * microMovements.mouthIdleMovement;
        
        // Subtle smile/expression based on emotion
        if (emotion === "happy") {
          mouthRef.current.rotation.z = 0.1 + Math.sin(time * 0.5) * 0.02;
          mouthRef.current.scale.x = 1.15; // Wider smile in idle
        } else if (emotion === "thinking") {
          mouthRef.current.rotation.z = -0.05 + Math.sin(time * 0.3) * 0.01;
          mouthRef.current.scale.x = 0.95; // Slightly narrower when thinking
        }
      }
    }
    
    // Eye blinking - random timing for more natural feel
    const timeSinceLastBlink = time - lastBlinkTime.current;
    if (timeSinceLastBlink > microMovements.blinkInterval) {
      setIsBlinking(true);
      lastBlinkTime.current = time;
      blinkTime.current = microMovements.blinkInterval; // Random time until next blink
      
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
    
    // Suit elements subtle movement with breathing
    if (suitTorsoRef.current) {
      suitTorsoRef.current.scale.y = 1 + breathValue * 0.01;
    }
    
    // Cheek movement for expressions
    if (cheekLeftRef.current && cheekRightRef.current) {
      if (emotion === "happy") {
        cheekLeftRef.current.position.y = -0.05 + Math.sin(time * 1.2) * 0.02;
        cheekRightRef.current.position.y = -0.05 + Math.sin(time * 1.2) * 0.02;
      } else {
        cheekLeftRef.current.position.y = Math.sin(time * 0.8) * 0.01;
        cheekRightRef.current.position.y = Math.sin(time * 0.8) * 0.01;
      }
    }
    
    // Hair subtle movement (if exists)
    if (hairRef.current) {
      hairRef.current.position.y = Math.sin(time * 0.3) * 0.005;
      hairRef.current.rotation.z = Math.sin(time * 0.4) * 0.01;
    }
    
    // Micro-expressions based on emotion and timing
    // Randomly trigger micro-expressions during idle time
    if (time - microExpressionState.current.lastChange > 5 && Math.random() > 0.997) {
      // Choose a random micro-expression
      const expressions = ['eyebrowRaise', 'smile', 'blink', 'lookAround'];
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      
      microExpressionState.current.lastChange = time;
      microExpressionState.current.currentExpression = randomExpression;
      
      // Reset after a short time
      setTimeout(() => {
        microExpressionState.current.currentExpression = 'neutral';
      }, 500 + Math.random() * 1000);
    }
  });

  // Apply different colors and rendering based on emotion
  const getEmotionColor = () => {
    switch(emotion) {
      case "confident": return 0x4a90e2;
      case "thinking": return 0x9b59b6;
      case "happy": return 0x2ecc71;
      default: return 0x3498db;
    }
  };
  
  // Get skin tone color with subtle variation based on emotion
  const getSkinTone = () => {
    const baseSkinTone = new THREE.Color(0xffe0bd);  // Base skin tone
    
    // Slightly modify skin tone based on emotion (subtle effect)
    switch(emotion) {
      case "happy": 
        return baseSkinTone.lerp(new THREE.Color(0xffd6a5), 0.3); // Warmer
      case "thinking": 
        return baseSkinTone.lerp(new THREE.Color(0xf0e0d6), 0.2); // Slightly cooler
      case "concerned":
        return baseSkinTone.lerp(new THREE.Color(0xf5d7c6), 0.2); // Paler
      default:
        return baseSkinTone;
    }
  };
  
  // Additional subtle expression based on emotion
  useEffect(() => {
    if (!groupRef.current) return;
    
    switch(emotion) {
      case "confident":
        // Slightly raise head position
        groupRef.current.position.y += 0.05;
        if (eyebrowLeftRef.current && eyebrowRightRef.current) {
          eyebrowLeftRef.current.position.y = 0.1;
          eyebrowRightRef.current.position.y = 0.1;
        }
        break;
      case "thinking":
        // Slight head tilt
        groupRef.current.rotation.z = 0.1;
        if (eyebrowLeftRef.current && eyebrowRightRef.current) {
          // Asymmetric eyebrows for thinking
          eyebrowLeftRef.current.position.y = 0.15;
          eyebrowRightRef.current.position.y = 0.05;
          eyebrowLeftRef.current.rotation.z = 0.2;
        }
        break;
      case "happy":
        // Raised cheeks, wide smile
        if (mouthRef.current) {
          mouthRef.current.scale.x = 1.2;
          mouthRef.current.rotation.z = 0.15; // Smile
        }
        if (eyebrowLeftRef.current && eyebrowRightRef.current) {
          eyebrowLeftRef.current.position.y = 0.08;
          eyebrowRightRef.current.position.y = 0.08;
        }
        break;
      default:
        // Reset any position changes
        groupRef.current.position.y = 0;
        groupRef.current.rotation.z = 0;
        if (mouthRef.current) {
          mouthRef.current.scale.x = 1;
          mouthRef.current.rotation.z = 0;
        }
    }
    
    // Update head material color based on emotion
    if (headRef.current && headRef.current.material) {
      (headRef.current.material as THREE.MeshStandardMaterial).color = getSkinTone();
    }
    
  }, [emotion]);

  // Create more realistic ear shapes
  const createEar = (side: 'left' | 'right') => {
    const xPos = side === 'left' ? 0.9 : -0.9;
    return (
      <group position={[xPos, 0, 0]} rotation={[0, side === 'left' ? -Math.PI/2 : Math.PI/2, 0]}>
        <mesh>
          <ellipseCurve 
            args={[0, 0, 0.3, 0.5, 0, 2 * Math.PI, false, 0]} 
            asGeometry={true}
            extrudeGeometry={{
              steps: 1,
              depth: 0.1,
              bevelEnabled: true,
              bevelThickness: 0.1,
              bevelSize: 0.1,
              bevelSegments: 3
            }}
          />
          <meshStandardMaterial color={getSkinTone()} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Enhanced head with better shape and skin material */}
      <mesh ref={headRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color={getSkinTone()}
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* NEW: Neck */}
      <mesh ref={neckRef} position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 1.0, 16]} />
        <meshStandardMaterial 
          color={getSkinTone()}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* NEW: Ears */}
      <group ref={earsRef}>
        {/* Left ear */}
        <mesh position={[1.4, 0.1, 0]} rotation={[0, Math.PI/2, 0]}>
          <ellipsoidGeometry args={[0.2, 0.4, 0.15]} />
          <meshStandardMaterial color={getSkinTone()} />
        </mesh>
        
        {/* Right ear */}
        <mesh position={[-1.4, 0.1, 0]} rotation={[0, -Math.PI/2, 0]}>
          <ellipsoidGeometry args={[0.2, 0.4, 0.15]} />
          <meshStandardMaterial color={getSkinTone()} />
        </mesh>
      </group>
      
      {/* NEW: More detailed hair */}
      <group ref={hairRef}>
        {/* Main hair mass */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.53, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial 
            color={0x3a3a3a}  // Dark hair color
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Hair front */}
        <mesh position={[0, 0.7, 1.2]} rotation={[Math.PI * 0.1, 0, 0]}>
          <boxGeometry args={[1.8, 0.4, 0.3]} />
          <meshStandardMaterial 
            color={0x3a3a3a}
            roughness={0.9}
          />
        </mesh>
      </group>
      
      {/* Enhanced eyes with better details */}
      <mesh ref={eyeLeftRef} position={[0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial 
          color="white" 
          roughness={0.1}
          metalness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh ref={eyeRightRef} position={[-0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial 
          color="white" 
          roughness={0.1}
          metalness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Iris and Pupils with more detail */}
      <group position={[0.5, 0.3, 1.35]}>
        <mesh>
          <ringGeometry args={[0.08, 0.14, 24]} />
          <meshStandardMaterial color="#5a7b9c" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh ref={pupilLeftRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="black" 
            metalness={0.5}
            roughness={0.2}
            envMapIntensity={2}
          />
        </mesh>
      </group>
      <group position={[-0.5, 0.3, 1.35]}>
        <mesh>
          <ringGeometry args={[0.08, 0.14, 24]} />
          <meshStandardMaterial color="#5a7b9c" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh ref={pupilRightRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="black" 
            metalness={0.5}
            roughness={0.2}
            envMapIntensity={2}
          />
        </mesh>
      </group>
      
      {/* Enhanced eyebrows with better shape */}
      <mesh ref={eyebrowLeftRef} position={[0.5, 0.6, 1.3]} rotation={[0.1, 0, 0.1]}>
        <boxGeometry args={[0.3, 0.06, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh ref={eyebrowRightRef} position={[-0.5, 0.6, 1.3]} rotation={[0.1, 0, -0.1]}>
        <boxGeometry args={[0.3, 0.06, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* More refined nose */}
      <mesh ref={noseRef} position={[0, 0, 1.45]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial 
          color={getSkinTone()}
          roughness={0.6}
        />
      </mesh>
      {/* Nose bridge */}
      <mesh position={[0, 0.15, 1.4]}>
        <boxGeometry args={[0.12, 0.3, 0.1]} />
        <meshStandardMaterial color={getSkinTone()} />
      </mesh>
      
      {/* Enhanced mouth for better speech animation */}
      <group position={[0, -0.4, 1.25]}>
        <mesh 
          ref={mouthRef}
          rotation={[0, 0, status === "speaking" ? Math.sin(Date.now() * 0.01) * 0.1 : 0]}
        >
          <boxGeometry args={[0.8, 0.15, 0.1]} />
          <meshStandardMaterial 
            color="#d35400" 
            roughness={0.7}
            emissive={new THREE.Color(getEmotionColor()).multiplyScalar(0.05).getHex()}
          />
        </mesh>
        
        {/* Lips */}
        <mesh position={[0, 0.08, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.85, 0.05, 0.12]} />
          <meshStandardMaterial color="#c0392b" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.85, 0.04, 0.12]} />
          <meshStandardMaterial color="#aa3326" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Cheek highlights for expressions */}
      <mesh ref={cheekLeftRef} position={[0.7, -0.1, 1.0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(getSkinTone()).multiplyScalar(1.05).getHex()}
          opacity={0.5}
          transparent={true}
          roughness={0.5}
        />
      </mesh>
      <mesh ref={cheekRightRef} position={[-0.7, -0.1, 1.0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(getSkinTone()).multiplyScalar(1.05).getHex()}
          opacity={0.5}
          transparent={true}
          roughness={0.5}
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

      {/* Business suit collar - enhanced shape */}
      <mesh ref={suitCollarRef} position={[0, -1.5, 0.5]}>
        <cylinderGeometry args={[1.55, 1.7, 0.5, 32, 1, true]} />
        <meshStandardMaterial 
          color="#2c3e50" 
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Business suit torso */}
      <mesh ref={suitTorsoRef} position={[0, -2.5, 0]}>
        <cylinderGeometry args={[1.7, 1.5, 2.0, 32]} />
        <meshStandardMaterial 
          color="#34495e" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Enhanced business tie with more detail */}
      <group position={[0, -1.7, 1.2]}>
        {/* Knot */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.35, 0.25, 0.1]} />
          <meshStandardMaterial color="#c0392b" roughness={0.6} />
        </mesh>
        {/* Upper tie */}
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.4, 4, 1, false]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.6} />
        </mesh>
        {/* Lower tie */}
        <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.5, 4, 1, false]} />
          <meshStandardMaterial color="#c0392b" roughness={0.6} />
        </mesh>
        
        {/* Tie pin */}
        <mesh position={[0, -0.3, 0.06]} rotation={[0, 0, Math.PI/4]}>
          <boxGeometry args={[0.15, 0.02, 0.01]} />
          <meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Jacket lapels */}
      <mesh position={[0.7, -1.5, 1.0]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.1]} />
        <meshStandardMaterial color="#1f2c39" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, -1.5, 1.0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.1]} />
        <meshStandardMaterial color="#1f2c39" roughness={0.8} />
      </mesh>
      
      {/* Subtle glow/halo when active */}
      {(status === "listening" || status === "speaking") && (
        <mesh position={[0, 0, -0.2]} rotation={[0, 0, 0]}>
          <ringGeometry args={[1.8, 2.0, 32]} />
          <meshBasicMaterial 
            color={new THREE.Color(getEmotionColor())} 
            opacity={0.2 + Math.sin(Date.now() * 0.002) * 0.1} 
            transparent={true} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
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
      
      {/* Additional highlight for eyes and face */}
      <pointLight position={[0, 0.3, 3]} intensity={0.2} color="#ffffff" />
    </>
  );
};

// Main avatar scene component
const AvatarScene: React.FC<Avatar3DProps> = ({ status, emotion = "neutral" }) => {
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
