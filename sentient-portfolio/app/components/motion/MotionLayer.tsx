'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type IntroPhase = 'visible' | 'leaving' | 'hidden';

// Reveal and parallax behavior is inspired by ReactBits' restrained content
// animation patterns: https://reactbits.dev/animations/fade-content
export function MotionLayer() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('visible');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      const hideImmediately = window.setTimeout(() => setIntroPhase('hidden'), 0);
      return () => window.clearTimeout(hideImmediately);
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
      const heroElements = gsap.utils.toArray<HTMLElement>(
        '.hero-eyebrow, .hero h1, .hero-intro, .hero-actions, .availability-line, .portrait-frame, .portrait-card',
      );

      gsap.fromTo(
        heroElements,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          ease: 'power2.out',
          stagger: 0.07,
          delay: 0.76,
        },
      );

      const revealElements = gsap.utils.toArray<HTMLElement>('[data-reveal]');

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 38, filter: 'blur(5px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.86,
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
          yPercent: -7,
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
