"use client";

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';
import { MentalState } from '@/app/hooks/useMentalState';

// Reuse the layer definitions from NeuralLayerRotator to assign
// colour palettes to the organism. Imported here to avoid
// duplication of values; if you change colours in the rotator they
// will automatically update the organism.
const layerDefinitions = [
  {
    primary: '#00F0FF',
    secondary: '#7B61FF',
    accent: '#00FF9C',
  },
  {
    primary: '#7B61FF',
    secondary: '#00FF9C',
    accent: '#00F0FF',
  },
  {
    primary: '#00FF9C',
    secondary: '#00F0FF',
    accent: '#7B61FF',
  },
  {
    primary: '#FF7BF7',
    secondary: '#00F0FF',
    accent: '#00FF9C',
  },
];

interface NeuralOrganismProps {
  layer: number;
  mode: 'observer' | 'recruiter';
  mentalState: MentalState;
}

/**
 * NeuralOrganism renders the abstract neural entity at the heart of
 * the portfolio. On desktop it uses a 3D torus knot animated via
 * react‑three‑fiber. On mobile it falls back to a 2D canvas that
 * draws a swirling line. The rotation speed is modulated by the
 * current mental state to give immediate feedback to the user's
 * actions.
 */
export default function NeuralOrganism({ layer, mentalState }: NeuralOrganismProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const palette = layerDefinitions[layer % layerDefinitions.length];
  const colour = palette.primary;
  // Determine a speed multiplier based on mental state
  const speed = (() => {
    switch (mentalState) {
      case 'overstimulated':
        return 2.5;
      case 'curious':
        return 1.5;
      case 'focused':
        return 1.0;
      case 'idle':
        return 0.4;
      case 'calm':
      default:
        return 0.6;
    }
  })();

  if (isMobile) {
    return <NeuralOrganism2D colour={colour} speed={speed} />;
  }
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
      <ambientLight intensity={0.3} />
      {/* Provide multiple coloured lights to create interesting
          reflections on the torus knot. */}
      <pointLight position={[3, 3, 3]} intensity={0.8} color={palette.primary} />
      <pointLight position={[-3, -3, 3]} intensity={0.6} color={palette.secondary} />
      <pointLight position={[3, -3, -3]} intensity={0.4} color={palette.accent} />
      <RotatingTorus colour={colour} speed={speed} />
    </Canvas>
  );
}

interface RotatingTorusProps {
  colour: string;
  speed: number;
}

function RotatingTorus({ colour, speed }: RotatingTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    // Rotate on multiple axes; speed multiplier makes rotations more
    // vigorous when the mental state is agitated.
    meshRef.current.rotation.x += delta * 0.3 * speed;
    meshRef.current.rotation.y += delta * 0.2 * speed;
    meshRef.current.rotation.z += delta * 0.1 * speed;
  });
  return (
    <mesh ref={meshRef} scale={[1.2, 1.2, 1.2]}>
      <torusKnotGeometry args={[1, 0.35, 256, 32]} />
      <meshStandardMaterial
        color={colour}
        emissive={colour}
        emissiveIntensity={0.7}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

/**
 * A 2D fallback for mobile devices. Instead of a 3D object this
 * component draws a swirling line on a canvas. The line rotates
 * around the centre and pulses with the mental state speed.
 */
function NeuralOrganism2D({ colour, speed }: { colour: string; speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let rotation = 0;
    function render() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      rotation += 0.005 * speed;
      ctx.rotate(rotation);
      ctx.beginPath();
      const points = 200;
      const radius = Math.min(width, height) * 0.25;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = radius + Math.sin(angle * 6 + rotation * 3) * 20;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = colour;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
      animationId = requestAnimationFrame(render);
    }
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [colour, speed]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}