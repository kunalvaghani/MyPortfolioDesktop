import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legacy KunalOS',
  description: 'Archive of Kunal Vaghani’s former Windows-inspired interactive portfolio.',
  alternates: { canonical: '/kunalos' },
};

const legacyFeatures = [
  'BIOS boot and Windows-style desktop shell',
  'Draggable application windows and Start menu',
  'Mini-games, themes, wallpapers, and terminal interactions',
  'Three.js model viewers and graphics portfolio projects',
  'Local-LLM browser demos from the earlier portfolio direction',
];

export default function KunalOsArchive() {
  return (
    <main className="legacy-page">
      <nav className="legacy-nav" aria-label="Legacy archive navigation">
        <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">KV</span><span>Kunal Vaghani</span></Link>
        <Link href="/">Return to current portfolio <span aria-hidden="true">↗</span></Link>
      </nav>

      <section className="legacy-hero">
        <div className="legacy-copy">
          <p className="hero-eyebrow"><span aria-hidden="true" />Portfolio archive · 2026</p>
          <h1>KunalOS</h1>
          <p>The previous portfolio turned Kunal’s game, graphics, and browser work into a bootable Windows-inspired desktop. It is no longer the homepage because the current engineering story needs to be understood immediately.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="https://github.com/kunalvaghani/MyPortfolioDesktop/tree/b5528ed29783e4f4037496dd877ac3dfdb6a4a3d" target="_blank" rel="noreferrer">Browse preserved source <span aria-hidden="true">↗</span></a>
            <Link className="button button-secondary" href="/">Open current portfolio</Link>
          </div>
        </div>

        <div className="legacy-desktop" aria-label="Abstract preview of the former KunalOS desktop">
          <div className="legacy-titlebar"><span>KunalOS Portfolio</span><span>— □ ×</span></div>
          <div className="legacy-screen">
            <div className="legacy-icon"><i />My Portfolio</div>
            <div className="legacy-icon"><i />Games</div>
            <div className="legacy-icon"><i />Models</div>
            <div className="legacy-window"><div>ABOUT.TXT</div><strong>Kunal Vaghani</strong><p>Game Developer and Engine Programmer</p></div>
          </div>
          <div className="legacy-taskbar"><strong>Start</strong><span>KunalOS archive</span></div>
        </div>
      </section>

      <section className="legacy-decision">
        <div><p className="section-eyebrow">Design decision</p><h2>Preserved as evidence, removed as a recruiter barrier.</h2></div>
        <p>KunalOS still demonstrates React, Next.js, TypeScript, browser interaction systems, Three.js, graphics work, and creative engineering. The implementation remains recoverable at its final KunalOS commit, while this archive route stays lightweight and does not load the old Three.js or mini-game bundle.</p>
      </section>

      <section className="legacy-feature-list">
        <p className="section-eyebrow">Preserved work</p>
        <ul>{legacyFeatures.map((feature, index) => <li key={feature}><span>{String(index + 1).padStart(2, '0')}</span>{feature}</li>)}</ul>
      </section>
    </main>
  );
}
