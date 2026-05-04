"use client";

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface IntroProps {
  onSelectMode: (mode: 'observer' | 'recruiter') => void;
}

/**
 * Intro renders the first contact sequence. It displays a series of
 * lines with cinematic timing and finally presents the visitor with
 * two choices: observe or recruit. A simple particle system floats
 * behind the copy to hint at the presence of a living system.
 */
export default function Intro({ onSelectMode }: IntroProps) {
  const [step, setStep] = useState(0);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Sequence the appearance of each line and the choices. Using
    // nested timeouts rather than intervals allows the copy to feel
    // more cinematic. Each timeout pushes the step forward by one.
    timeouts.current.push(setTimeout(() => setStep(1), 1500));
    timeouts.current.push(setTimeout(() => setStep(2), 3000));
    timeouts.current.push(setTimeout(() => setStep(3), 4500));
    return () => {
      timeouts.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <AnimatePresence>
          {step >= 0 && (
            <motion.p
              key="line1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl font-heading tracking-wide mb-2"
            >
              Unknown entity detected.
            </motion.p>
          )}
          {step >= 1 && (
            <motion.p
              key="line2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl font-heading tracking-wide mb-2 text-secondary"
            >
              Analyzing intent...
            </motion.p>
          )}
          {step >= 2 && (
            <motion.p
              key="line3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl font-heading tracking-wide mt-4"
            >
              Are you here to observe, or to recruit?
            </motion.p>
          )}
        </AnimatePresence>
        {/* Choices appear after the final line has been displayed */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <ChoiceButton onClick={() => onSelectMode('observer')}>
              Observe Intelligence
            </ChoiceButton>
            <ChoiceButton onClick={() => onSelectMode('recruiter')}>
              Initiate Contact
            </ChoiceButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Button styled as floating glass option used in the intro. */
function ChoiceButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'glass-card px-6 py-3 font-heading text-sm sm:text-base rounded-lg cursor-pointer',
        'hover:bg-white/10 transition-colors duration-200',
      )}
    >
      {children}
    </button>
  );
}

/**
 * A simple particle system drawn on a canvas. Particles drift slowly
 * across the screen to hint at a breathing, sentient background.
 */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeCanvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;
    let animationFrameId: number;
    const particles = Array.from({ length: 80 }, () => createParticle(activeCanvas));

    function render() {
      const { width, height } = activeCanvas;
      context.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255,255,255,0.6)';
        context.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    }
    function handleResize() {
      activeCanvas.width = window.innerWidth;
      activeCanvas.height = window.innerHeight;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function createParticle(canvas: HTMLCanvasElement) {
  const { width, height } = canvas;
  const radius = Math.random() * 1.5 + 0.5;
  const speed = Math.random() * 0.2 + 0.05;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
  };
}
