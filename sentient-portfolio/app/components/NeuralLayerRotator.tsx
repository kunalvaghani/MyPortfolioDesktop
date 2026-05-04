"use client";

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import NeuralOrganism from '@/app/components/NeuralOrganism';
import SkillNeuralGraph from '@/app/components/SkillNeuralGraph';
import MemoryViewer from '@/app/components/MemoryViewer';
import SimulationViewer from '@/app/components/SimulationViewer';
import { useSessionStorage } from '@/app/hooks/useSessionStorage';
import { useMentalState } from '@/app/hooks/useMentalState';
import GlassCard from '@/app/components/GlassCard';
import skillsData from '@/app/data/skills';
import memoriesData from '@/app/data/memories';
import simulationsData from '@/app/data/simulations';

interface NeuralLayerRotatorProps {
  mode: 'observer' | 'recruiter';
}

// Define the four layers along with human friendly titles and
// individual colour schemes. Colours are used to set CSS variables
// whenever the current layer changes. Additional properties could
// easily be added (e.g. sound ambience file names) if needed.
const layers = [
  {
    id: 0,
    key: 'perception',
    title: 'Perception',
    description: 'Data Analysis',
    colours: {
      primary: '#00F0FF',
      secondary: '#7B61FF',
      accent: '#00FF9C',
    },
  },
  {
    id: 1,
    key: 'decision',
    title: 'Decision',
    description: 'Machine Learning',
    colours: {
      primary: '#7B61FF',
      secondary: '#00FF9C',
      accent: '#00F0FF',
    },
  },
  {
    id: 2,
    key: 'simulation',
    title: 'Simulation',
    description: 'Game & Engine',
    colours: {
      primary: '#00FF9C',
      secondary: '#00F0FF',
      accent: '#7B61FF',
    },
  },
  {
    id: 3,
    key: 'expression',
    title: 'Expression',
    description: 'Web & Systems',
    colours: {
      primary: '#FF7BF7',
      secondary: '#00F0FF',
      accent: '#00FF9C',
    },
  },
];

export default function NeuralLayerRotator({ mode }: NeuralLayerRotatorProps) {
  const [layer, setLayer] = useState(0);
  const [visited, setVisited] = useSessionStorage<number[]>('sentient-visited-layers', []);
  const { state: mentalState, stabilise } = useMentalState();

  // Update visited layers when the current layer changes.
  useEffect(() => {
    if (!visited.includes(layer)) {
      setVisited([...visited, layer]);
    }
  }, [layer, visited, setVisited]);

  // Update CSS variables to reflect the layer's colour scheme.
  useEffect(() => {
    const root = document.documentElement;
    const c = layers[layer].colours;
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-accent', c.accent);
  }, [layer]);

  // Allow the visitor to rotate through the layers via wheel input.
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 30) return;
      e.preventDefault();
      setLayer((prev) => {
        if (e.deltaY > 0) return Math.min(layers.length - 1, prev + 1);
        return Math.max(0, prev - 1);
      });
    }
    // Use passive: false to be able to preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Provide a keyboard fallback for accessibility (arrow keys)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        setLayer((l) => Math.min(layers.length - 1, l + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setLayer((l) => Math.max(0, l - 1));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Filter data by current layer
  const currentLayerKey = layers[layer].key;
  const skills = skillsData.filter((s) => s.layers.includes(currentLayerKey));
  const memories = memoriesData.filter((m) => m.layer === currentLayerKey);
  const simulations = simulationsData.filter((s) => s.layer === currentLayerKey);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Central organism. The rotation is driven by the layer index. */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: layer * 90 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <NeuralOrganism layer={layer} mode={mode} mentalState={mentalState} />
      </motion.div>
      {/* HUD overlay for mode, mental state and layer compass */}
      <HUD
        layer={layer}
        mode={mode}
        mentalState={mentalState}
        stabilise={stabilise}
      />
      {/* Content overlay. On desktop this appears along the bottom third; on
          mobile it becomes a bottom sheet. */}
      <div className="absolute inset-x-0 bottom-0 md:bottom-4 md:left-4 md:right-4 z-20 pointer-events-none">
        <LayerContent
          layer={layer}
          skills={skills}
          memories={memories}
          simulations={simulations}
        />
      </div>
    </div>
  );
}

interface HUDProps {
  layer: number;
  mode: 'observer' | 'recruiter';
  mentalState: string;
  stabilise: () => void;
}

function HUD({ layer, mode, mentalState, stabilise }: HUDProps) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 text-xs uppercase font-mono z-30">
      <GlassCard className="px-3 py-1 text-[10px] tracking-wider bg-white/5">
        MODE: {mode === 'observer' ? 'Observer' : 'Recruiter'}
      </GlassCard>
      <GlassCard className="px-3 py-1 text-[10px] tracking-wider bg-white/5">
        MENTAL&nbsp;STATE: {mentalState}
      </GlassCard>
      <button
        onClick={stabilise}
        className="mt-1 px-3 py-1 bg-primary/20 text-primary rounded shadow-md backdrop-blur-md text-[10px] hover:bg-primary/30 transition-colors"
      >
        Stabilise Core
      </button>
      <div className="flex gap-1 mt-1">
        {layers.map((l) => (
          <span
            key={l.id}
            className={
              l.id === layer
                ? 'w-2 h-2 rounded-full bg-primary shadow-inner'
                : 'w-2 h-2 rounded-full bg-white/20'
            }
          ></span>
        ))}
      </div>
    </div>
  );
}

interface LayerContentProps {
  layer: number;
  skills: typeof skillsData;
  memories: typeof memoriesData;
  simulations: typeof simulationsData;
}

/**
 * LayerContent displays contextually relevant data for the current
 * layer. Each layer surfaces a neural skill graph and either a
 * memory viewer (for ML, data and expression layers) or a
 * simulation viewer (for simulation layer). The container is
 * pointer-events-none so that underlying scroll/wheel events still
 * propagate; child components set pointer-events-auto where
 * necessary.
 */
function LayerContent({ layer, skills, memories, simulations }: LayerContentProps) {
  const isSimulationLayer = layers[layer].key === 'simulation';
  return (
    <div className="relative w-full pointer-events-none">
      {/* Skills graph appears on the left on larger screens. */}
      <div className="md:absolute md:left-0 md:bottom-0 md:w-1/2 md:h-64 pointer-events-auto p-2">
        <GlassCard className="w-full h-full overflow-hidden">
          <SkillNeuralGraph skills={skills} />
        </GlassCard>
      </div>
      {/* Either memory viewer or simulation viewer appears on the right */}
      <div className="md:absolute md:right-0 md:bottom-0 md:w-1/2 md:h-64 pointer-events-auto p-2">
        <GlassCard className="w-full h-full overflow-hidden">
          {isSimulationLayer ? (
            <SimulationViewer simulations={simulations} />
          ) : (
            <MemoryViewer memories={memories} />
          )}
        </GlassCard>
      </div>
    </div>
  );
}