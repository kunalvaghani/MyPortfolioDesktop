"use client";

import clsx from 'clsx';
import React from 'react';

/**
 * A reusable card implementing the glassmorphism aesthetic. It
 * encapsulates a semi-transparent backdrop with blur, border and
 * shadow so that it can be reused across memory, simulation and
 * contact panels. Additional classes may be passed via the
 * `className` prop to adjust padding, margin or layout.
 */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass-card rounded-xl p-4 backdrop-blur-md border border-white/10 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}