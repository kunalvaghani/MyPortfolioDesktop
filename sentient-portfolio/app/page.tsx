'use client';

import { useEffect, useMemo, useState } from 'react';

type AppId =
  | 'about'
  | 'games'
  | 'skills'
  | 'models'
  | 'llm'
  | 'arcade'
  | 'wallpaper'
  | 'themes'
  | 'contact'
  | 'terminal'
  | 'opengl'
  | 'vulkan'
  | 'village'
  | 'kitchen'
  | 'ai'
  | 'runner'
  | 'maze'
  | 'jarvisDemo'
  | 'ragDemo'
  | 'coderDemo'
  | 'voiceDemo';

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

type LocalLlmProject = {
  id: AppId;
  title: string;
  role: string;
  summary: string;
  stack: string[];
  promptIdeas: string[];
  bootLog: string[];
};

type WallpaperId =
  | 'teal'
  | 'clouds'
  | 'stars'
  | 'circuit'
  | 'sunset'
  | 'meadow'
  | 'ocean'
  | 'lava'
  | 'graphite'
  | 'arcade';

type WallpaperOption = {
  id: WallpaperId;
  title: string;
  summary: string;
};

type ThemeId = 'classic' | 'midnight' | 'orchard';

type ThemeOption = {
  id: ThemeId;
  title: string;
  summary: string;
};

