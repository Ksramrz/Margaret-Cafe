'use client';

import React, { useRef, useState, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// Performance optimization: Memoized lighting
const CafeLighting = React.memo(() => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffaa44" />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#aaffaa" />
    </>
  );
});
CafeLighting.displayName = 'CafeLighting';

// Floor Component - Optimized
const Floor = React.memo(() => {
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
});
Floor.displayName = 'Floor';

// Wall Component - Optimized
const Wall = React.memo(({ position, rotation, size = [20, 4] }: any) => {
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
});
Wall.displayName = 'Wall';

// Table Component - Optimized with instancing
const Table = React.memo(({ position, rotation = [0, 0, 0] }: any) => {
  const group = useRef<THREE.Group>(null);
  
  const legPositions = useMemo((): [number, number, number][] => 
    [[-0.9, 0, -0.4], [0.9, 0, -0.4], [-0.9, 0, 0.4], [0.9, 0, 0.4]],
    []
  );
  
  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#4a3420" />
        </mesh>
      ))}
    </group>
  );
});
Table.displayName = 'Table';

// Chair Component - Optimized
const Chair = React.memo(({ position, rotation = [0, 0, 0] }: any) => {
  const legPositions = useMemo((): [number, number, number][] => 
    [[-0.25, 0, -0.25], [0.25, 0, -0.25], [-0.25, 0, 0.25], [0.25, 0, 0.25]],
    []
  );
  
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0, 0.7, -0.25]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#4a3420" />
        </mesh>
      ))}
    </group>
  );
});
Chair.displayName = 'Chair';

// Coffee Cup Component - Optimized
const CoffeeCup = React.memo(({ position, steaming = false }: any) => {
  const cupRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cupRef.current && steaming) {
      cupRef.current.rotation.y += 0.01;
    }
    if (steamRef.current && steaming) {
      steamRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const steamPositions = useMemo(() => [0, 0.25, 0.5], []);

  return (
    <group position={position}>
      <mesh ref={cupRef} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {steaming && (
        <group ref={steamRef}>
          {steamPositions.map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
});
CoffeeCup.displayName = 'CoffeeCup';

// Counter Component - Optimized
const Counter = React.memo(() => {
  return (
    <group position={[-3, 0, -8]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.2, 1.5]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[6, 1, 1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <mesh position={[-1, 1.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <CoffeeCup position={[1, 1.2, 0]} steaming={true} />
    </group>
  );
});
Counter.displayName = 'Counter';

// Interactive Panel Component - Optimized
const InteractivePanel = React.memo(({ position, label, onClick, color = "#ffaa44" }: any) => {
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
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
});
InteractivePanel.displayName = 'InteractivePanel';

// Loading Fallback
function CafeLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b7355" />
    </mesh>
  );
}

// Main Scene Component - Optimized
function CafeScene({ onShopClick, onAcademyClick }: any) {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  // Memoize table/chair configurations
  const tableConfigs = useMemo(() => [
    { position: [-4, 0, -2], chairs: [
      { position: [-4.8, 0, -2], rotation: [0, Math.PI / 4, 0] },
      { position: [-3.2, 0, -2], rotation: [0, -Math.PI / 4, 0] }
    ]},
    { position: [4, 0, -2], chairs: [
      { position: [3.2, 0, -2], rotation: [0, Math.PI / 4, 0] },
      { position: [4.8, 0, -2], rotation: [0, -Math.PI / 4, 0] }
    ]},
    { position: [0, 0, 2], chairs: [
      { position: [-0.8, 0, 2], rotation: [0, Math.PI / 4, 0] },
      { position: [0.8, 0, 2], rotation: [0, -Math.PI / 4, 0] }
    ]}
  ], []);

  const wallConfigs = useMemo(() => [
    { position: [0, 2, -10] },
    { position: [-10, 2, 0], rotation: [0, Math.PI / 2, 0] },
    { position: [10, 2, 0], rotation: [0, Math.PI / 2, 0] }
  ], []);

  return (
    <>
      <CafeLighting />
      <Floor />
      
      {wallConfigs.map((wall, i) => (
        <Wall key={i} {...wall} />
      ))}
      
      {tableConfigs.map((config, i) => (
        <React.Fragment key={i}>
          <Table position={config.position} />
          {config.chairs.map((chair, j) => (
            <Chair key={j} position={chair.position} rotation={chair.rotation} />
          ))}
          <CoffeeCup position={[config.position[0], 0.9, config.position[2]]} />
        </React.Fragment>
      ))}
      
      <Counter />
      
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
      
      <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />
    </>
  );
}

// Shop View Component
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

// Academy View Component
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

// Main 3D Cafe Component - Optimized with error boundary
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

  // Error boundary
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
    <div className="relative w-full h-screen bg-dark-bg overflow-hidden">
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
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]} // Adaptive pixel ratio
        >
          <Suspense fallback={<CafeLoader />}>
            <CafeScene onShopClick={handleShopClick} onAcademyClick={handleAcademyClick} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={15}
              enableDamping
              dampingFactor={0.05}
            />
            <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Cafe3D;
