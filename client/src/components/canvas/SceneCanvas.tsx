import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SwissVaultCore } from './SwissVaultCore';

export const SceneCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      <Canvas
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)]}
        camera={{ position: [0, 0, 6.8], fov: isMobile ? 52 : 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* ─── Swiss Precision Studio Lighting Rig ─── */}
        {/* Deep architectural ambient */}
        <ambientLight intensity={0.35} color="#a1a1aa" />

        {/* Sharp Stark-White Rim Strip 1 */}
        <directionalLight position={[7, 6, 4]} intensity={4.0} color="#ffffff" />

        {/* Sharp Stark-White Rim Strip 2 */}
        <directionalLight position={[-7, -6, -4]} intensity={4.5} color="#ffffff" />

        {/* Focused Overhead Key Spotlight */}
        <spotLight
          position={[0, 8, 3]}
          intensity={2.8}
          color="#f4f4f5"
          angle={0.55}
          penumbra={0.7}
        />

        {/* Swiss Emerald Core Glint */}
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#00FF66" distance={5} />

        {/* Precision Torus-Monolith Artifact */}
        <SwissVaultCore isMobile={isMobile} />
      </Canvas>
    </div>
  );
};