type WindowPosition = {
  x: number;
  y: number;
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

const localLlmProjects: LocalLlmProject[] = [
  {
    id: 'jarvisDemo',
    title: 'Jarvis Local-First Assistant',
    role: 'Private Desktop Agent Demo',
    summary:
      'A Windows-first local assistant concept with permissioned tools, memory, app control, and an Ollama-style model backend.',
    stack: ['Ollama', 'FastAPI', 'Electron', 'SQLite', 'Tools'],
    promptIdeas: ['Plan my day like a local assistant', 'Summarize what this app can do'],
    bootLog: ['Loading memory index...', 'Checking tool permissions...', 'Private mode enabled.'],
  },
  {
    id: 'ragDemo',
    title: 'Local LLM Life OS / Grounded RAG',
    role: 'RAG and Citation Demo',
    summary:
      'A local-first knowledge system for ingesting notes/files, chunking them, retrieving evidence, and answering with citations.',
    stack: ['RAG', 'Embeddings', 'SQLite', 'Citations', 'PDF/Text'],
    promptIdeas: ['Explain grounded answers', 'Show how citations work'],
    bootLog: ['Index mounted...', 'Retriever warmed...', 'Evidence drawer ready.'],
  },
  {
    id: 'coderDemo',
    title: 'Stage 3 Local Coding Agent',
    role: 'Planning / Coding Agent Demo',
    summary:
      'A coding-agent workflow that turns vague goals into plans, researches files, edits code, runs tests, and reports changes.',
    stack: ['FastAPI', 'React', 'Ollama', 'Pytest', 'Approvals'],
    promptIdeas: ['Fix a bug in a project', 'Create a testing plan'],
    bootLog: ['Workspace guard active...', 'Planner online...', 'Test runner attached.'],
  },
  {
    id: 'voiceDemo',
    title: 'Talking AI Voice Assistant',
    role: 'Voice / Memory Assistant Demo',
    summary:
      'A local voice-assistant starter with speech-to-text, text-to-speech, VAD capture, memory, diagnostics, and local model calls.',
    stack: ['STT', 'TTS', 'VAD', 'Ollama', 'Memory'],
    promptIdeas: ['Pretend I spoke a reminder', 'Diagnose my microphone flow'],
    bootLog: ['Audio device simulated...', 'Memory DB ready...', 'Voice pipeline armed.'],
  },
];

const wallpaperOptions: WallpaperOption[] = [
  { id: 'teal', title: 'KunalOS Teal Grid', summary: 'Classic early Windows desktop texture.' },
  { id: 'clouds', title: 'Clouds 95', summary: 'Bright sky wallpaper with soft system blue.' },
  { id: 'stars', title: 'Starfield Boot', summary: 'Dark space pattern for late-night browsing.' },
  { id: 'circuit', title: 'Circuit Lab', summary: 'Retro hardware lines for engine work.' },
  { id: 'sunset', title: 'Sunset CRT', summary: 'Warm bands with old monitor scan texture.' },
  { id: 'meadow', title: 'Green Meadow', summary: 'Game-world field tones with pixel dots.' },
  { id: 'ocean', title: 'Deep Ocean', summary: 'Blue waves and subtle grid movement.' },
  { id: 'lava', title: 'Lava Debug', summary: 'Arcade red/orange diagnostic energy.' },
  { id: 'graphite', title: 'Graphite CAD', summary: 'Clean gray blueprint background.' },
  { id: 'arcade', title: 'Arcade Floor', summary: 'Playful checkerboard neon floor.' },
];

const themeOptions: ThemeOption[] = [
  { id: 'classic', title: 'Classic Gray', summary: 'Windows 95 inspired gray chrome and blue titlebars.' },
  { id: 'midnight', title: 'Midnight Workbench', summary: 'Dark graphite shell with cyan highlights.' },
  { id: 'orchard', title: 'Orchard Lab', summary: 'Soft green panels with deep purple titlebars.' },
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
  llm: 'Local LLM Apps',
  arcade: 'Mini Games',
  wallpaper: 'Wallpaper.cpl',
  themes: 'Themes.cpl',
  contact: 'Contact',
  terminal: 'Command.com',
  opengl: 'OpenGL Engine',
  vulkan: 'Vulkan Engine',
  village: 'The Village',
  kitchen: 'Kitchen Hell',
  ai: 'Game AI',
  runner: 'Commando Runner',
  maze: 'Slide Maze',
  jarvisDemo: 'Jarvis Demo',
  ragDemo: 'RAG Demo',
  coderDemo: 'Coding Agent',
  voiceDemo: 'Voice AI Demo',
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
  const [poweredOff, setPoweredOff] = useState(false);
  const [openApps, setOpenApps] = useState<AppId[]>(['about']);
  const [activeApp, setActiveApp] = useState<AppId>('about');
  const [startOpen, setStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperId>('teal');
  const [theme, setTheme] = useState<ThemeId>('classic');
  const [desktopWindows, setDesktopWindows] = useState(false);
  const [windowPositions, setWindowPositions] = useState<Partial<Record<AppId, WindowPosition>>>({});

  useEffect(() => {
    if (poweredOff) {
      return undefined;
    }
    const timer = window.setTimeout(() => setBooted(true), 4700);
    return () => window.clearTimeout(timer);
  }, [poweredOff]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const updateDesktopMode = () => setDesktopWindows(media.matches);
    updateDesktopMode();
    media.addEventListener('change', updateDesktopMode);
    return () => media.removeEventListener('change', updateDesktopMode);
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

  function moveWindow(app: AppId, position: WindowPosition) {
    setWindowPositions((current) => ({
      ...current,
      [app]: position,
    }));
  }

  function powerOff() {
    setPoweredOff(true);
    setBooted(false);
    setOpenApps(['about']);
    setActiveApp('about');
    setStartOpen(false);
    setWindowPositions({});
  }

  function powerOn() {
    setPoweredOff(false);
    setBooted(false);
  }

  if (poweredOff) {
    return <PowerOffScreen onPowerOn={powerOn} />;
  }

  if (!booted) {
    return <BootScreen onSkip={() => setBooted(true)} />;
  }

  return (
    <main
      className={`desktop-shell theme-${theme} wallpaper-${wallpaper}`}
      aria-label="KunalOS portfolio desktop"
    >
      <div className="desktop-grid" aria-label="Desktop shortcuts">
        <DesktopIcon label="My Portfolio" glyph="pc" onOpen={() => openApp('about')} />
        <DesktopIcon label="Contact" glyph="mail" onOpen={() => openApp('contact')} />
        <DesktopIcon label="Skills" glyph="tools" onOpen={() => openApp('skills')} />
        <DesktopIcon label="Command" glyph="term" onOpen={() => openApp('terminal')} />
        <DesktopIcon label="Games" glyph="game" onOpen={() => openApp('games')} />
        <DesktopIcon label="Mini Games" glyph="joystick" onOpen={() => openApp('arcade')} />
        <DesktopIcon label="Local LLM" glyph="brain" onOpen={() => openApp('llm')} />
        <DesktopIcon label="3D Models" glyph="cube" onOpen={() => openApp('models')} />
        <DesktopIcon label="Wallpapers" glyph="paint" onOpen={() => openApp('wallpaper')} />
        <DesktopIcon label="Themes" glyph="gear" onOpen={() => openApp('themes')} />
      </div>

      <div className="window-layer">
        {openApps.map((app, index) => (
          <RetroWindow
            key={app}
            id={app}
            title={appNames[app]}
            active={activeApp === app}
            stackIndex={index}
            draggable={desktopWindows}
            position={desktopWindows ? windowPositions[app] : undefined}
            onFocus={() => setActiveApp(app)}
            onClose={() => closeApp(app)}
            onMove={(position) => moveWindow(app, position)}
          >
            <AppContent
              app={app}
              openApp={openApp}
              onPowerOff={powerOff}
              wallpaper={wallpaper}
              setWallpaper={setWallpaper}
              theme={theme}
              setTheme={setTheme}
            />
          </RetroWindow>
        ))}
      </div>

      {startOpen && <StartMenu openApp={openApp} onPowerOff={powerOff} />}

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

function PowerOffScreen({ onPowerOn }: { onPowerOn: () => void }) {
  return (
    <main className="power-screen">
      <section className="power-panel" aria-label="KunalOS powered off">
        <div className="power-logo" aria-hidden="true" />
        <h1>It is now safe to turn off KunalOS.</h1>
        <p>Portfolio session closed. Press power to boot the desktop again.</p>
        <button className="power-button" type="button" onClick={onPowerOn}>
          Power On
        </button>
      </section>
    </main>
  );
}

function DesktopIcon({
  label,
  glyph,
  onOpen,
}: {
  label: string;
  glyph: 'pc' | 'game' | 'joystick' | 'cube' | 'brain' | 'paint' | 'gear' | 'tools' | 'mail' | 'term';
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
  draggable,
  position,
  onFocus,
  onClose,
  onMove,
  children,
}: {
  id: AppId;
  title: string;
  active: boolean;
  stackIndex: number;
  draggable: boolean;
  position?: WindowPosition;
  onFocus: () => void;
  onClose: () => void;
  onMove: (position: WindowPosition) => void;
  children: React.ReactNode;
}) {
  function startDrag(event: React.PointerEvent<HTMLElement>) {
    if (!draggable || event.button !== 0) {
      return;
    }
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    const windowElement = event.currentTarget.closest('.retro-window') as HTMLElement | null;
    if (!windowElement) {
      return;
    }

    onFocus();
    event.preventDefault();
    const rect = windowElement.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const handleMove = (moveEvent: PointerEvent) => {
      const maxX = Math.max(8, window.innerWidth - rect.width - 8);
      const maxY = Math.max(8, window.innerHeight - 42);
      const nextX = Math.min(Math.max(8, moveEvent.clientX - offsetX), maxX);
      const nextY = Math.min(Math.max(8, moveEvent.clientY - offsetY), maxY);
      onMove({ x: Math.round(nextX), y: Math.round(nextY) });
    };

    const stopDrag = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stopDrag);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stopDrag);
  }

  return (
    <section
      className={`retro-window ${active ? 'active' : ''} ${draggable ? 'draggable' : ''} window-${id}`}
      style={{
        zIndex: active ? 50 : 10 + stackIndex,
        ...(position ? { left: position.x, top: position.y } : {}),
      }}
      onMouseDown={onFocus}
      aria-label={`${title} window`}
    >
      <header className="titlebar" onPointerDown={startDrag}>
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

function AppContent({
  app,
  openApp,
  onPowerOff,
  wallpaper,
  setWallpaper,
  theme,
  setTheme,
}: {
  app: AppId;
  openApp: (app: AppId) => void;
  onPowerOff: () => void;
  wallpaper: WallpaperId;
  setWallpaper: (wallpaper: WallpaperId) => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}) {
  const project = projects.find((item) => item.id === app);
  if (project) {
    return <ProjectDetail project={project} />;
  }

  const llmProject = localLlmProjects.find((item) => item.id === app);
  if (llmProject) {
    return <LocalLlmDemoApp project={llmProject} />;
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
    case 'llm':
      return <LocalLlmHub openApp={openApp} />;
    case 'arcade':
      return <MiniGamesApp />;
    case 'wallpaper':
      return <WallpaperApp selected={wallpaper} onSelect={setWallpaper} />;
    case 'themes':
      return <ThemeApp selected={theme} onSelect={setTheme} />;
    case 'contact':
      return <ContactApp />;
    case 'terminal':
      return <TerminalApp openApp={openApp} onPowerOff={onPowerOff} />;
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
        <button className="retro-action" type="button" onClick={() => openApp('llm')}>
          Try LLM Apps
        </button>
        <button className="retro-action" type="button" onClick={() => openApp('contact')}>
          Contact
        </button>
      </div>
    </div>
  );
}

function LocalLlmHub({ openApp }: { openApp: (app: AppId) => void }) {
  return (
    <div className="llm-app">
      <div className="toolbar">
        <button type="button">File</button>
        <button type="button">Demos</button>
        <button type="button">Safety</button>
      </div>
      <div className="meter-panel">
        <h2>Local LLM Apps, Browser Mode</h2>
        <p>
          These are interactive portfolio demos of my local-first LLM projects. They run entirely
          inside this Windows-style website, so visitors can click, type, and explore without
          downloading Ollama, Python, models, or desktop apps.
        </p>
      </div>
      <div className="folder-grid">
        {localLlmProjects.map((project) => (
          <button
            key={project.id}
            className="program-tile llm-tile"
            type="button"
            onClick={() => openApp(project.id)}
            title={`Open ${project.title}`}
          >
            <SafeImage src={fallbackArt(project.title, '#004e8a')} alt="" fallbackTitle={project.title} />
            <span>{project.title}</span>
            <small>{project.role}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function LocalLlmDemoApp({ project }: { project: LocalLlmProject }) {
  const [prompt, setPrompt] = useState(project.promptIdeas[0]);
  const [messages, setMessages] = useState([
    `KunalOS loaded ${project.title}.`,
    ...project.bootLog,
    'Type a prompt or click a sample command.',
  ]);

  function runPrompt(nextPrompt = prompt) {
    const cleanPrompt = nextPrompt.trim() || project.promptIdeas[0];
    const reply = makeDemoReply(project, cleanPrompt);
    setPrompt(cleanPrompt);
    setMessages((current) => [
      ...current,
      `Visitor> ${cleanPrompt}`,
      `${project.title}> ${reply}`,
    ]);
  }

  return (
    <div className="llm-demo">
      <div className="llm-demo-header">
        <div>
          <p className="eyebrow">C:\LOCAL_LLM\{project.id.toUpperCase()}.EXE</p>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
        </div>
        <div className="local-badge">No download</div>
      </div>

      <div className="stack-list" aria-label={`${project.title} stack`}>
        {project.stack.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="sample-prompts">
        {project.promptIdeas.map((idea) => (
          <button
            className="retro-action"
            type="button"
            key={idea}
            onClick={() => runPrompt(idea)}
          >
            {idea}
          </button>
        ))}
      </div>

      <div className="llm-console" aria-label={`${project.title} browser demo transcript`}>
        {messages.map((message, index) => (
          <p key={`${message}-${index}`}>{message}</p>
        ))}
      </div>

      <div className="llm-input-row">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          aria-label={`${project.title} prompt`}
        />
        <button className="retro-action" type="button" onClick={() => runPrompt()}>
          Ask Demo
        </button>
      </div>
    </div>
  );
}

function makeDemoReply(project: LocalLlmProject, prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('bug') || lowerPrompt.includes('test') || lowerPrompt.includes('code')) {
    return 'I would inspect the workspace, make a scoped patch, run tests, and summarize changed files. In this website demo, I show the workflow without touching a visitor machine.';
  }
  if (lowerPrompt.includes('citation') || lowerPrompt.includes('ground') || lowerPrompt.includes('rag')) {
    return 'I would retrieve matching notes, attach evidence snippets, and answer only from grounded context. Demo citation: [local-note-03].';
  }
  if (lowerPrompt.includes('voice') || lowerPrompt.includes('microphone') || lowerPrompt.includes('spoke')) {
    return 'I would capture speech locally, transcribe it, store memory in SQLite, then speak back with local TTS. Browser demo keeps it text-only for zero setup.';
  }
  if (lowerPrompt.includes('day') || lowerPrompt.includes('assistant') || lowerPrompt.includes('plan')) {
    return 'I would create a private plan, ask for permission before risky actions, and keep local memory separate from cloud services.';
  }
  return `This demo represents ${project.role.toLowerCase()}: local-first design, permissioned workflows, and a no-download browser preview for portfolio visitors.`;
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

type MiniGameId = 'snake' | 'ladders' | 'moto' | 'speed' | 'pong';

const miniGameTabs: { id: MiniGameId; title: string; summary: string }[] = [
  { id: 'snake', title: 'Snake', summary: 'Eat pixels, grow longer, avoid crashing.' },
  { id: 'ladders', title: 'Snakes and Ladders', summary: 'Roll dice, climb ladders, dodge slides.' },
  { id: 'moto', title: 'Moto GT', summary: 'Lane-switch a tiny racing bike past cones.' },
  { id: 'speed', title: 'Speed 2D', summary: 'Need-for-speed style traffic dodging.' },
  { id: 'pong', title: 'Pixel Pong', summary: 'Classic paddle reflex mini game.' },
];

function MiniGamesApp() {
  const [selected, setSelected] = useState<MiniGameId>('snake');
  const active = miniGameTabs.find((game) => game.id === selected) ?? miniGameTabs[0];

  return (
    <div className="mini-games-app">
      <div className="toolbar">
        <button type="button">Game</button>
        <button type="button">Controls</button>
        <button type="button">Score</button>
      </div>
      <div className="arcade-header">
        <div>
          <p className="eyebrow">C:\GAMES\MINI_ARCADE.EXE</p>
          <h2>Mini Games Arcade</h2>
          <p>{active.summary}</p>
        </div>
        <div className="arcade-marquee">5 CARTRIDGES</div>
      </div>
      <div className="cartridge-tabs" aria-label="Mini game cartridges">
        {miniGameTabs.map((game) => (
          <button
            key={game.id}
            className={selected === game.id ? 'active' : ''}
            type="button"
            onClick={() => setSelected(game.id)}
          >
            {game.title}
          </button>
        ))}
      </div>
      {selected === 'snake' && <SnakeMiniGame />}
      {selected === 'ladders' && <SnakesAndLaddersMiniGame />}
      {selected === 'moto' && <MotoGtMiniGame />}
      {selected === 'speed' && <Speed2dMiniGame />}
      {selected === 'pong' && <PixelPongMiniGame />}
    </div>
  );
}

function SnakeMiniGame() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 9, y: 7 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Press Start, then steer the snake.');

  function reset() {
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 9, y: 7 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setStatus('Snake ready.');
    setRunning(true);
  }

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
        const hitWall = nextHead.x < 0 || nextHead.x > 11 || nextHead.y < 0 || nextHead.y > 11;
        const hitSelf = current.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
        if (hitWall || hitSelf) {
          setRunning(false);
          setStatus(`Game over. Score ${score}.`);
          return current;
        }
        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        if (ateFood) {
          setScore((value) => value + 1);
          setFood({
            x: (food.x * 5 + 3) % 12,
            y: (food.y * 7 + 4) % 12,
          });
          return [nextHead, ...current];
        }
        return [nextHead, ...current.slice(0, -1)];
      });
    }, 260);
    return () => window.clearInterval(timer);
  }, [direction, food, running, score]);

  return (
    <section className="mini-game-panel game-3d snake-stage">
      <div className="game-hud">
        <span>Score: {score}</span>
        <span>{status}</span>
      </div>
      <div className="snake-board" aria-label="Snake game board">
        {Array.from({ length: 144 }, (_, index) => {
          const x = index % 12;
          const y = Math.floor(index / 12);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return <span key={`${x}-${y}`} className={`${isSnake ? 'snake-cell' : ''} ${isFood ? 'food-cell' : ''}`} />;
        })}
      </div>
      <div className="game-controls">
        <button type="button" onClick={reset}>Start Snake</button>
        <button type="button" onClick={() => setDirection({ x: 0, y: -1 })}>Up</button>
        <button type="button" onClick={() => setDirection({ x: -1, y: 0 })}>Left</button>
        <button type="button" onClick={() => setDirection({ x: 1, y: 0 })}>Right</button>
        <button type="button" onClick={() => setDirection({ x: 0, y: 1 })}>Down</button>
      </div>
    </section>
  );
}

function SnakesAndLaddersMiniGame() {
  const jumps: Record<number, number> = { 3: 16, 8: 21, 15: 5, 22: 34, 29: 11, 33: 24 };
  const [position, setPosition] = useState(1);
  const [dice, setDice] = useState(1);
  const [log, setLog] = useState('Roll the dice to start.');

  function rollDice() {
    const nextDice = Math.floor(Math.random() * 6) + 1;
    setDice(nextDice);
    setPosition((current) => {
      const rolled = current + nextDice > 36 ? current : current + nextDice;
      const jumped = jumps[rolled] ?? rolled;
      if (jumped === 36) {
        setLog(`Rolled ${nextDice}. You reached square 36 and won.`);
      } else if (jumped > rolled) {
        setLog(`Rolled ${nextDice}. Ladder from ${rolled} to ${jumped}.`);
      } else if (jumped < rolled) {
        setLog(`Rolled ${nextDice}. Snake from ${rolled} to ${jumped}.`);
      } else {
        setLog(`Rolled ${nextDice}. Moved to ${rolled}.`);
      }
      return jumped;
    });
  }

  return (
    <section className="mini-game-panel game-3d ladders-stage">
      <div className="game-hud">
        <span>Dice: {dice}</span>
        <span>{log}</span>
      </div>
      <div className="ladders-board" aria-label="Snakes and Ladders board">
        {Array.from({ length: 36 }, (_, index) => {
          const square = 36 - index;
          const jump = jumps[square];
          return (
            <span key={square} className={position === square ? 'player-square' : ''}>
              {square}
              {jump && <small>{jump > square ? 'L' : 'S'}-&gt;{jump}</small>}
            </span>
          );
        })}
      </div>
      <div className="game-controls">
        <button type="button" onClick={rollDice}>Roll Dice</button>
        <button type="button" onClick={() => { setPosition(1); setLog('Back to square 1.'); }}>Reset Board</button>
      </div>
    </section>
  );
}

function MotoGtMiniGame() {
  const [lane, setLane] = useState(1);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState([{ id: 1, lane: 0, x: 92 }]);
  const [status, setStatus] = useState('Start the bike and dodge cones.');

  function startRace() {
    setLane(1);
    setScore(0);
    setObstacles([{ id: Date.now(), lane: 0, x: 92 }]);
    setStatus('Moto GT running.');
    setRunning(true);
  }

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setScore((value) => value + 1);
      setObstacles((current) => {
        const moved = current.map((item) => ({ ...item, x: item.x - 11 })).filter((item) => item.x > -8);
        const crashed = moved.some((item) => item.lane === lane && item.x < 16 && item.x > 0);
        if (crashed) {
          setRunning(false);
          setStatus('Crash. Hit Start Race to try again.');
          return moved;
        }
        if (moved.length < 3 && Math.random() > 0.58) {
          moved.push({ id: Date.now() + Math.random(), lane: Math.floor(Math.random() * 3), x: 96 });
        }
        return moved;
      });
    }, 300);
    return () => window.clearInterval(timer);
  }, [lane, running]);

  return (
    <section className="mini-game-panel game-3d race-stage">
      <div className="game-hud">
        <span>Moto GT Score: {score}</span>
        <span>{status}</span>
      </div>
      <div className="road-game moto-game" aria-label="Moto GT racing track">
        <span className="bike-player" style={{ top: `${20 + lane * 32}%` }}>M</span>
        {obstacles.map((item) => (
          <span key={item.id} className="road-obstacle cone" style={{ left: `${item.x}%`, top: `${22 + item.lane * 32}%` }} />
        ))}
      </div>
      <div className="game-controls">
        <button type="button" onClick={startRace}>Start Race</button>
        <button type="button" onClick={() => setLane((value) => Math.max(0, value - 1))}>Lane Up</button>
        <button type="button" onClick={() => setLane((value) => Math.min(2, value + 1))}>Lane Down</button>
      </div>
    </section>
  );
}

