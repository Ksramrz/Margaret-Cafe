'use client';

import React, { useRef, useState, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// High-quality lighting for café atmosphere
const CafeLighting = React.memo(() => {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffedd5" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Warm café lighting */}
      <pointLight position={[-4, 4, -6]} intensity={1.5} color="#ffaa44" distance={15} decay={2} />
      <pointLight position={[4, 4, -6]} intensity={1.5} color="#ffaa44" distance={15} decay={2} />
      <pointLight position={[0, 3, 2]} intensity={1} color="#ffdd99" distance={10} decay={2} />
      {/* Accent lighting */}
      <spotLight position={[-3, 5, -8]} angle={0.3} penumbra={0.5} intensity={2} color="#ffffff" castShadow />
    </>
  );
});
CafeLighting.displayName = 'CafeLighting';

// High-quality floor with texture
const Floor = React.memo(() => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial 
        color="#6b5b47"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
});
Floor.displayName = 'Floor';

// Café walls with better materials
const Wall = React.memo(({ position, rotation, size = [25, 5], texture = 'brick' }: any) => {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[size[0], size[1], 0.3]} />
      <meshStandardMaterial 
        color={texture === 'brick' ? "#a0826d" : "#d4c4b0"}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
});
Wall.displayName = 'Wall';

// High-quality wooden table
const Table = React.memo(({ position, rotation = [0, 0, 0] }: any) => {
  const legPositions = useMemo((): [number, number, number][] => 
    [[-1, 0, -0.5], [1, 0, -0.5], [-1, 0, 0.5], [1, 0, 0.5]],
    []
  );
  
  return (
    <group position={position} rotation={rotation}>
      {/* Table Top - Dark wood */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.15, 1.2]} />
        <meshStandardMaterial 
          color="#4a3420"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Table Legs - Thicker, more realistic */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.85, 16]} />
          <meshStandardMaterial 
            color="#3a2818"
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
});
Table.displayName = 'Table';

// Comfortable café chairs
const Chair = React.memo(({ position, rotation = [0, 0, 0] }: any) => {
  const legPositions = useMemo((): [number, number, number][] => 
    [[-0.28, 0, -0.28], [0.28, 0, -0.28], [-0.28, 0, 0.28], [0.28, 0, 0.28]],
    []
  );
  
  return (
    <group position={position} rotation={rotation}>
      {/* Seat cushion */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.65, 0.12, 0.65]} />
        <meshStandardMaterial 
          color="#8b6f47"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      {/* Back rest - angled */}
      <mesh position={[0, 0.75, -0.3]} rotation={[Math.PI / 12, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.7, 0.12]} />
        <meshStandardMaterial 
          color="#8b6f47"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      {/* Chair legs - more elegant */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.42, 12]} />
          <meshStandardMaterial 
            color="#4a3420"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
});
Chair.displayName = 'Chair';

// Realistic coffee cup
const CoffeeCup = React.memo(({ position, steaming = false }: any) => {
  const cupRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cupRef.current && steaming) {
      cupRef.current.rotation.y += 0.005;
    }
    if (steamRef.current && steaming) {
      steamRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      steamRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  const steamPositions = useMemo(() => [
    [-0.03, 0.25, 0],
    [0.03, 0.4, 0],
    [0, 0.55, 0]
  ], []);

  return (
    <group position={position}>
      {/* Cup body */}
      <mesh ref={cupRef} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.22, 24]} />
        <meshStandardMaterial 
          color="#f5f5dc"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Cup handle */}
      <mesh position={[0.2, 0.11, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.1, 0.02, 8, 16]} />
        <meshStandardMaterial 
          color="#8b7355"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      {/* Coffee liquid inside */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} />
        <meshStandardMaterial 
          color="#3d2817"
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      {/* Steam - animated */}
      {steaming && (
        <group ref={steamRef}>
          {steamPositions.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.025 + i * 0.005, 12, 12]} />
              <meshStandardMaterial 
                color="#ffffff" 
                opacity={0.4 - i * 0.1} 
                transparent
                roughness={1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
});
CoffeeCup.displayName = 'CoffeeCup';

