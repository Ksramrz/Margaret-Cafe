'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// Lighting Component
function CafeLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffaa44" />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#aaffaa" />
    </>
  );
}

// Floor Component
function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#8b7355" />
    </mesh>
  );
}

// Wall Component
function Wall({ position, rotation, size = [20, 4] }: any) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[size[0], size[1], 0.2]} />
      <meshStandardMaterial color="#c9a982" />
    </mesh>
  );
}

// Table Component
function Table({ position, rotation = [0, 0, 0] }: any) {
  const group = useRef<THREE.Group>(null);
  
  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {/* Table Legs */}
      {[[-0.9, 0, -0.4], [0.9, 0, -0.4], [-0.9, 0, 0.4], [0.9, 0, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#4a3420" />
        </mesh>
      ))}
    </group>
  );
}

// Chair Component
function Chair({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.7, -0.25]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Legs */}
      {[[-0.25, 0, -0.25], [0.25, 0, -0.25], [-0.25, 0, 0.25], [0.25, 0, 0.25]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#4a3420" />
        </mesh>
      ))}
    </group>
  );
}

// Coffee Cup Component
function CoffeeCup({ position, steaming = false }: any) {
  const cupRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cupRef.current && steaming) {
      cupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Cup */}
      <mesh ref={cupRef} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.2, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Steam (simple representation) */}
      {steaming && (
        <group>
          {[0, 0.25, 0.5].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// Counter Component
function Counter() {
  return (
    <group position={[-3, 0, -8]}>
      {/* Counter Top */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.2, 1.5]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {/* Counter Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[6, 1, 1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Coffee Machine (simplified) */}
      <mesh position={[-1, 1.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Display Cup on Counter */}
      <CoffeeCup position={[1, 1.2, 0]} steaming={true} />
    </group>
  );
}

// Interactive Panel Component
function InteractivePanel({ position, label, onClick, color = "#ffaa44" }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color={hovered ? color : "#888888"} />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="center"
      >
        {label}
      </Text>
    </group>
  );
}

// Main Scene Component
function CafeScene({ onShopClick, onAcademyClick }: any) {
  const { camera } = useThree();
  
  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <>
      <CafeLighting />
      
      {/* Floor */}
      <Floor />
      
      {/* Walls */}
      <Wall position={[0, 2, -10]} />
      <Wall position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[10, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Tables and Chairs */}
      <Table position={[-4, 0, -2]} />
      <Chair position={[-4.8, 0, -2]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[-3.2, 0, -2]} rotation={[0, -Math.PI / 4, 0]} />
      
      <Table position={[4, 0, -2]} />
      <Chair position={[3.2, 0, -2]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[4.8, 0, -2]} rotation={[0, -Math.PI / 4, 0]} />
      
      <Table position={[0, 0, 2]} />
      <Chair position={[-0.8, 0, 2]} rotation={[0, Math.PI / 4, 0]} />
      <Chair position={[0.8, 0, 2]} rotation={[0, -Math.PI / 4, 0]} />
      
      {/* Counter */}
      <Counter />
      
      {/* Interactive Panels */}
      <InteractivePanel
        position={[-6, 2, -5]}
        label="فروشگاه"
        onClick={onShopClick}
        color="#00ff88"
      />
      <InteractivePanel
        position={[6, 2, -5]}
        label="آکادمی"
        onClick={onAcademyClick}
        color="#00f0ff"
      />
      
      {/* Ambient coffee cups on tables */}
      <CoffeeCup position={[-4, 0.9, -2]} />
      <CoffeeCup position={[4, 0.9, -2]} />
      
      <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />
    </>
  );
}

// Main 3D Cafe Component
const Cafe3D: React.FC = () => {
  const [viewMode, setViewMode] = useState<'explore' | 'shop' | 'academy'>('explore');

  const handleShopClick = () => {
    setViewMode('shop');
  };

  const handleAcademyClick = () => {
    setViewMode('academy');
  };

  const handleBack = () => {
    setViewMode('explore');
  };

  if (viewMode === 'shop') {
    return (
      <div className="relative w-full h-screen bg-dark-bg">
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 z-50 btn-primary"
        >
          بازگشت به کافه
        </button>
        {/* Shop content will be integrated here */}
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-4xl text-gradient">فروشگاه</h1>
        </div>
      </div>
    );
  }

  if (viewMode === 'academy') {
    return (
      <div className="relative w-full h-screen bg-dark-bg">
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 z-50 btn-primary"
        >
          بازگشت به کافه
        </button>
        {/* Academy content will be integrated here */}
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-4xl text-gradient">آکادمی</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-dark-bg">
      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 z-50 glass px-6 py-4 rounded-lg border border-neon-green/30">
        <h2 className="text-neon-green font-bold mb-2">کافه مارگارت</h2>
        <p className="text-dark-text-secondary text-sm">
          برای حرکت: کلیک و بکشید | روی پنل‌های سبز و آبی کلیک کنید
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <CafeScene onShopClick={handleShopClick} onAcademyClick={handleAcademyClick} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
          />
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Cafe3D;