function Speed2dMiniGame() {
  const [lane, setLane] = useState(1);
  const [running, setRunning] = useState(false);
  const [boost, setBoost] = useState(false);
  const [distance, setDistance] = useState(0);
  const [traffic, setTraffic] = useState([{ id: 1, lane: 2, x: 88 }]);
  const [status, setStatus] = useState('Dodge traffic and build distance.');

  function startDrive() {
    setLane(1);
    setDistance(0);
    setTraffic([{ id: Date.now(), lane: 2, x: 88 }]);
    setStatus('Speed 2D rolling.');
    setRunning(true);
  }

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      const speed = boost ? 17 : 10;
      setDistance((value) => value + speed);
      setTraffic((current) => {
        const moved = current.map((item) => ({ ...item, x: item.x - speed * 0.8 })).filter((item) => item.x > -8);
        const crashed = moved.some((item) => item.lane === lane && item.x < 15 && item.x > 0);
        if (crashed) {
          setRunning(false);
          setStatus('Traffic collision. Restart and send it again.');
          return moved;
        }
        if (moved.length < 4 && Math.random() > 0.64) {
          moved.push({ id: Date.now() + Math.random(), lane: Math.floor(Math.random() * 4), x: 96 });
        }
        return moved;
      });
    }, 280);
    return () => window.clearInterval(timer);
  }, [boost, lane, running]);

  return (
    <section className="mini-game-panel game-3d race-stage speed-stage">
      <div className="game-hud">
        <span>Distance: {distance}m</span>
        <span>{status}</span>
      </div>
      <div className="road-game speed-game" aria-label="Speed 2D racing track">
        <span className="car-player" style={{ top: `${13 + lane * 24}%` }}>NFS</span>
        {traffic.map((item) => (
          <span key={item.id} className="road-obstacle traffic" style={{ left: `${item.x}%`, top: `${15 + item.lane * 24}%` }} />
        ))}
      </div>
      <div className="game-controls">
        <button type="button" onClick={startDrive}>Start Drive</button>
        <button type="button" onClick={() => setLane((value) => Math.max(0, value - 1))}>Left Lane</button>
        <button type="button" onClick={() => setLane((value) => Math.min(3, value + 1))}>Right Lane</button>
        <button type="button" onMouseDown={() => setBoost(true)} onMouseUp={() => setBoost(false)} onClick={() => setBoost((value) => !value)}>
          Boost
        </button>
      </div>
    </section>
  );
}

