'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type IntroPhase = 'visible' | 'leaving' | 'hidden';

const introStorageKey = 'kv-portfolio-intro-seen';

// Reveal and parallax behavior is inspired by ReactBits' restrained content
// animation patterns: https://reactbits.dev/animations/fade-content
export function MotionLayer() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('visible');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let introSeen = false;

    try {
      introSeen = window.sessionStorage.getItem(introStorageKey) === 'true';
    } catch {
      // Storage can be unavailable in strict browsing modes; the intro still works.
    }

    if (reducedMotion || introSeen) {
      const hideImmediately = window.setTimeout(() => setIntroPhase('hidden'), 0);
      return () => window.clearTimeout(hideImmediately);
    }

    try {
      window.sessionStorage.setItem(introStorageKey, 'true');
    } catch {
      // A replay on the next navigation is harmless when storage is unavailable.
    }

    const beginExit = window.setTimeout(() => setIntroPhase('leaving'), 720);
    const finishExit = window.setTimeout(() => setIntroPhase('hidden'), 1050);

    return () => {
      window.clearTimeout(beginExit);
      window.clearTimeout(finishExit);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>('[data-reveal]');

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      const portrait = document.querySelector<HTMLElement>('[data-parallax="portrait"]');
      if (portrait) {
        gsap.to(portrait, {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: portrait,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      }
    });

    return () => context.revert();
  }, []);

  if (introPhase === 'hidden') return null;

  return (
    <div
      className={`page-intro${introPhase === 'leaving' ? ' page-intro-leaving' : ''}`}
      role="status"
      aria-label="Loading Kunal Vaghani's portfolio"
    >
      <div className="page-intro-content">
        <span className="page-intro-mark" aria-hidden="true">KV</span>
        <p>Kunal Vaghani</p>
        <span className="page-intro-line" aria-hidden="true"><span /></span>
      </div>
    </div>
  );
}
