'use client';

import { useEffect, useMemo, useState } from 'react';

type AppId =
  | 'about'
  | 'games'
  | 'skills'
  | 'models'
  | 'contact'
  | 'terminal'
  | 'opengl'
  | 'vulkan'
  | 'village'
  | 'kitchen'
  | 'ai'
  | 'runner'
  | 'maze';

type Project = {
  id: AppId;
  title: string;
  role: string;
  summary: string;
  stack: string[];
  image: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

type ModelAsset = {
  title: string;
  summary: string;
  image: string;
};

const assetBase = 'https://raw.githubusercontent.com/kunalvaghani/My-Portfolio/main/assets';

const projects: Project[] = [
  {
    id: 'opengl',
    title: 'OpenGL Game Engine',
    role: 'Engine Programmer',
    summary:
      'A custom C++ engine with SDL and OpenGL rendering, input, dynamic lighting, textured drawing, XML-driven asset loading, and real-time 2D/3D visuals.',
    stack: ['C++', 'SDL', 'OpenGL', 'XML', 'Rendering'],
    image: `${assetBase}/opengl_engine.png`,
    primaryLabel: 'Open repository',
    primaryHref: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
  {
    id: 'vulkan',
    title: 'Vulkan Game Engine',
    role: 'Engine Programmer',
    summary:
      'A low-level 3D engine focused on swapchains, textures, buffers, depth, shaders, and explicit GPU resource management.',
    stack: ['C++', 'Vulkan', 'Shaders', '3D', 'GPU'],
    image: `${assetBase}/vulkan_engine.png`,
    primaryLabel: 'Open repository',
    primaryHref: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
  {
    id: 'village',
    title: 'The Village',
    role: 'Programmer and Level Designer',
    summary:
      'A pixel-art narrative game where a vampire races home before sunrise while surviving villagers, wizards, and fire-throwing enemies.',
    stack: ['Gameplay', 'Level Design', '2D', 'Itch.io'],
    image: `${assetBase}/the_village_crop50.jpg`,
    primaryLabel: 'Play on Itch',
    primaryHref: 'https://aymed.itch.io/thevillage',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Hell',
    role: 'Level Designer and UI Programmer',
    summary:
      'Chaotic kitchen gameplay built around an anti-gravity glove, bean pickups, hen collection, and fast arcade-level pacing.',
    stack: ['2D', 'UI', 'Level Design', 'Itch.io'],
    image: `${assetBase}/kitchen_hell_crop50.jpg`,
    primaryLabel: 'Play on Itch',
    primaryHref: 'https://nktrien.itch.io/kitchen-hell',
  },
  {
    id: 'ai',
    title: 'Game AI From Scratch',
    role: 'AI Programmer',
    summary:
      'A maze-navigation AI system using Dijkstra and A* style pathfinding with mood-driven behavior: angry moves faster, happy wanders, excited chases.',
    stack: ['AI', 'Pathfinding', 'Dijkstra', 'A*', 'Behavior'],
    image: `${assetBase}/game_ai.png`,
    primaryLabel: 'View code',
    primaryHref: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
  {
    id: 'runner',
    title: 'Commando Squad Runner',
    role: 'Game Developer',
    summary:
      'An endless three-lane Phaser runner with coins, gates, power-ups, bosses, cosmetics, restarts, audio controls, difficulty options, and local progress.',
    stack: ['Phaser 3', 'JavaScript', 'Runner', 'LocalStorage'],
    image: `${assetBase}/commando_squad_runner.jpg`,
    primaryLabel: 'Play live',
    primaryHref: 'https://kunalvaghani.github.io/OnlineFakeAdGame/',
    secondaryLabel: 'View code',
    secondaryHref: 'https://github.com/kunalvaghani/OnlineFakeAdGame',
  },
  {
    id: 'maze',
    title: 'Slide Maze',
    role: 'Designer and Logic Flow',
    summary:
      'A click-through maze game made entirely in Google Slides with handcrafted slide states, movement buttons, dead ends, and a solved screen.',
    stack: ['Google Slides', 'Puzzle', 'No-code', 'Flow Design'],
    image: `${assetBase}/maze_slides_thumb.png`,
    primaryLabel: 'Play in Slides',
    primaryHref:
      'https://docs.google.com/presentation/d/10A2k9nGDKK38CU_8jXvUmxVqh9_6iW45s6vXX9ODi50/edit?usp=sharing',
  },
];

const modelAssets: ModelAsset[] = [
  {
    title: 'Village Day / Night',
    summary: 'Low-poly village scene with houses, cars, trees, and lighting studies.',
    image: fallbackArt('Village Day / Night', '#008080'),
  },
  {
    title: 'Home Robot',
    summary: 'Friendly blue-and-white robot model with clean silhouette work.',
    image: fallbackArt('Home Robot', '#2046c7'),
  },
  {
    title: 'Voxel Forest Scene',
    summary: 'Minecraft-style isometric environment with cottage, trees, and pond.',
    image: fallbackArt('Voxel Forest Scene', '#007a39'),
  },
  {
    title: 'Indian Gada',
    summary: 'Stylized gold mace model with faceted ornamental geometry.',
    image: fallbackArt('Indian Gada', '#b08a00'),
  },
];

function fallbackArt(title: string, accent = '#2046c7') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#c0c0c0"/>
      <rect x="18" y="18" width="764" height="464" fill="#f7f7ef" stroke="#404040" stroke-width="8"/>
      <rect x="42" y="42" width="716" height="52" fill="${accent}"/>
      <text x="64" y="78" font-family="Tahoma, Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">KunalOS Preview</text>
      <rect x="80" y="138" width="220" height="150" fill="#111111"/>
      <rect x="104" y="162" width="172" height="102" fill="#008080"/>
      <rect x="344" y="138" width="312" height="28" fill="#404040"/>
      <rect x="344" y="186" width="250" height="22" fill="#808080"/>
      <rect x="344" y="230" width="286" height="22" fill="#808080"/>
      <rect x="96" y="328" width="608" height="76" fill="${accent}"/>
      <text x="400" y="377" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">${title}</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const appNames: Record<AppId, string> = {
  about: 'About.exe',
  games: 'Games',
  skills: 'Skills.cpl',
  models: 'Models',
  contact: 'Contact',
  terminal: 'Command.com',
  opengl: 'OpenGL Engine',
  vulkan: 'Vulkan Engine',
  village: 'The Village',
  kitchen: 'Kitchen Hell',
  ai: 'Game AI',
  runner: 'Commando Runner',
  maze: 'Slide Maze',
};

const bootLines = [
  'KV-BIOS 4.37  Copyright 1998-2026',
  'CPU: Kunal Vaghani / Game Programmer',
  'Memory Test: 655360K OK',
  'Detecting graphics adapters... OpenGL OK, Vulkan OK',
  'Mounting portfolio drive C: ... ready',
  'Loading KUNALOS\\WIN.COM',
  'Starting Portfolio Operating System',
];

const skills = [
  'C++',
  'C#',
  'Python',
  'Unity',
  'Unreal Engine',
  'OpenGL',
  'Vulkan',
  'DirectX',
  'SDL',
  'ImGUI',
  'Blender',
  '3ds Max',
  'Git',
  'Gameplay Systems',
  'Graphics Programming',
  'AI Pathfinding',
];

export default function Page() {
  const [booted, setBooted] = useState(false);
  const [openApps, setOpenApps] = useState<AppId[]>(['about']);
  const [activeApp, setActiveApp] = useState<AppId>('about');
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 4700);
    return () => window.clearTimeout(timer);
  }, []);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date()),
    [],
  );

  function openApp(app: AppId) {
    setOpenApps((current) => (current.includes(app) ? current : [...current, app]));
    setActiveApp(app);
    setStartOpen(false);
  }

  function closeApp(app: AppId) {
    setOpenApps((current) => {
      const next = current.filter((item) => item !== app);
      if (activeApp === app) {
        setActiveApp(next[next.length - 1] ?? 'about');
      }
      return next;
    });
  }

  if (!booted) {
    return <BootScreen onSkip={() => setBooted(true)} />;
  }

  return (
    <main className="desktop-shell" aria-label="KunalOS portfolio desktop">
      <div className="desktop-grid" aria-label="Desktop shortcuts">
        <DesktopIcon label="My Portfolio" glyph="pc" onOpen={() => openApp('about')} />
        <DesktopIcon label="Games" glyph="game" onOpen={() => openApp('games')} />
        <DesktopIcon label="3D Models" glyph="cube" onOpen={() => openApp('models')} />
        <DesktopIcon label="Skills" glyph="tools" onOpen={() => openApp('skills')} />
        <DesktopIcon label="Contact" glyph="mail" onOpen={() => openApp('contact')} />
        <DesktopIcon label="Command" glyph="term" onOpen={() => openApp('terminal')} />
      </div>

      <div className="window-layer">
        {openApps.map((app, index) => (
          <RetroWindow
            key={app}
            id={app}
            title={appNames[app]}
            active={activeApp === app}
            stackIndex={index}
            onFocus={() => setActiveApp(app)}
            onClose={() => closeApp(app)}
          >
            <AppContent app={app} openApp={openApp} />
          </RetroWindow>
        ))}
      </div>

      {startOpen && <StartMenu openApp={openApp} />}

      <footer className="taskbar" aria-label="Taskbar">
        <button
          className={`start-button ${startOpen ? 'pressed' : ''}`}
          type="button"
          onClick={() => setStartOpen((value) => !value)}
        >
          <span className="start-logo" aria-hidden="true" />
          Start
        </button>

        <div className="task-buttons">
          {openApps.map((app) => (
            <button
              key={app}
              className={`task-button ${activeApp === app ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveApp(app)}
              title={`Switch to ${appNames[app]}`}
            >
              {appNames[app]}
            </button>
          ))}
        </div>

        <div className="tray" aria-label="System tray">
          <span className="tray-light" />
          <span>{time}</span>
        </div>
      </footer>
    </main>
  );
}

function SafeImage({
  src,
  alt,
  className,
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={(event) => {
        const img = event.currentTarget;
        img.onerror = null;
        img.src = fallbackArt(fallbackTitle);
      }}
    />
  );
}

function BootScreen({ onSkip }: { onSkip: () => void }) {
  const [visibleLines, setVisibleLines] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleLines((count) => Math.min(count + 1, bootLines.length));
    }, 520);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="boot-screen">
      <div className="bios-panel" role="status" aria-live="polite">
        <div className="bios-brand">KUNALOS PORTFOLIO BIOS</div>
        <div className="bios-lines">
          {bootLines.slice(0, visibleLines).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="boot-progress" aria-hidden="true">
          <span />
        </div>
        <button className="boot-skip" type="button" onClick={onSkip}>
          Press Enter to continue
        </button>
      </div>
    </main>
  );
}

function DesktopIcon({
  label,
  glyph,
  onOpen,
}: {
  label: string;
  glyph: 'pc' | 'game' | 'cube' | 'tools' | 'mail' | 'term';
  onOpen: () => void;
}) {
  return (
    <button className="desktop-icon" type="button" onClick={onOpen} title={`Open ${label}`}>
      <span className={`pixel-icon ${glyph}`} aria-hidden="true">
        <span />
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}

function RetroWindow({
  id,
  title,
  active,
  stackIndex,
  onFocus,
  onClose,
  children,
}: {
  id: AppId;
  title: string;
  active: boolean;
  stackIndex: number;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`retro-window ${active ? 'active' : ''} window-${id}`}
      style={{ zIndex: active ? 50 : 10 + stackIndex }}
      onMouseDown={onFocus}
      aria-label={`${title} window`}
    >
      <header className="titlebar">
        <div className="titlebar-title">
          <span className="mini-program-icon" aria-hidden="true" />
          {title}
        </div>
        <div className="titlebar-controls">
          <button type="button" title="Minimize" aria-label={`Minimize ${title}`}>
            _
          </button>
          <button type="button" title="Maximize" aria-label={`Maximize ${title}`}>
            []
          </button>
          <button type="button" title="Close" aria-label={`Close ${title}`} onClick={onClose}>
            X
          </button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}

function AppContent({ app, openApp }: { app: AppId; openApp: (app: AppId) => void }) {
  const project = projects.find((item) => item.id === app);
  if (project) {
    return <ProjectDetail project={project} />;
  }

  switch (app) {
    case 'about':
      return <AboutApp openApp={openApp} />;
    case 'games':
      return <GamesApp openApp={openApp} />;
    case 'skills':
      return <SkillsApp />;
    case 'models':
      return <ModelsApp />;
    case 'contact':
      return <ContactApp />;
    case 'terminal':
      return <TerminalApp />;
    default:
      return null;
  }
}

function AboutApp({ openApp }: { openApp: (app: AppId) => void }) {
  return (
    <div className="about-app">
      <div className="hero-file">
        <div className="portrait-pixels" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="eyebrow">C:\PORTFOLIO\ABOUT.TXT</p>
          <h1>Kunal Vaghani</h1>
          <p className="role-line">Game Developer and Engine Programmer</p>
        </div>
      </div>

      <p>
        I build gameplay systems, custom engine features, rendering experiments, and interactive
        experiences with C++, C#, Unity, Unreal Engine, OpenGL, and Vulkan. This portfolio turns the
        work into a tiny operating system: every project is a program you can launch.
      </p>

      <div className="status-strip" aria-label="Portfolio stats">
        <span>Humber College Game Programming</span>
        <span>Dean's Honor Roll</span>
        <span>Local-first builder</span>
      </div>

      <div className="button-row">
        <button className="retro-action" type="button" onClick={() => openApp('games')}>
          Open Games
        </button>
        <button className="retro-action" type="button" onClick={() => openApp('skills')}>
          View Skills
        </button>
        <button className="retro-action" type="button" onClick={() => openApp('contact')}>
          Contact
        </button>
      </div>
    </div>
  );
}

function GamesApp({ openApp }: { openApp: (app: AppId) => void }) {
  return (
    <div className="games-app">
      <div className="toolbar">
        <button type="button">File</button>
        <button type="button">View</button>
        <button type="button">Help</button>
      </div>
      <div className="folder-grid">
        {projects.map((project) => (
          <button
            key={project.id}
            className="program-tile"
            type="button"
            onClick={() => openApp(project.id)}
            title={`Launch ${project.title}`}
          >
            <SafeImage src={project.image} alt="" fallbackTitle={project.title} />
            <span>{project.title}</span>
            <small>{project.role}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="project-detail">
      <SafeImage
        className="project-preview"
        src={project.image}
        alt={`${project.title} preview`}
        fallbackTitle={project.title}
      />
      <div className="project-copy">
        <p className="eyebrow">{project.role}</p>
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <div className="stack-list" aria-label={`${project.title} tech stack`}>
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="button-row">
          <a className="retro-action" href={project.primaryHref} target="_blank" rel="noreferrer">
            {project.primaryLabel}
          </a>
          {project.secondaryHref && (
            <a className="retro-action" href={project.secondaryHref} target="_blank" rel="noreferrer">
              {project.secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function SkillsApp() {
  return (
    <div className="skills-app">
      <div className="meter-panel">
        <h2>System Capabilities</h2>
        <p>Primary toolchain detected from the GitHub portfolio repository.</p>
      </div>
      <div className="skill-grid">
        {skills.map((skill, index) => (
          <div className="skill-meter" key={skill}>
            <span>{skill}</span>
            <div className="meter-track">
              <i style={{ width: `${74 + (index % 5) * 5}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelsApp() {
  return (
    <div className="models-app">
      {modelAssets.map((model) => (
        <figure className="model-card" key={model.title}>
          <SafeImage
            src={model.image}
            alt={`${model.title} 3D model artwork`}
            fallbackTitle={model.title}
          />
          <figcaption>
            <strong>{model.title}</strong>
            <span>{model.summary}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ContactApp() {
  return (
    <address className="contact-app">
      <p className="eyebrow">Network Connections</p>
      <h2>Get in touch</h2>
      <a href="mailto:kunalvaghani35@gmail.com">kunalvaghani35@gmail.com</a>
      <a href="tel:+14379873240">+1 437 987 3240</a>
      <a href="https://www.linkedin.com/in/kunal-vaghani-b19217235/" target="_blank" rel="noreferrer">
        LinkedIn profile
      </a>
      <a href="https://github.com/kunalvaghani" target="_blank" rel="noreferrer">
        GitHub profile
      </a>
    </address>
  );
}

function TerminalApp() {
  return (
    <div className="terminal-app">
      <p>Microsoft(R) KunalOS</p>
      <p>C:\PORTFOLIO&gt; dir /games</p>
      {projects.map((project) => (
        <p key={project.id}>GAME&nbsp;&nbsp;&nbsp;&nbsp;{project.title}</p>
      ))}
      <p>C:\PORTFOLIO&gt; type mission.txt</p>
      <p>
        Build fast, playful, technically grounded experiences across engines, tools, graphics, and
        AI.
      </p>
      <p className="cursor-line">C:\PORTFOLIO&gt; _</p>
    </div>
  );
}

function StartMenu({ openApp }: { openApp: (app: AppId) => void }) {
  const shortcuts: AppId[] = ['about', 'games', 'skills', 'models', 'contact', 'terminal'];

  return (
    <aside className="start-menu" aria-label="Start menu">
      <div className="start-rail">KunalOS</div>
      <div className="start-items">
        {shortcuts.map((app) => (
          <button key={app} type="button" onClick={() => openApp(app)}>
            <span className="menu-icon" aria-hidden="true" />
            {appNames[app]}
          </button>
        ))}
        <div className="start-divider" />
        <a href="https://github.com/kunalvaghani/My-Portfolio" target="_blank" rel="noreferrer">
          <span className="menu-icon" aria-hidden="true" />
          GitHub Repo
        </a>
      </div>
    </aside>
  );
}
