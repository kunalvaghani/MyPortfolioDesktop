"use client";

import React, { useEffect } from 'react';
import Intro from '@/app/components/Intro';
import NeuralLayerRotator from '@/app/components/NeuralLayerRotator';
import { useSessionStorage } from '@/app/hooks/useSessionStorage';

/**
 * NeuralCore orchestrates the high level flow of the portfolio. It
 * begins by showing the visitor an introductory sequence to
 * determine their intent (observe vs recruit). The choice is
 * persisted into sessionStorage so a returning visitor doesn't have
 * to repeat the intro. Once a choice has been made the main
 * application layer (NeuralLayerRotator) is rendered.
 */
export default function NeuralCore() {
  const [mode, setMode] = useSessionStorage<'observer' | 'recruiter' | undefined>('sentient-mode');

  // Respect prefers-reduced-motion by immediately skipping the intro on
  // subsequent visits. This helps users with motion sensitivity
  // bypass unnecessary animations after they have already chosen a
  // mode once.
  useEffect(() => {
    if (mode) return;
    if (typeof window !== 'undefined') {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        // Default to observer if user prefers less motion
        setMode('observer');
      }
    }
  }, [mode, setMode]);

  if (!mode) {
    return <Intro onSelectMode={(m) => setMode(m)} />;
  }
  return <NeuralLayerRotator mode={mode} />;
}