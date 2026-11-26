import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SwissVaultCoreProps {
  isMobile: boolean;
}

export const SwissVaultCore: React.FC<SwissVaultCoreProps> = ({ isMobile }) => {
  const rootRef = useRef<THREE.Group>(null);
  const outerTorusRef = useRef<THREE.Mesh>(null);
  const innerCaliberRef = useRef<THREE.Group>(null);
  const coreMonolithRef = useRef<THREE.Mesh>(null);
  const dialRingRef = useRef<THREE.Mesh>(null);

  // Inertial mouse tracking
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Scroll choreographed transform targets
  const scrollTransform = useRef({
    x: 0,
    y: 0,
    z: 0,
    rotX: 0.15,
    rotY: 0,
    rotZ: 0,
    scale: isMobile ? 0.6 : 1.05,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isSmall = window.innerWidth < 768;

      const heroPos = {
        x: isSmall ? 0 : 1.6,
        y: isSmall ? 0.4 : 0,
        z: isSmall ? -2.2 : 0,
        rotX: 0.2,
        rotY: -0.35,
        rotZ: 0.1,
        scale: isSmall ? 0.55 : 1.1,
      };

      const eduPos = {
        x: isSmall ? 0 : -2.0,
        y: isSmall ? 0.2 : -0.1,
        z: isSmall ? -2.8 : -0.4,
        rotX: 0.4,
        rotY: 1.1,
        rotZ: -0.15,
        scale: isSmall ? 0.5 : 0.95,
      };

      const projPos = {
        x: isSmall ? 0 : 2.2,
        y: isSmall ? 0.2 : 0,
        z: isSmall ? -2.8 : -0.3,
        rotX: -0.15,
        rotY: 2.3,
        rotZ: 0.2,
        scale: isSmall ? 0.5 : 1.0,
      };

      const aboutPos = {
        x: isSmall ? 0 : -1.8,
        y: isSmall ? 0.2 : 0,
        z: isSmall ? -2.8 : -0.4,
        rotX: 0.3,
        rotY: 3.5,
        rotZ: -0.1,
        scale: isSmall ? 0.5 : 0.95,
      };

      const contactPos = {
        x: 0,
        y: isSmall ? -0.2 : -0.3,
        z: isSmall ? -3.0 : -1.0,
        rotX: 0.1,
        rotY: 4.8,
        rotZ: 0,
        scale: isSmall ? 0.45 : 0.85,
      };

      Object.assign(scrollTransform.current, heroPos);

      // Hero -> Education
      ScrollTrigger.create({
        trigger: '#education',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.4,
        onUpdate: (self) => {
          const p = self.progress;
          scrollTransform.current.x = THREE.MathUtils.lerp(heroPos.x, eduPos.x, p);
          scrollTransform.current.y = THREE.MathUtils.lerp(heroPos.y, eduPos.y, p);
          scrollTransform.current.z = THREE.MathUtils.lerp(heroPos.z, eduPos.z, p);
          scrollTransform.current.rotX = THREE.MathUtils.lerp(heroPos.rotX, eduPos.rotX, p);
          scrollTransform.current.rotY = THREE.MathUtils.lerp(heroPos.rotY, eduPos.rotY, p);
          scrollTransform.current.rotZ = THREE.MathUtils.lerp(heroPos.rotZ, eduPos.rotZ, p);
          scrollTransform.current.scale = THREE.MathUtils.lerp(heroPos.scale, eduPos.scale, p);
        },
      });

      // Education -> Projects
      ScrollTrigger.create({
        trigger: '#projects',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.4,
        onUpdate: (self) => {
          const p = self.progress;
          scrollTransform.current.x = THREE.MathUtils.lerp(eduPos.x, projPos.x, p);
          scrollTransform.current.y = THREE.MathUtils.lerp(eduPos.y, projPos.y, p);
          scrollTransform.current.z = THREE.MathUtils.lerp(eduPos.z, projPos.z, p);
          scrollTransform.current.rotX = THREE.MathUtils.lerp(eduPos.rotX, projPos.rotX, p);
          scrollTransform.current.rotY = THREE.MathUtils.lerp(eduPos.rotY, projPos.rotY, p);
          scrollTransform.current.rotZ = THREE.MathUtils.lerp(eduPos.rotZ, projPos.rotZ, p);
          scrollTransform.current.scale = THREE.MathUtils.lerp(eduPos.scale, projPos.scale, p);
        },
      });

      // Projects -> About
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.4,
        onUpdate: (self) => {
          const p = self.progress;
          scrollTransform.current.x = THREE.MathUtils.lerp(projPos.x, aboutTargetX(isSmall), p);
          scrollTransform.current.y = THREE.MathUtils.lerp(projPos.y, aboutPos.y, p);
          scrollTransform.current.z = THREE.MathUtils.lerp(projPos.z, aboutPos.z, p);
          scrollTransform.current.rotX = THREE.MathUtils.lerp(projPos.rotX, aboutPos.rotX, p);
          scrollTransform.current.rotY = THREE.MathUtils.lerp(projPos.rotY, aboutPos.rotY, p);
          scrollTransform.current.rotZ = THREE.MathUtils.lerp(projPos.rotZ, aboutPos.rotZ, p);
          scrollTransform.current.scale = THREE.MathUtils.lerp(projPos.scale, aboutPos.scale, p);
        },
      });

      function aboutTargetX(small: boolean) {
        return small ? 0 : aboutPos.x;
      }

      // About -> Contact
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.4,
        onUpdate: (self) => {
          const p = self.progress;
          scrollTransform.current.x = THREE.MathUtils.lerp(aboutPos.x, contactPos.x, p);
          scrollTransform.current.y = THREE.MathUtils.lerp(aboutPos.y, contactPos.y, p);
          scrollTransform.current.z = THREE.MathUtils.lerp(aboutPos.z, contactPos.z, p);
          scrollTransform.current.rotX = THREE.MathUtils.lerp(aboutPos.rotX, contactPos.rotX, p);
          scrollTransform.current.rotY = THREE.MathUtils.lerp(aboutPos.rotY, contactPos.rotY, p);
          scrollTransform.current.rotZ = THREE.MathUtils.lerp(aboutPos.rotZ, contactPos.rotZ, p);
          scrollTransform.current.scale = THREE.MathUtils.lerp(aboutPos.scale, contactPos.scale, p);
        },
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!rootRef.current) return;

    const t = state.clock.getElapsedTime();

    // Damped heavy mouse inertia
    mouseTarget.current.x = state.pointer.x;
    mouseTarget.current.y = state.pointer.y;
    currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, mouseTarget.current.x, delta * 2.2);
    currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, mouseTarget.current.y, delta * 2.2);

    // Root positioning
    rootRef.current.position.x = THREE.MathUtils.lerp(
      rootRef.current.position.x,
      scrollTransform.current.x,
      delta * 3.5
    );
    rootRef.current.position.y = THREE.MathUtils.lerp(
      rootRef.current.position.y,
      scrollTransform.current.y + Math.sin(t * 0.8) * 0.05,
      delta * 3.5
    );
    rootRef.current.position.z = THREE.MathUtils.lerp(
      rootRef.current.position.z,
      scrollTransform.current.z,
      delta * 3.5
    );

    const s = scrollTransform.current.scale;
    rootRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 3.5);

    // Damped luxury rotation with micro mouse parallax
    const targetRotX = scrollTransform.current.rotX + currentMouse.current.y * -0.15;
    const targetRotY = scrollTransform.current.rotY + currentMouse.current.x * 0.22 + t * 0.06;
    const targetRotZ = scrollTransform.current.rotZ;

    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, delta * 2.8);
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, delta * 2.8);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, targetRotZ, delta * 2.8);

    // Precision mechanical rotation
    if (outerTorusRef.current) {
      outerTorusRef.current.rotation.z = t * 0.12;
    }
    if (dialRingRef.current) {
      dialRingRef.current.rotation.z = -t * 0.18;
    }
    if (innerCaliberRef.current) {
      innerCaliberRef.current.rotation.y = t * 0.22;
      innerCaliberRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
    if (coreMonolithRef.current) {
      coreMonolithRef.current.rotation.y = -t * 0.15;
    }
  });

  return (
    <group ref={rootRef}>
      {/* ─── 1. Primary Precision Liquid-Chrome Torus Ring ─── */}
      <mesh ref={outerTorusRef}>
        <torusGeometry args={[1.75, 0.22, 32, 120]} />
        <meshPhysicalMaterial
          metalness={1.0}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          color="#18181b"
          reflectivity={1.0}
        />
      </mesh>

      {/* ─── 1b. Razor-thin Bezel Caliber Teeth / Index Notch Ring ─── */}
      <mesh ref={dialRingRef}>
        <torusGeometry args={[1.98, 0.015, 16, 120]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* ─── 2. Interlocking Inner Chronograph Mechanism ─── */}
      <group ref={innerCaliberRef}>
        {/* Secondary Angled Titanium Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.42, 0.06, 24, 80]} />
          <meshPhysicalMaterial
            metalness={0.98}
            roughness={0.12}
            color="#27272a"
            clearcoat={0.9}
          />
        </mesh>

        {/* Third Inner Ring */}
        <mesh rotation={[-Math.PI / 3.5, Math.PI / 4, 0]}>
          <torusGeometry args={[1.22, 0.04, 20, 80]} />
          <meshPhysicalMaterial
            metalness={0.98}
            roughness={0.14}
            color="#3f3f46"
            clearcoat={0.9}
          />
        </mesh>
      </group>

      {/* ─── 3. Central Dark Obsidian Monolith ─── */}
      <mesh ref={coreMonolithRef}>
        <octahedronGeometry args={[0.72, 0]} />
        <meshPhysicalMaterial
          metalness={0.94}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          color="#09090b"
        />
      </mesh>

      {/* ─── 4. High-Precision Swiss Emerald Laser Status Slit ─── */}
      <mesh position={[0, 0, 0.73]}>
        <boxGeometry args={[0.04, 0.45, 0.02]} />
        <meshStandardMaterial
          color="#00FF66"
          emissive="#00FF66"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* Counter Laser Slit */}
      <mesh position={[0, 0, -0.73]}>
        <boxGeometry args={[0.04, 0.45, 0.02]} />
        <meshStandardMaterial
          color="#00FF66"
          emissive="#00FF66"
          emissiveIntensity={3.5}
        />
      </mesh>
    </group>
  );
};
