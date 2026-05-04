"use client";

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import GlassCard from '@/app/components/GlassCard';

/**
 * NeuralLinkContact provides a non‑traditional contact interface. The
 * visitor initiates a neural handshake, after which a form appears
 * asking for identity, intent and a freeform message. Upon
 * submission a confirmation message is shown. This component does
 * not perform any network requests; in a real application you would
 * integrate with an email service or backend endpoint here.
 */
export default function NeuralLinkContact() {
  const [stage, setStage] = useState<'handshake' | 'form' | 'success'>('handshake');
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState('hire');
  const [message, setMessage] = useState('');

  // Automatically proceed from handshake to form after a short delay
  useEffect(() => {
    if (stage === 'handshake') {
      const timer = setTimeout(() => setStage('form'), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage('success');
    // In a real app you might send the data here.
  }

  return (
    <GlassCard className="p-4 w-full max-w-md mx-auto">
      {stage === 'handshake' && (
        <div className="text-xs font-mono text-center">
          <span className="text-secondary">Attempting Neural Handshake...</span>
        </div>
      )}
      {stage === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-secondary">
              Identity Channel
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="intent" className="mb-1 text-secondary">
              Intent
            </label>
            <select
              id="intent"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="hire">Hire</option>
              <option value="collaboration">Collaboration</option>
              <option value="research">Research</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="mb-1 text-secondary">
              Message Buffer
            </label>
            <textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
            >
              Establish Link
            </button>
          </div>
        </form>
      )}
      {stage === 'success' && (
        <div className="text-xs font-mono text-center space-y-2">
          <div className="text-primary">Signal received.</div>
          <div>This intelligence will respond.</div>
        </div>
      )}
    </GlassCard>
  );
}