// Professional café counter
const Counter = React.memo(() => {
  return (
    <group position={[-3, 0, -9]}>
      {/* Counter base */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[7, 1.2, 2]} />
        <meshStandardMaterial 
          color="#8b7355"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Counter top - marble-like */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.3, 2]} />
        <meshStandardMaterial 
          color="#e8e0d6"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      {/* Coffee machine - more detailed */}
      <group position={[-2, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.7, 0.7]} />
          <meshStandardMaterial 
            color="#2a2a2a"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0.35, 0.35]} castShadow>
          <boxGeometry args={[0.7, 0.15, 0.3]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>
      {/* Menu board */}
      <mesh position={[2.5, 2, 0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial 
          color="#4a3420"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      {/* Cups on counter */}
      <CoffeeCup position={[0, 1.5, 0]} steaming={true} />
      <CoffeeCup position={[0.5, 1.5, 0]} />
    </group>
  );
});
Counter.displayName = 'Counter';

// Window decoration
const Window = React.memo(({ position, rotation = [0, 0, 0] }: any) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[4, 3, 0.2]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Window glass */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[3.6, 2.6, 0.05]} />
        <meshStandardMaterial 
          color="#aaddff" 
          opacity={0.3} 
          transparent
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Window sill with plants */}
      <mesh position={[0, -1.7, 0.2]}>
        <boxGeometry args={[4.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh key={i} position={[x, -1.6, 0.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 12]} />
          <meshStandardMaterial color="#22aa22" />
        </mesh>
      ))}
    </group>
  );
});
Window.displayName = 'Window';

// Interactive Panel - More café-like
const InteractivePanel = React.memo(({ position, label, onClick, color = "#ffaa44" }: any) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.05 : 1);
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
        <boxGeometry args={[2.5, 2, 0.15]} />
        <meshStandardMaterial 
          color={hovered ? color : "#6b5b47"}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      {/* Glow effect when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[2.5, 2, 0.1]} />
          <meshStandardMaterial 
            color={color}
            opacity={0.3}
            transparent
          />
        </mesh>
      )}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
});
InteractivePanel.displayName = 'InteractivePanel';

// Decorative elements
const DecorativePlant = React.memo(({ position }: any) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Leaves */}
      {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.3, 0.6, Math.sin(angle) * 0.3]} rotation={[0, angle, 0]} castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#2d5016" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
});
DecorativePlant.displayName = 'DecorativePlant';