function PixelPongMiniGame() {
  const [paddle, setPaddle] = useState(42);
  const [ball, setBall] = useState({ x: 48, y: 45, vx: 5, vy: -5 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Keep the ball above the paddle.');

  function startPong() {
    setPaddle(42);
    setBall({ x: 48, y: 45, vx: 5, vy: -5 });
    setScore(0);
    setStatus('Pong running.');
    setRunning(true);
  }

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setBall((current) => {
        let next = { ...current, x: current.x + current.vx, y: current.y + current.vy };
        if (next.x <= 0 || next.x >= 96) {
          next = { ...next, vx: -next.vx };
        }
        if (next.y <= 0) {
          next = { ...next, vy: Math.abs(next.vy) };
        }
        if (next.y >= 84 && next.x >= paddle && next.x <= paddle + 22) {
          setScore((value) => value + 1);
          next = { ...next, vy: -Math.abs(next.vy) };
        }
        if (next.y > 98) {
          setRunning(false);
          setStatus('Ball missed. Start Pong to replay.');
          return current;
        }
        return next;
      });
    }, 150);
    return () => window.clearInterval(timer);
  }, [paddle, running]);

  return (
    <section className="mini-game-panel game-3d pong-stage">
      <div className="game-hud">
        <span>Pong Score: {score}</span>
        <span>{status}</span>
      </div>
      <div className="pong-field" aria-label="Pixel Pong field">
        <span className="pong-ball" style={{ left: `${ball.x}%`, top: `${ball.y}%` }} />
        <span className="pong-paddle" style={{ left: `${paddle}%` }} />
      </div>
      <div className="game-controls">
        <button type="button" onClick={startPong}>Start Pong</button>
        <button type="button" onClick={() => setPaddle((value) => Math.max(0, value - 10))}>Move Left</button>
        <button type="button" onClick={() => setPaddle((value) => Math.min(76, value + 10))}>Move Right</button>
      </div>
    </section>
  );
}

