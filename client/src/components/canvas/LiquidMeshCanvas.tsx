import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LiquidMeshCanvasProps {
  isMobile: boolean;
}

export const LiquidMeshCanvas: React.FC<LiquidMeshCanvasProps> = ({ isMobile }) => {
  const masterGroup = useRef<THREE.Group>(null);
  const mainMeshRef = useRef<THREE.Mesh>(null);
  const secondaryMeshRef = useRef<THREE.Mesh>(null);
  const ribbonMeshRef = useRef<THREE.Mesh>(null);
  const bubblesGroup = useRef<THREE.Group>(null);

  // Mouse velocity tracking
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 });

  // Store original geometry positions for harmonic fluid wave displacement
  const originalPositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.6, 28);
    return geo.attributes.position.clone();
  }, []);

  // Floating kinetic satellite bubbles
  const bubbles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return {
        radius: 2.2 + (i % 3) * 0.4,
        speed: 0.4 + (i % 4) * 0.2,
        phase: angle,
        elevation: ((i % 3) - 1) * 0.8,
        size: 0.12 + (i % 3) * 0.06,
        color: i % 2 === 0 ? '#CCFF00' : '#FF4D29',
      };
    });
  }, []);

  // GSAP ScrollTrigger orchestration across sections
  const scrollState = useRef({
    x: isMobile ? 0 : 1.4,
    y: isMobile ? 0.2 : 0,
    z: isMobile ? -2.2 : 0,
    scale: isMobile ? 0.6 : 1.05,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isSmall = window.innerWidth < 768;

      const heroTarget = {
        x: isSmall ? 0 : 1.4,
        y: isSmall ? 0.3 : 0,
        z: isSmall ? -2.2 : 0,
        scale: isSmall ? 0.55 : 1.1,
        rotX: 0.1,
        rotY: -0.2,
        rotZ: 0.05,
      };

      const projectsTarget = {
        x: isSmall ? 0 : -2.0,
        y: isSmall ? 0.2 : -0.1,
        z: isSmall ? -2.8 : -0.3,
        scale: isSmall ? 0.5 : 0.95,
        rotX: -0.2,
        rotY: 1.5,
        rotZ: -0.15,
      };

      const creamTarget = {
        x: isSmall ? 0 : 2.2,
        y: isSmall ? 0.2 : 0,
        z: isSmall ? -2.8 : -0.4,
        scale: isSmall ? 0.5 : 0.95,
        rotX: 0.3,
        rotY: 3.1,
        rotZ: 0.2,
      };

      const contactTarget = {
        x: 0,
        y: isSmall ? -0.2 : -0.3,
        z: isSmall ? -3.0 : -1.0,
        scale: isSmall ? 0.45 : 0.85,
        rotX: 0.1,
        rotY: 4.8,
        rotZ: 0,
      };

      Object.assign(scrollState.current, heroTarget);

      // Hero -> Projects
      ScrollTrigger.create({
        trigger: '#projects',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.current.x = THREE.MathUtils.lerp(heroTarget.x, projectsTarget.x, p);
          scrollState.current.y = THREE.MathUtils.lerp(heroTarget.y, projectsTarget.y, p);
          scrollState.current.z = THREE.MathUtils.lerp(heroTarget.z, projectsTarget.z, p);
          scrollState.current.scale = THREE.MathUtils.lerp(heroTarget.scale, projectsTarget.scale, p);
          scrollState.current.rotX = THREE.MathUtils.lerp(heroTarget.rotX, projectsTarget.rotX, p);
          scrollState.current.rotY = THREE.MathUtils.lerp(heroTarget.rotY, projectsTarget.rotY, p);
          scrollState.current.rotZ = THREE.MathUtils.lerp(heroTarget.rotZ, projectsTarget.rotZ, p);
        },
      });

      // Projects -> Experience/About (Cream Section)
      ScrollTrigger.create({
        trigger: '#education',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.current.x = THREE.MathUtils.lerp(projectsTarget.x, creamTarget.x, p);
          scrollState.current.y = THREE.MathUtils.lerp(projectsTarget.y, creamTarget.y, p);
          scrollState.current.z = THREE.MathUtils.lerp(projectsTarget.z, creamTarget.z, p);
          scrollState.current.scale = THREE.MathUtils.lerp(projectsTarget.scale, creamTarget.scale, p);
          scrollState.current.rotX = THREE.MathUtils.lerp(projectsTarget.rotX, creamTarget.rotX, p);
          scrollState.current.rotY = THREE.MathUtils.lerp(projectsTarget.rotY, creamTarget.rotY, p);
          scrollState.current.rotZ = THREE.MathUtils.lerp(projectsTarget.rotZ, creamTarget.rotZ, p);
        },
      });

      // Cream Section -> Contact
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        end: 'top center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.current.x = THREE.MathUtils.lerp(creamTarget.x, contactTarget.x, p);
          scrollState.current.y = THREE.MathUtils.lerp(creamTarget.y, contactTarget.y, p);
          scrollState.current.z = THREE.MathUtils.lerp(creamTarget.z, contactTarget.z, p);
          scrollState.current.scale = THREE.MathUtils.lerp(creamTarget.scale, contactTarget.scale, p);
          scrollState.current.rotX = THREE.MathUtils.lerp(creamTarget.rotX, contactTarget.rotX, p);
          scrollState.current.rotY = THREE.MathUtils.lerp(creamTarget.rotY, contactTarget.rotY, p);
          scrollState.current.rotZ = THREE.MathUtils.lerp(creamTarget.rotZ, contactTarget.rotZ, p);
        },
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!masterGroup.current || !mainMeshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Mouse velocity calculation for fluid reaction
    mouse.current.targetX = state.pointer.x;
    mouse.current.targetY = state.pointer.y;
    mouse.current.vx = (mouse.current.targetX - mouse.current.x) * 0.15;
    mouse.current.vy = (mouse.current.targetY - mouse.current.y) * 0.15;
    mouse.current.x += mouse.current.vx;
    mouse.current.y += mouse.current.vy;

    const velocityMag = Math.sqrt(mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy) * 8;

    // Master Group positioning
    masterGroup.current.position.x = THREE.MathUtils.lerp(
      masterGroup.current.position.x,
      scrollState.current.x,
      delta * 4
    );
    masterGroup.current.position.y = THREE.MathUtils.lerp(
      masterGroup.current.position.y,
      scrollState.current.y + Math.sin(t * 1.2) * 0.08,
      delta * 4
    );
    masterGroup.current.position.z = THREE.MathUtils.lerp(
      masterGroup.current.position.z,
      scrollState.current.z,
      delta * 4
    );

    const s = scrollState.current.scale;
    masterGroup.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 4);

    // Dynamic rotation with mouse tilt
    const targetRotX = scrollState.current.rotX + mouse.current.y * -0.25;
    const targetRotY = scrollState.current.rotY + mouse.current.x * 0.35 + t * 0.12;
    const targetRotZ = scrollState.current.rotZ + mouse.current.x * 0.08;

    masterGroup.current.rotation.x = THREE.MathUtils.lerp(masterGroup.current.rotation.x, targetRotX, delta * 3);
    masterGroup.current.rotation.y = THREE.MathUtils.lerp(masterGroup.current.rotation.y, targetRotY, delta * 3);
    masterGroup.current.rotation.z = THREE.MathUtils.lerp(masterGroup.current.rotation.z, targetRotZ, delta * 3);

    // Kinetic Liquid-Metal Vertex Morphing
    const geo = mainMeshRef.current.geometry;
    const pos = geo.attributes.position;
    const orig = originalPositions;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const ox = orig.getX(i);
      const oy = orig.getY(i);
      const oz = orig.getZ(i);

      // Multi-frequency harmonic wave with mouse velocity ripple
      const wave =
        Math.sin(ox * 2.2 + t * 2.5) * 0.14 +
        Math.cos(oy * 2.4 - t * 2.0) * 0.14 +
        Math.sin(oz * 2.0 + t * 1.8) * 0.14 +
        Math.sin(ox * 5.0 + oy * 5.0 + t * 4.0) * (0.04 + velocityMag * 0.12);

      const factor = 1 + wave;
      pos.setXYZ(i, ox * factor, oy * factor, oz * factor);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    // Kinetic Outer Rings / Fluid Ribbons
    if (secondaryMeshRef.current) {
      secondaryMeshRef.current.rotation.x = t * 0.35;
      secondaryMeshRef.current.rotation.y = -t * 0.25;
    }
    if (ribbonMeshRef.current) {
      ribbonMeshRef.current.rotation.y = t * 0.4;
      ribbonMeshRef.current.rotation.z = Math.sin(t * 0.8) * 0.2;
    }

    // Floating Interactive Bubbles
    if (bubblesGroup.current) {
      bubblesGroup.current.children.forEach((child, i) => {
        const b = bubbles[i];
        if (b) {
          const angle = b.phase + t * b.speed * 0.6;
          child.position.x = Math.cos(angle) * b.radius;
          child.position.z = Math.sin(angle) * b.radius;
          child.position.y = b.elevation + Math.sin(t * 2.0 + i) * 0.2;
          child.rotation.x = t * 0.8;
          child.rotation.y = t * 1.2;
        }
      });
    }
  });

  return (
    <group ref={masterGroup}>
      {/* ─── 1. Primary Glossy Iridescent Liquid-Metal Mesh ─── */}
      <mesh ref={mainMeshRef}>
        <icosahedronGeometry args={[1.6, 28]} />
        <meshPhysicalMaterial
          color="#0f1118"
          roughness={0.12}
          metalness={0.88}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transmission={0.2}
          ior={1.6}
          iridescence={1.0}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 800]}
          reflectivity={1.0}
        />
      </mesh>

      {/* ─── 2. Intersecting Fluid Ribbon Ring (Electric Lime Accent) ─── */}
      <mesh ref={secondaryMeshRef}>
        <torusGeometry args={[2.05, 0.035, 16, 90]} />
        <meshStandardMaterial
          color="#CCFF00"
          metalness={0.9}
          roughness={0.15}
          emissive="#CCFF00"
          emissiveIntensity={0.65}
        />
      </mesh>

      {/* ─── 3. Dynamic Twisted Ribbon (Electric Vermilion Accent) ─── */}
      <mesh ref={ribbonMeshRef}>
        <torusKnotGeometry args={[1.3, 0.03, 120, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#FF4D29"
          emissive="#FF4D29"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* ─── 4. Floating Kinetic Bubbles & Data Drops ─── */}
      <group ref={bubblesGroup}>
        {bubbles.map((b, i) => (
          <mesh key={i}>
            <sphereGeometry args={[b.size, 20, 20]} />
            <meshPhysicalMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1.0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
