"use client";

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import GlassCard from '@/app/components/GlassCard';

export interface Simulation {
  id: string;
  name: string;
  layer: string;
  status: 'active' | 'dormant';
  fps: number;
  stability: number;
  agentCount: number;
  renderQuality: string;
  description: string;
  trailer?: string; // url to trailer
  metrics: Record<string, string>;
}

interface SimulationViewerProps {
  simulations: Simulation[];
}

/**
 * SimulationViewer displays game/engine projects as simulations with
 * live telemetry. Active simulations show higher FPS and agent counts
 * whereas dormant ones appear subdued. Clicking a simulation opens
 * a full screen detail view with a trailer and extended metrics.
 */
export default function SimulationViewer({ simulations }: SimulationViewerProps) {
  const [active, setActive] = useState<Simulation | null>(null);
  return (
    <div className="relative w-full h-full overflow-x-auto flex items-stretch gap-4 py-4">
      {simulations.map((sim) => (
        <motion.div
          key={sim.id}
          className="relative w-64 flex-shrink-0 cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * Math.random() }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setActive(sim)}
        >
          <GlassCard className="p-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading text-sm text-primary">{sim.name}</span>
                <span
                  className={
                    sim.status === 'active'
                      ? 'text-[10px] uppercase px-1 py-0.5 bg-accent/30 text-accent rounded'
                      : 'text-[10px] uppercase px-1 py-0.5 bg-secondary/20 text-secondary rounded'
                  }
                >
                  {sim.status}
                </span>
              </div>
              <div className="text-[10px] text-white/70 mb-2 h-8 overflow-hidden">
                {sim.description}
              </div>
            </div>
            <div className="text-[10px] text-white/80 space-y-1">
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className="text-primary">{sim.fps.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Stability:</span>
                <span className="text-primary">{Math.round(sim.stability * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Agents:</span>
                <span className="text-primary">{sim.agentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Render:</span>
                <span className="text-primary">{sim.renderQuality}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
      {/* Full screen overlay for active simulation */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-2xl w-full mx-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <h3 className="font-heading text-lg text-primary mb-2">{active.name}</h3>
                <button onClick={() => setActive(null)} className="text-xs text-secondary hover:underline">
                  Close
                </button>
              </div>
              {/* Trailer placeholder */}
              <div className="relative w-full h-48 mb-3 bg-black flex items-center justify-center">
                {active.trailer ? (
                  <video
                    src={active.trailer}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-secondary text-xs">Simulation trailer unavailable</div>
                )}
              </div>
              <p className="text-xs text-white/80 mb-2">{active.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                {Object.entries(active.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-secondary mr-1">{k}</span>
                    <span className="text-primary">{v}</span>
                  </div>
                ))}
              </div>
              {active.github || active.demo ? (
                <div className="flex gap-3 mt-2">
                  {active.github && (
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary text-xs"
                    >
                      GitHub
                    </a>
                  )}
                  {active.demo && (
                    <a
                      href={active.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary text-xs"
                    >
                      Demo
                    </a>
                  )}
                </div>
              ) : null}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}