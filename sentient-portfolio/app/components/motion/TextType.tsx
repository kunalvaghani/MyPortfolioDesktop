'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type TextTypeProps = {
  text: string;
  className?: string;
  initialDelay?: number;
  typingSpeed?: number;
};

// Interaction model adapted from ReactBits Text Type:
// https://reactbits.dev/text-animations/text-type
export function TextType({
  text,
  className,
  initialDelay = 320,
  typingSpeed = 27,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reducedMotion) {
      timers.push(setTimeout(() => setDisplayedText(text), 0));
      return () => timers.forEach(clearTimeout);
    }

    let characterIndex = 0;
    const typeNextCharacter = () => {
      characterIndex += 1;
      setDisplayedText(text.slice(0, characterIndex));

      if (characterIndex < text.length) {
        timers.push(setTimeout(typeNextCharacter, typingSpeed));
      }
    };

    timers.push(setTimeout(typeNextCharacter, initialDelay));
    return () => timers.forEach(clearTimeout);
  }, [initialDelay, text, typingSpeed]);

  useEffect(() => {
    if (!cursorRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.48,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{displayedText}</span>
      <span className="text-type-cursor" ref={cursorRef} aria-hidden="true">_</span>
    </p>
  );
}
