"use client";

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import GlassCard from '@/app/components/GlassCard';

interface OriginSequenceProps {
  onComplete?: () => void;
}

/**
 * OriginSequence narrates the origin of the biological instance in a
 * faux boot terminal. Lines are typed sequentially with a blinking
 * cursor. Progress bars fill as the system initialises. At the
 * conclusion two actions are presented: returning to the cortex or
 * establishing a neural link. The optional onComplete callback
 * allows the parent to react when the sequence finishes.
 */
export default function OriginSequence({ onComplete }: OriginSequenceProps) {
  const lines = [
    'Initializing Core...',
    'Year 2002: Biological instance created.',
    'Primary Languages: Python, C++, JavaScript',
    'Simulation fascination detected.',
    'Primary objective: Build Intelligent Worlds.',
  ];
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function typeAll() {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let current = '';
        for (const ch of line) {
          if (cancelled) return;
          current += ch;
          setTypedLines((prev) => {
            const copy = [...prev];
            copy[i] = current;
            return copy;
          });
          await new Promise((r) => setTimeout(r, 30));
        }
        // After typing a line, add a progress bar for it
        setProgress((prev) => {
          const arr = [...prev];
          arr[i] = 0;
          return arr;
        });
        // Animate progress fill
        for (let p = 0; p <= 100; p += 2) {
          if (cancelled) return;
          setProgress((prev) => {
            const arr = [...prev];
            arr[i] = p;
            return arr;
          });
          await new Promise((r) => setTimeout(r, 10));
        }
      }
      setCompleted(true);
      if (onComplete) onComplete();
    }
    setTypedLines(Array(lines.length).fill(''));
    typeAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlassCard className="p-4 text-xs font-mono w-full">
      {typedLines.map((line, idx) => (
        <div key={idx} className="mb-2">
          <span>{line}</span>
          {idx === typedLines.length - 1 && !completed && <BlinkingCursor />}
          {progress[idx] !== undefined && (
            <div className="w-full h-1 bg-white/10 rounded mt-1 overflow-hidden">
              <div
                className="h-full bg-primary rounded"
                style={{ width: `${progress[idx]}%` }}
              ></div>
            </div>
          )}
        </div>
      ))}
      {completed && (
        <div className="mt-3 flex flex-col gap-2">
          <button
            className="px-3 py-1 bg-primary/20 text-primary rounded text-[10px] hover:bg-primary/30"
            onClick={() => onComplete && onComplete()}
          >
            Return to Cortex
          </button>
          <button
            className="px-3 py-1 bg-secondary/20 text-secondary rounded text-[10px] hover:bg-secondary/30"
            onClick={() => onComplete && onComplete()}
          >
            Establish Neural Link
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      className="ml-1 inline-block w-2 h-4 bg-primary"
      animate={{ opacity: [0, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  );
}