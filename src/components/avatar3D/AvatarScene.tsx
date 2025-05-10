
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Placeholder for when we have an actual model
const PLACEHOLDER_MODEL_URL = '/models/placeholder_avatar.glb'; 

interface Avatar3DProps {
  status: "idle" | "listening" | "speaking";
  emotion?: "neutral" | "confident" | "thinking" | "happy";
}

// Component that renders the avatar model
const AvatarModel = ({ status, emotion = "neutral" }: Avatar3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [animationState, setAnimationState] = useState('idle');
  
  // Placeholder for actual GLB model
  // We'll use a simple sphere as a placeholder until we have a real model
  
  useFrame((state, delta) => {
    // Animation logic will go here when we have a real model
    if (groupRef.current) {
      if (status === "speaking") {
        // Speaking animation - subtle bobbing
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else if (status === "listening") {
        // Listening animation - subtle rotation
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      } else {
        // Idle animation - very subtle movement
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
      }
    }
  });

  // Apply different colors based on emotion
  const getEmotionColor = () => {
    switch(emotion) {
      case "confident": return new THREE.Color(0x4a90e2);
      case "thinking": return new THREE.Color(0x9b59b6);
      case "happy": return new THREE.Color(0x2ecc71);
      default: return new THREE.Color(0x3498db);
    }
  };

  return (
    <group ref={groupRef}>
      {/* This is a placeholder avatar - replace with your GLB model */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color={getEmotionColor()} />
      </mesh>
      
      {/* Eyes (simple placeholders) */}
      <mesh position={[0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-0.5, 0.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      
      {/* Pupils - will move based on status */}
      <mesh position={[0.5, 0.3, 1.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-0.5, 0.3, 1.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Simple mouth - will animate when speaking */}
      <mesh position={[0, -0.3, 1.2]} rotation={[0, 0, status === "speaking" ? Math.sin(Date.now() * 0.01) * 0.2 : 0]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshBasicMaterial color="#d35400" />
      </mesh>
    </group>
  );
};

// Light setup component
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1} 
        castShadow 
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </>
  );
};

// Main avatar scene component
const AvatarScene: React.FC<Avatar3DProps> = ({ status, emotion }) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Lights />
        <AvatarModel status={status} emotion={emotion} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
        />
      </Canvas>
    </div>
  );
};

export default AvatarScene;
