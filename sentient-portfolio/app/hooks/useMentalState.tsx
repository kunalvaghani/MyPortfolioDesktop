"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/**
 * Mental states the system can be in. Each state affects particle
 * velocities, animation easings and copy tone. See the hook below
 * for the logic that derives these from user interaction patterns.
 */
export type MentalState =
  | 'idle'
  | 'curious'
  | 'focused'
  | 'overstimulated'
  | 'calm';

interface MentalStateContextValue {
  state: MentalState;
  /**
   * Forces the state into calm for a short period. Components can
   * call this to allow the visitor to stabilise the core. After
   * calling this, the state will remain calm until the next user
   * interaction.
   */
  stabilise: () => void;
}

const MentalStateContext = createContext<MentalStateContextValue | null>(null);

export const MentalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<MentalState>('idle');
  const [calmOverride, setCalmOverride] = useState(false);
  const lastMouse = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: Date.now(),
  });
  const lastScroll = useRef<{ y: number; time: number }>({
    y: 0,
    time: Date.now(),
  });
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Helper to clear idle timeout and start a new one
  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setState('idle');
    }, 6000);
  };

  useEffect(() => {
    // On mount, start idle timer
    resetIdleTimer();
    // Mouse movement listener
    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      const dt = now - lastMouse.current.time;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / (dt || 1);
      lastMouse.current = { x: e.clientX, y: e.clientY, time: now };
      resetIdleTimer();
      if (calmOverride) return;
      // Derive state based on mouse speed
      if (speed > 2.5) {
        setState('overstimulated');
      } else if (speed > 0.5) {
        setState('curious');
      } else {
        setState('focused');
      }
    }
    // Scroll listener
    function handleScroll() {
      const now = Date.now();
      const dy = window.scrollY - lastScroll.current.y;
      const dt = now - lastScroll.current.time;
      const velocity = Math.abs(dy) / (dt || 1);
      lastScroll.current = { y: window.scrollY, time: now };
      resetIdleTimer();
      if (calmOverride) return;
      if (velocity > 0.8) {
        setState('overstimulated');
      } else if (velocity > 0.2) {
        setState('curious');
      } else {
        setState('focused');
      }
    }
    // Click listener increments curiosity briefly
    function handleClick() {
      resetIdleTimer();
      if (calmOverride) return;
      setState('curious');
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calmOverride]);

  /**
   * Forces the mental state into calm. The override is cleared on
   * the next user interaction. Components can offer a button to
   * stabilise the core and reduce motion.
   */
  const stabilise = () => {
    setCalmOverride(true);
    setState('calm');
    // After the next interaction (mouse or scroll), the override is removed.
    function clearOverride() {
      setCalmOverride(false);
      window.removeEventListener('mousemove', clearOverride);
      window.removeEventListener('scroll', clearOverride);
      window.removeEventListener('click', clearOverride);
    }
    window.addEventListener('mousemove', clearOverride);
    window.addEventListener('scroll', clearOverride);
    window.addEventListener('click', clearOverride);
  };

  return (
    <MentalStateContext.Provider value={{ state, stabilise }}>
      {children}
    </MentalStateContext.Provider>
  );
};

/**
 * Hook to consume the current mental state. Components call this to
 * adjust their animation speeds, colours and copy tone. The
 * provider must wrap the component tree (see RootLayout).
 */
export function useMentalState(): MentalStateContextValue {
  const ctx = useContext(MentalStateContext);
  if (!ctx) throw new Error('useMentalState must be used within a MentalStateProvider');
  return ctx;
}