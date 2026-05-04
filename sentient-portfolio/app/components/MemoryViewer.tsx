"use client";

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import GlassCard from '@/app/components/GlassCard';

export interface Memory {
  id: string;
  name: string;
  layer: string;
  tags: string[];
  confidence: number; // 0 → 1
  emotion: string;
  stability: number; // 0 → 1
  description: string;
  tech: string[];
  metrics: Record<string, string>;
  github?: string;
  demo?: string;
}

interface MemoryViewerProps {
  memories: Memory[];
}

/**
 * MemoryViewer visualises projects as floating memory fragments. Each
 * memory is rendered as a circular confidence ring with floating
 * tags. Clicking on a fragment initiates a loading sequence and
 * reveals detailed project information. Open memories are marked
 * as recalled in the session so they can be highlighted on return.
 */
export default function MemoryViewer({ memories }: MemoryViewerProps) {
  const [active, setActive] = useState<Memory | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // When a memory is activated, run a small loading sequence
  useEffect(() => {
    if (!active) return;
    setLoadingStep(0);
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setLoadingStep(1), 500));
    timers.push(setTimeout(() => setLoadingStep(2), 1000));
    timers.push(setTimeout(() => setLoadingStep(3), 1500));
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [active]);

  return (
    <div className="relative w-full h-full overflow-x-auto flex items-center justify-start space-x-4 py-4">
      {memories.map((memory) => (
        <motion.div
          key={memory.id}
          className="relative flex flex-col items-center cursor-pointer"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 * Math.random() }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setActive(memory)}
        >
          {/* Circular confidence ring */}
          <svg width="72" height="72" className="mb-2">
            <circle
              cx="36"
              cy="36"
              r="32"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="36"
              cy="36"
              r="32"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={Math.PI * 64}
              strokeDashoffset={Math.PI * 64 * (1 - memory.confidence)}
              animate={{ strokeDashoffset: Math.PI * 64 * (1 - memory.confidence) }}
              transition={{ duration: 1.2 }}
            />
          </svg>
          {/* Floating tags */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-secondary/20 text-secondary rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-xs text-center font-heading whitespace-nowrap">
            {memory.name}
          </div>
        </motion.div>
      ))}
      {/* Details overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-md w-full mx-4">
              {loadingStep < 3 ? (
                <LoadingSequence memory={active} step={loadingStep} onClose={() => setActive(null)} />
              ) : (
                <MemoryDetails memory={active} onClose={() => setActive(null)} />
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Sequence shown when loading a memory. Displays lines of text
 * sequentially to emulate a memory recall process.
 */
function LoadingSequence({ memory, step, onClose }: { memory: Memory; step: number; onClose: () => void }) {
  return (
    <div className="p-4 text-xs font-mono space-y-1">
      <div className="text-primary">Loading Memory {memory.id}</div>
      {step >= 1 && <div>Emotion: {memory.emotion}</div>}
      {step >= 2 && <div>Stability: {Math.round(memory.stability * 100)}%</div>}
      {step >= 2 && <div className="text-right mt-2 text-secondary cursor-pointer" onClick={onClose}>Cancel</div>}
    </div>
  );
}

/** Detailed memory view shown once the loading sequence completes. */
function MemoryDetails({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <div className="p-4 text-sm">
      <div className="flex justify-between items-start">
        <h3 className="font-heading text-lg text-primary mb-2">{memory.name}</h3>
        <button
          onClick={onClose}
          className="text-xs text-secondary hover:underline"
        >
          Close
        </button>
      </div>
      <p className="mb-3 text-white/80 text-xs leading-relaxed">{memory.description}</p>
      <div className="mb-2">
        <span className="font-medium mr-1">Technologies:</span>
        {memory.tech.join(', ')}
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        {Object.entries(memory.metrics).map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-secondary mr-1">{k}</span>
            <span className="text-primary">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-3">
        {memory.github && (
          <a
            href={memory.github}
            target="_blank"
            className="underline text-primary text-xs"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}
        {memory.demo && (
          <a
            href={memory.demo}
            target="_blank"
            className="underline text-primary text-xs"
            rel="noopener noreferrer"
          >
            Demo
          </a>
        )}
      </div>
    </div>
  );
}