// Main Scene
function CafeScene({ onShopClick, onAcademyClick }: any) {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);

  const tableConfigs = useMemo(() => [
    { position: [-5, 0, -3], chairs: [
      { position: [-6.2, 0, -3], rotation: [0, Math.PI / 6, 0] },
      { position: [-3.8, 0, -3], rotation: [0, -Math.PI / 6, 0] },
      { position: [-5, 0, -1.8], rotation: [0, Math.PI, 0] }
    ]},
    { position: [5, 0, -3], chairs: [
      { position: [3.8, 0, -3], rotation: [0, Math.PI / 6, 0] },
      { position: [6.2, 0, -3], rotation: [0, -Math.PI / 6, 0] },
      { position: [5, 0, -1.8], rotation: [0, Math.PI, 0] }
    ]},
    { position: [0, 0, 3], chairs: [
      { position: [-0.9, 0, 3], rotation: [0, Math.PI / 4, 0] },
      { position: [0.9, 0, 3], rotation: [0, -Math.PI / 4, 0] }
    ]}
  ], []);

  return (
    <>
      <CafeLighting />
      <Floor />
      
      {/* Walls with windows */}
      <Wall position={[0, 2.5, -12]} />
      <Wall position={[-12, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[12, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} texture="cream" />
      
      {/* Windows */}
      <Window position={[-8, 2.5, -12.1]} />
      <Window position={[8, 2.5, -12.1]} />
      
      {/* Tables with chairs */}
      {tableConfigs.map((config, i) => (
        <React.Fragment key={i}>
          <Table position={config.position} />
          {config.chairs.map((chair, j) => (
            <Chair key={j} position={chair.position} rotation={chair.rotation} />
          ))}
          <CoffeeCup position={[config.position[0], 0.95, config.position[2]]} steaming={Math.random() > 0.5} />
        </React.Fragment>
      ))}
      
      {/* Counter */}
      <Counter />
      
      {/* Decorative plants */}
      <DecorativePlant position={[-10, 0, 5]} />
      <DecorativePlant position={[10, 0, 5]} />
      
      {/* Interactive Panels */}
      <InteractivePanel
        position={[-7, 3, -7]}
        label="فروشگاه"
        onClick={onShopClick}
        color="#00ff88"
      />
      <InteractivePanel
        position={[7, 3, -7]}
        label="آکادمی"
        onClick={onAcademyClick}
        color="#00f0ff"
      />
      
      <ContactShadows opacity={0.3} scale={25} blur={3} far={5} />
    </>
  );
}

// Shop View
function ShopView({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative w-full h-screen bg-dark-bg">
      <button
        onClick={onBack}
        className="absolute top-4 right-4 z-50 btn-primary"
      >
        بازگشت به کافه
      </button>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black text-gradient mb-4">فروشگاه</h1>
          <p className="text-dark-text-secondary text-xl">محصولات به زودی اضافه می‌شوند</p>
        </div>
      </div>
    </div>
  );
}

// Academy View
function AcademyView({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative w-full h-screen bg-dark-bg">
      <button
        onClick={onBack}
        className="absolute top-4 right-4 z-50 btn-primary"
      >
        بازگشت به کافه
      </button>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black text-gradient mb-4">آکادمی</h1>
          <p className="text-dark-text-secondary text-xl">دوره‌های آموزشی به زودی اضافه می‌شوند</p>
        </div>
      </div>
    </div>
  );
}

// Main Component
const Cafe3D: React.FC = () => {
  const [viewMode, setViewMode] = useState<'explore' | 'shop' | 'academy'>('explore');
  const [error, setError] = useState<string | null>(null);

  const handleShopClick = useCallback(() => {
    setViewMode('shop');
  }, []);

  const handleAcademyClick = useCallback(() => {
    setViewMode('academy');
  }, []);

  const handleBack = useCallback(() => {
    setViewMode('explore');
  }, []);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('3D Scene Error:', event.error);
      setError('خطا در بارگذاری صحنه سه بعدی');
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="w-full h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            بارگذاری مجدد
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'shop') {
    return <ShopView onBack={handleBack} />;
  }

  if (viewMode === 'academy') {
    return <AcademyView onBack={handleBack} />;
  }

  return (
    <div className="relative w-full h-screen bg-dark-bg overflow-hidden" style={{ marginTop: 0 }}>
      <div className="absolute top-4 left-4 z-50 glass px-6 py-4 rounded-lg border border-neon-green/30 pointer-events-auto">
        <h2 className="text-neon-green font-bold mb-2">کافه مارگارت</h2>
        <p className="text-dark-text-secondary text-sm">
          برای حرکت: کلیک و بکشید | روی پنل‌های سبز و آبی کلیک کنید
        </p>
      </div>

      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neon-green border-t-transparent mx-auto mb-4"></div>
            <p className="text-dark-text-secondary text-xl">در حال بارگذاری کافه...</p>
          </div>
        </div>
      }>
        <Canvas
          shadows
          camera={{ position: [0, 3, 10], fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <CafeScene onShopClick={handleShopClick} onAcademyClick={handleAcademyClick} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={20}
              enableDamping
              dampingFactor={0.05}
            />
            <PerspectiveCamera makeDefault position={[0, 3, 10]} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Cafe3D;
