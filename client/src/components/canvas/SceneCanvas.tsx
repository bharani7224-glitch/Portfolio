import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { LiquidMeshCanvas } from './LiquidMeshCanvas';

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
        background: '#0A0A0A',
      }}
    >
      <Canvas
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)]}
        camera={{ position: [0, 0, 7.0], fov: isMobile ? 54 : 44 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* ─── Digital Panda High-Energy Studio Lighting ─── */}
        <ambientLight intensity={0.45} color="#22222e" />

        {/* Sharp White Overhead Spotlight */}
        <spotLight
          position={[5, 8, 5]}
          intensity={3.2}
          color="#ffffff"
          angle={0.65}
          penumbra={0.7}
        />

        {/* Electric Lime Accent Light */}
        <directionalLight position={[6, -4, 4]} intensity={3.6} color="#CCFF00" />

        {/* Electric Vermilion Accent Light */}
        <directionalLight position={[-6, 6, -3]} intensity={3.2} color="#FF4D29" />

        {/* Electric Cyan Rim Glint */}
        <directionalLight position={[0, -6, -4]} intensity={2.0} color="#00F0FF" />

        {/* Dynamic Iridescent Liquid-Metal Canvas */}
        <LiquidMeshCanvas isMobile={isMobile} />
      </Canvas>
    </div>
  );
};
