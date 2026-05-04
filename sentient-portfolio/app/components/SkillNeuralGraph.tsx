"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-force';
import clsx from 'clsx';
import GlassCard from '@/app/components/GlassCard';

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0 → 1, mapped to node glow
  recency: number; // 0 → 1, mapped to pulse speed
  coUsage: Record<string, number>; // edges weights
  projectsCount: number;
  layers: string[];
}

interface SkillNeuralGraphProps {
  skills: Skill[];
}

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  skill: Skill;
  radius: number;
  pulseSpeed: number;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: NodeDatum;
  target: NodeDatum;
  weight: number;
  pulse: number;
}

/**
 * SkillNeuralGraph draws an interactive network of skills. Nodes
 * glow based on proficiency and pulse based on recency. Edges
 * represent co‑usage frequency and pulses traverse frequently used
 * connections. Hovering over a node reveals details in a glass
 * overlay. On mobile tapping a node will fix it as the selected
 * node until dismissed.
 */
export default function SkillNeuralGraph({ skills }: SkillNeuralGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<NodeDatum | null>(null);
  const [hovered, setHovered] = useState<NodeDatum | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Build simulation whenever the list of skills changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;

    // Resize canvas to container size
    function resize() {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setDimensions({ width: rect.width, height: rect.height });
    }
    resize();
    window.addEventListener('resize', resize);

    // Create nodes from skills
    const nodes: NodeDatum[] = skills.map((skill) => ({
      id: skill.id,
      skill,
      radius: 6 + skill.proficiency * 8,
      pulseSpeed: 0.5 + skill.recency * 1.5,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
    }));
    // Create links based on coUsage
    const links: LinkDatum[] = [];
    for (const node of nodes) {
      for (const [targetId, weight] of Object.entries(node.skill.coUsage)) {
        const targetNode = nodes.find((n) => n.id === targetId);
        if (targetNode) {
          links.push({ source: node, target: targetNode, weight, pulse: Math.random() });
        }
      }
    }
    // Use d3 force simulation to arrange nodes. A mild collision
    // force prevents overlap. Charge force keeps nodes loose. Link
    // force pulls co‑used nodes together.
    const simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2))
      .force('collision', d3.forceCollide<NodeDatum>().radius((d) => d.radius + 2))
      .force(
        'link',
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .id((d) => d.id)
          .distance(80)
          .strength((link) => link.weight),
      )
      .alphaDecay(0.05);

    simulation.on('tick', () => {
      draw();
    });

    // Draw function iterates over links and nodes to paint them
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw edges
      ctx.lineCap = 'round';
      links.forEach((link) => {
        const { source, target, weight } = link;
        const sx = source.x!;
        const sy = source.y!;
        const tx = target.x!;
        const ty = target.y!;
        // Line thickness based on weight
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1 + weight * 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // Pulse along the edge
        link.pulse = (link.pulse + weight * 0.01) % 1;
        const px = sx + (tx - sx) * link.pulse;
        const py = sy + (ty - sy) * link.pulse;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      // Draw nodes
      nodes.forEach((node) => {
        const { x, y, radius, skill } = node;
        // Outer glow
        ctx.save();
        ctx.shadowColor = 'rgba(0,240,255,0.5)';
        ctx.shadowBlur = 10 + skill.proficiency * 20;
        ctx.fillStyle = 'rgba(0,240,255,0.3)';
        ctx.beginPath();
        ctx.arc(x!, y!, radius + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Core circle
        ctx.fillStyle = 'rgba(0,240,255,0.9)';
        ctx.beginPath();
        ctx.arc(x!, y!, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // Kick off initial draw in case the simulation hasn't ticked yet
    draw();
    // Hover detection
    function handlePointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: NodeDatum | null = null;
      for (const node of nodes) {
        const dx = mx - (node.x || 0);
        const dy = my - (node.y || 0);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius + 6) {
          found = node;
          break;
        }
      }
      setHovered(found);
    }
    // On mobile, tap toggles selection
    function handlePointerDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: NodeDatum | null = null;
      for (const node of nodes) {
        const dx = mx - (node.x || 0);
        const dy = my - (node.y || 0);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius + 6) {
          found = node;
          break;
        }
      }
      if (found) {
        setSelected((current) => (current && current.id === found!.id ? null : found));
      } else {
        setSelected(null);
      }
    }
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    // Stop simulation and event listeners on cleanup
    return () => {
      window.removeEventListener('resize', resize);
      simulation.stop();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [skills]);

  const showNode = selected || hovered;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
      {/* Details panel for the hovered or selected node */}
      {showNode && (
        <div
          className={clsx(
            'absolute pointer-events-auto transition-all duration-300',
            selected ? 'bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:w-48' : 'left-full top-0',
          )}
        >
          <GlassCard className="m-2 p-3 text-xs max-w-xs">
            <div className="font-heading text-sm mb-1 text-primary">
              {showNode.skill.name}
            </div>
            <div className="flex items-center mb-1">
              <span className="mr-2">Proficiency:</span>
              <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-primary rounded"
                  style={{ width: `${showNode.skill.proficiency * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center mb-1">
              <span className="mr-2">Recency:</span>
              <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-secondary rounded"
                  style={{ width: `${showNode.skill.recency * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-1">Projects: {showNode.skill.projectsCount}</div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}