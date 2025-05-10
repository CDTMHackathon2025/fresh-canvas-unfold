
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
        if (emotion === "happy" && !mouthOpenness.current) {
          mouthRef.current.rotation.z = 0.2; // Smile
        } else if (emotion === "thinking" && !mouthOpenness.current) {
          mouthRef.current.rotation.z = -0.1; // Slight frown
        } else {
          mouthRef.current.rotation.z = Math.sin(time * 0.5) * 0.05; // Subtle movement
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
      
      // Nose subtly glows when processing
      if (noseRef.current && noseRef.current.material) {
        (noseRef.current.material as THREE.MeshStandardMaterial).emissive = 
          new THREE.Color(0x333333).lerp(
            new THREE.Color(getEmotionColor()), 
            0.2 + Math.sin(time * 2) * 0.1
          );
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
        } else if (emotion === "thinking") {
          mouthRef.current.rotation.z = -0.05 + Math.sin(time * 0.3) * 0.01;
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
  }, [emotion]);

  return (
    <group ref={groupRef}>
      {/* Head - main sphere */}
      <mesh ref={headRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color={getEmotionColor()}
          roughness={0.7}
          metalness={0.2}
          // Add subsurface scattering-like effect
          envMapIntensity={1.2}
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
      
      {/* New: Eyebrows for expression */}
      <mesh ref={eyebrowLeftRef} position={[0.5, 0.5, 1.3]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh ref={eyebrowRightRef} position={[-0.5, 0.5, 1.3]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* New: Nose */}
      <mesh ref={noseRef} position={[0, 0, 1.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(getEmotionColor()).multiplyScalar(0.7).getHex()}
          emissive={new THREE.Color(getEmotionColor()).multiplyScalar(0.1).getHex()}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Enhanced mouth for better speech animation */}
      <mesh 
        ref={mouthRef}
        position={[0, -0.3, 1.2]} 
        rotation={[0, 0, status === "speaking" ? Math.sin(Date.now() * 0.01) * 0.1 : 0]}
      >
        <boxGeometry args={[0.8, 0.15, 0.1]} />
        <meshStandardMaterial 
          color="#d35400" 
          roughness={0.7}
          emissive={new THREE.Color(getEmotionColor()).multiplyScalar(0.1).getHex()}
        />
      </mesh>
      
      {/* New: Cheek highlights for expressions */}
      <mesh ref={cheekLeftRef} position={[0.7, -0.1, 1.0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(getEmotionColor()).multiplyScalar(1.1).getHex()}
          opacity={0.3}
          transparent={true}
          roughness={0.5}
        />
      </mesh>
      <mesh ref={cheekRightRef} position={[-0.7, -0.1, 1.0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(getEmotionColor()).multiplyScalar(1.1).getHex()}
          opacity={0.3}
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
      
      {/* Add subtle glow/halo when active */}
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
