'use client';

import { useEffect, useState } from 'react';

const links = [
  ['Systems', '#systems'],
  ['Projects', '#projects'],
  ['Experience', '#experience'],
  ['Skills', '#skills'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">KV</span>
          <span>Kunal Vaghani</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className={`nav-menu${open ? ' is-open' : ''}`} id="primary-menu">
          <div className="nav-links">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </div>
          <a className="nav-github" href="https://github.com/kunalvaghani" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