function WallpaperApp({
  selected,
  onSelect,
}: {
  selected: WallpaperId;
  onSelect: (wallpaper: WallpaperId) => void;
}) {
  const current = wallpaperOptions.find((option) => option.id === selected) ?? wallpaperOptions[0];

  return (
    <div className="personalize-app">
      <div className="toolbar">
        <button type="button">Pattern</button>
        <button type="button">Preview</button>
        <button type="button">Apply</button>
      </div>
      <div className="personalize-header">
        <div>
          <p className="eyebrow">C:\WINDOWS\WALLPAPER.CPL</p>
          <h2>Desktop Wallpaper</h2>
          <p>{current.title} is active.</p>
        </div>
        <span className={`monitor-preview wallpaper-preview-${selected}`} aria-hidden="true" />
      </div>
      <div className="choice-grid" aria-label="Wallpaper choices">
        {wallpaperOptions.map((option) => (
          <button
            key={option.id}
            className={`choice-tile ${selected === option.id ? 'selected' : ''}`}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selected === option.id}
          >
            <span className={`wallpaper-preview wallpaper-preview-${option.id}`} aria-hidden="true" />
            <strong>{option.title}</strong>
            <small>{option.summary}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemeApp({
  selected,
  onSelect,
}: {
  selected: ThemeId;
  onSelect: (theme: ThemeId) => void;
}) {
  const current = themeOptions.find((option) => option.id === selected) ?? themeOptions[0];

  return (
    <div className="personalize-app">
      <div className="toolbar">
        <button type="button">Scheme</button>
        <button type="button">Colors</button>
        <button type="button">Save As</button>
      </div>
      <div className="personalize-header">
        <div>
          <p className="eyebrow">C:\WINDOWS\THEMES.CPL</p>
          <h2>Theme Settings</h2>
          <p>{current.title} controls window chrome, titlebars, panels, and highlights.</p>
        </div>
        <span className={`theme-preview theme-preview-${selected}`} aria-hidden="true">
          <i />
        </span>
      </div>
      <div className="choice-grid theme-grid" aria-label="Theme choices">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            className={`choice-tile theme-choice ${selected === option.id ? 'selected' : ''}`}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selected === option.id}
          >
            <span className={`theme-preview theme-preview-${option.id}`} aria-hidden="true">
              <i />
            </span>
            <strong>{option.title}</strong>
            <small>{option.summary}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

type TerminalLine = {
  id: number;
  text: string;
};

const terminalIntro = [
  'Microsoft(R) KunalOS',
  'Portfolio Shell v1.0 - type HELP for commands.',
];

const appAliases: Record<string, AppId> = {
  about: 'about',
  'about.exe': 'about',
  games: 'games',
  game: 'games',
  arcade: 'arcade',
  minigames: 'arcade',
  mini: 'arcade',
  skills: 'skills',
  'skills.cpl': 'skills',
  models: 'models',
  llm: 'llm',
  local_llm: 'llm',
  local: 'llm',
  wallpaper: 'wallpaper',
  wallpapers: 'wallpaper',
  wallpapercpl: 'wallpaper',
  theme: 'themes',
  themes: 'themes',
  themescpl: 'themes',
  contact: 'contact',
  command: 'terminal',
  terminal: 'terminal',
  cmd: 'terminal',
  opengl: 'opengl',
  vulkan: 'vulkan',
  village: 'village',
  kitchen: 'kitchen',
  ai: 'ai',
  runner: 'runner',
  maze: 'maze',
  jarvis: 'jarvisDemo',
  jarvisdemo: 'jarvisDemo',
  rag: 'ragDemo',
  ragdemo: 'ragDemo',
  coder: 'coderDemo',
  coderdemo: 'coderDemo',
  voice: 'voiceDemo',
  voicedemo: 'voiceDemo',
};

function makeTerminalLines(lines: string[], offset = 0): TerminalLine[] {
  return lines.map((text, index) => ({ id: offset + index, text }));
}

function TerminalApp({
  openApp,
  onPowerOff,
}: {
  openApp: (app: AppId) => void;
  onPowerOff: () => void;
}) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>(makeTerminalLines(terminalIntro));
  const [lineCounter, setLineCounter] = useState(terminalIntro.length);

  function appendLines(lines: string[]) {
    setHistory((current) => [...current, ...makeTerminalLines(lines, lineCounter)]);
    setLineCounter((count) => count + lines.length);
  }

  function resetHistory() {
    setHistory(makeTerminalLines(terminalIntro));
    setLineCounter(terminalIntro.length);
  }

  function runCommand(rawCommand: string) {
    const cleanCommand = rawCommand.trim();
    const lowerCommand = cleanCommand.toLowerCase();
    const parts = lowerCommand.split(/\s+/).filter(Boolean);
    const output: string[] = [`C:\\PORTFOLIO> ${cleanCommand || ''}`];

    if (!cleanCommand) {
      appendLines(output);
      return;
    }

    if (lowerCommand === 'cls' || lowerCommand === 'clear') {
      resetHistory();
      return;
    }

    if (lowerCommand === 'help' || lowerCommand === '?') {
      output.push(
        'Available commands:',
        'DIR, DIR /GAMES, DIR /LOCAL_LLM, START <APP>, OPEN <APP>',
        'TYPE ABOUT.TXT, TYPE MISSION.TXT, WHOAMI, VER, DATE, TIME, ECHO <TEXT>',
        'POWER OFF, SHUTDOWN, CLS',
        'Apps: ABOUT, GAMES, MINI, LLM, WALLPAPER, THEMES, SKILLS, MODELS, CONTACT, OPENGL, VULKAN, JARVIS, RAG, CODER, VOICE',
      );
      appendLines(output);
      return;
    }

    if (lowerCommand === 'dir' || lowerCommand === 'dir /apps') {
      output.push(
        ...(['about', 'games', 'arcade', 'llm', 'wallpaper', 'themes', 'skills', 'models', 'contact', 'terminal'] as AppId[]).map(
          (app) => `APP      ${appNames[app]}`,
        ),
      );
      appendLines(output);
      return;
    }

    if (lowerCommand === 'dir /games' || lowerCommand === 'dir games') {
      output.push(...projects.map((project) => `GAME     ${project.title}`));
      appendLines(output);
      return;
    }

    if (
      lowerCommand === 'dir /local_llm' ||
      lowerCommand === 'dir local_llm' ||
      lowerCommand === 'dir /llm' ||
      lowerCommand === 'dir llm'
    ) {
      output.push(...localLlmProjects.map((project) => `LLM      ${project.title}`));
      appendLines(output);
      return;
    }

    if (lowerCommand === 'type mission.txt') {
      output.push(
        'Build fast, playful, technically grounded experiences across engines, tools, graphics, and AI.',
      );
      appendLines(output);
      return;
    }

    if (lowerCommand === 'type about.txt') {
      output.push(
        'Kunal Vaghani - Game Developer and Engine Programmer.',
        'Focus: gameplay systems, rendering, custom engines, local AI apps, and useful tools.',
      );
      appendLines(output);
      return;
    }

    if (lowerCommand === 'whoami') {
      output.push('portfolio\\visitor');
      appendLines(output);
      return;
    }

    if (lowerCommand === 'ver') {
      output.push('KunalOS Portfolio Shell v1.0');
      appendLines(output);
      return;
    }

    if (lowerCommand === 'date') {
      output.push(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date()));
      appendLines(output);
      return;
    }

    if (lowerCommand === 'time') {
      output.push(new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(new Date()));
      appendLines(output);
      return;
    }

    if (parts[0] === 'echo') {
      output.push(cleanCommand.slice(5));
      appendLines(output);
      return;
    }

    if (parts[0] === 'start' || parts[0] === 'open') {
      const target = parts.slice(1).join('').replace(/[.\-_\s]/g, '');
      const app = appAliases[target] ?? appAliases[parts[1]];
      if (app) {
        output.push(`Opening ${appNames[app]}...`);
        appendLines(output);
        openApp(app);
        return;
      }
      output.push(`Cannot find app: ${parts.slice(1).join(' ') || '(missing)'}`);
      appendLines(output);
      return;
    }

    if (
      lowerCommand === 'power off' ||
      lowerCommand === 'poweroff' ||
      lowerCommand === 'shutdown' ||
      lowerCommand === 'exit'
    ) {
      output.push('Shutting down KunalOS...');
      appendLines(output);
      window.setTimeout(onPowerOff, 500);
      return;
    }

    output.push(`Bad command or file name: ${cleanCommand}`);
    appendLines(output);
  }

  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(command);
    setCommand('');
  }

  return (
    <div className="terminal-app">
      <div className="terminal-lines" aria-label="Command prompt output">
        {history.map((line) => (
          <p key={line.id}>{line.text}</p>
        ))}
      </div>
      <form className="terminal-input-form" onSubmit={submitCommand}>
        <label className="terminal-prompt" htmlFor="terminal-command">
          C:\PORTFOLIO&gt;
        </label>
        <input
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          aria-label="Command prompt input"
          autoComplete="off"
          spellCheck={false}
        />
        <button className="terminal-submit" type="submit">
          Run
        </button>
      </form>
    </div>
  );
}

function StartMenu({
  openApp,
  onPowerOff,
}: {
  openApp: (app: AppId) => void;
  onPowerOff: () => void;
}) {
  const shortcuts: AppId[] = [
    'about',
    'games',
    'arcade',
    'llm',
    'wallpaper',
    'themes',
    'skills',
    'models',
    'contact',
    'terminal',
  ];

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
        <button className="power-off-button" type="button" onClick={onPowerOff}>
          <span className="menu-icon" aria-hidden="true" />
          Power Off
        </button>
      </div>
    </aside>
  );
}
