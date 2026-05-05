'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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
  id: 'villageDayNight' | 'homeRobot' | 'voxelForest' | 'indianGada';
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
    id: 'villageDayNight',
    title: 'Village Day / Night',
    summary: 'High-detail village diorama with houses, road, trees, lights, flowers, and car props.',
    image: fallbackArt('Village Day / Night', '#008080'),
  },
  {
    id: 'homeRobot',
    title: 'Home Robot',
    summary: 'High-poly home robot with rounded panels, articulated limbs, optics, and chrome joints.',
    image: fallbackArt('Home Robot', '#2046c7'),
  },
  {
    id: 'voxelForest',
    title: 'Voxel Village Scene',
    summary: 'Minecraft-style block village with pixel textures, chunky trees, water blocks, and cube houses.',
    image: fallbackArt('Voxel Forest Scene', '#007a39'),
  },
  {
    id: 'indianGada',
    title: 'Indian Gada',
    summary: 'Ornate high-detail gold mace with sculpted rings, beads, spikes, and polished metal.',
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
          <ThreeModelViewer model={model} />
          <figcaption>
            <strong>{model.title}</strong>
            <span>{model.summary}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ThreeModelViewer({ model }: { model: ModelAsset }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101623);

    const isTallModel = model.id === 'homeRobot' || model.id === 'indianGada';
    const camera = new THREE.PerspectiveCamera(isTallModel ? 34 : 30, 1, 0.1, 100);
    camera.position.set(3.5, isTallModel ? 2.75 : 2.55, isTallModel ? 5.2 : 4.25);
    camera.lookAt(0, isTallModel ? 1.18 : 0.7, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.domElement.dataset.modelViewer = model.id;
    renderer.domElement.setAttribute('aria-label', `${model.title} rotatable 3D model`);
    renderer.setClearColor(0x101623, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    buildPortfolioModel(model.id, group);
    const bounds = new THREE.Box3().setFromObject(group);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    if (maxSize > 0) {
      group.position.sub(center);
      group.position.y += size.y * 0.5;
      group.scale.setScalar(Math.min(isTallModel ? 1.45 : 1.9, (isTallModel ? 3.35 : 4) / maxSize));
    }

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x73c7ff, 1.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.25, 96),
      new THREE.MeshStandardMaterial({ color: 0x1a2738, roughness: 0.85, metalness: 0.05 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    scene.add(floor);

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;

    const resize = () => {
      const width = Math.max(220, mount.clientWidth);
      const height = Math.max(190, Math.round(width * 0.72));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) {
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      group.rotation.y += dx * 0.01;
      group.rotation.x = Math.max(-0.65, Math.min(0.65, group.rotation.x + dy * 0.007));
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = () => {
      dragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    const animate = () => {
      if (!dragging) {
        group.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      const disposedTextures = new Set<THREE.Texture>();
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture && !disposedTextures.has(value)) {
                value.dispose();
                disposedTextures.add(value);
              }
            });
            material.dispose();
          });
        }
      });
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      mount.replaceChildren();
    };
  }, [model.id, model.title]);

  return (
    <div
      ref={mountRef}
      className="model-viewer-3d"
      role="img"
      aria-label={`${model.title} rotatable 3D model`}
    />
  );
}

function buildPortfolioModel(model: ModelAsset['id'], group: THREE.Group) {
  const pixelTexture = (colors: number[], size = 16) => {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4;
        const color = colors[(x * 3 + y * 5 + ((x ^ y) % colors.length)) % colors.length];
        data[index] = (color >> 16) & 255;
        data[index + 1] = (color >> 8) & 255;
        data[index + 2] = color & 255;
        data[index + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  const blockMaterial = (colors: number[], repeat = 1) => {
    const texture = pixelTexture(colors);
    texture.repeat.set(repeat, repeat);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92 });
  };

  const mat = {
    bark: new THREE.MeshStandardMaterial({ color: 0x76502f, roughness: 0.86 }),
    brick: new THREE.MeshStandardMaterial({ color: 0xb86b45, roughness: 0.78 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: 0xc9d5df, roughness: 0.22, metalness: 0.68 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x111419, roughness: 0.7 }),
    emissiveBlue: new THREE.MeshStandardMaterial({ color: 0x4ed7ff, emissive: 0x1262ff, emissiveIntensity: 1.4, roughness: 0.25 }),
    foliageA: new THREE.MeshStandardMaterial({ color: 0x1f8e4c, roughness: 0.72 }),
    foliageB: new THREE.MeshStandardMaterial({ color: 0x4fa83c, roughness: 0.74 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x85d8ff, roughness: 0.08, metalness: 0.05, transmission: 0.35, transparent: true, opacity: 0.72 }),
    gold: new THREE.MeshPhysicalMaterial({ color: 0xf2c94c, roughness: 0.2, metalness: 0.78 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x2f8f4e, roughness: 0.82 }),
    moss: new THREE.MeshStandardMaterial({ color: 0x6fb448, roughness: 0.88 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xa13b32, roughness: 0.66 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x8d8a7f, roughness: 0.9 }),
    warmLight: new THREE.MeshStandardMaterial({ color: 0xffd77a, emissive: 0xffa51e, emissiveIntensity: 1.25, roughness: 0.35 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x1aa8d8, roughness: 0.1, metalness: 0.02, transmission: 0.25, transparent: true, opacity: 0.76 }),
    white: new THREE.MeshPhysicalMaterial({ color: 0xf3f6f8, roughness: 0.34, metalness: 0.18 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x7a4f2a, roughness: 0.82 }),
  };

  const voxelMat = {
    dirt: blockMaterial([0x6f4325, 0x855531, 0x5b341f, 0x9a6a3f], 1.2),
    grassBlock: blockMaterial([0x2f8f37, 0x41a343, 0x62b24f, 0x2f7c2f], 1.5),
    leafBlock: blockMaterial([0x1f7d34, 0x2f913c, 0x3fa848, 0x165c27], 1.3),
    logBlock: blockMaterial([0x70451f, 0x8a5a2c, 0x563115, 0x9a6738], 1.1),
    plankBlock: blockMaterial([0x9b6838, 0xb47c45, 0x7f4f29, 0xc18a50], 1.2),
    roofBlock: blockMaterial([0x9d332e, 0xb64636, 0x7c2827, 0xca5a42], 1.2),
    stoneBlock: blockMaterial([0x727272, 0x8b8b82, 0x5d5d58, 0xa1a198], 1.25),
    waterBlock: blockMaterial([0x1f75d8, 0x2699e6, 0x3db8ff, 0x1766b2], 1.1),
    glassBlock: blockMaterial([0xffdf78, 0xf7bc3d, 0xffeea6, 0xd99223], 1),
  };

  const add = (mesh: THREE.Mesh, pos?: [number, number, number]) => {
    if (pos) {
      mesh.position.set(...pos);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const box = (size: [number, number, number], pos: [number, number, number], material: THREE.Material, segments = 3) => {
    return add(new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2], segments, segments, segments), material), pos);
  };

  const roundedBox = (
    size: [number, number, number],
    pos: [number, number, number],
    material: THREE.Material,
    radius = 0.08,
    segments = 10,
  ) => {
    const [width, height, depth] = size;
    const safeRadius = Math.min(radius, width * 0.22, height * 0.22);
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + safeRadius, y);
    shape.lineTo(x + width - safeRadius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    shape.lineTo(x + width, y + height - safeRadius);
    shape.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    shape.lineTo(x + safeRadius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    shape.lineTo(x, y + safeRadius);
    shape.quadraticCurveTo(x, y, x + safeRadius, y);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: segments,
      bevelSize: safeRadius * 0.55,
      bevelThickness: safeRadius * 0.55,
      curveSegments: segments * 2,
    });
    geometry.center();
    return add(new THREE.Mesh(geometry, material), pos);
  };

  const cyl = (
    radiusTop: number,
    radiusBottom: number,
    height: number,
    pos: [number, number, number],
    material: THREE.Material,
    segments = 64,
  ) => add(new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 12), material), pos);

  const sphere = (
    radius: number,
    pos: [number, number, number],
    material: THREE.Material,
    widthSegments = 64,
    heightSegments = 32,
  ) => add(new THREE.Mesh(new THREE.SphereGeometry(radius, widthSegments, heightSegments), material), pos);

  const torus = (
    radius: number,
    tube: number,
    pos: [number, number, number],
    material: THREE.Material,
    rotation: [number, number, number] = [0, 0, 0],
  ) => {
    const mesh = add(new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 96), material), pos);
    mesh.rotation.set(...rotation);
    return mesh;
  };

  const addShingleRoof = (x: number, y: number, z: number, width: number, depth: number, material: THREE.Material) => {
    const roof = add(new THREE.Mesh(new THREE.ConeGeometry(width, 0.58, 4, 10), material), [x, y, z]);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = depth / width;
    for (let row = 0; row < 4; row += 1) {
      const shingle = box([width * 1.05, 0.035, 0.045], [x, y - 0.18 + row * 0.09, z - depth * 0.36 + row * 0.15], mat.wood, 2);
      shingle.rotation.x = -0.52;
    }
    return roof;
  };

  const addTree = (x: number, z: number, scale = 1, pine = false) => {
    cyl(0.045 * scale, 0.075 * scale, 0.55 * scale, [x, 0.32 * scale, z], mat.bark, 28);
    if (pine) {
      [0, 1, 2].forEach((level) => {
        const top = add(new THREE.Mesh(new THREE.ConeGeometry((0.33 - level * 0.06) * scale, 0.55 * scale, 28, 6), level % 2 ? mat.foliageB : mat.foliageA), [x, (0.62 + level * 0.23) * scale, z]);
        top.rotation.y = level * 0.35;
      });
    } else {
      sphere(0.24 * scale, [x - 0.08 * scale, 0.72 * scale, z], mat.foliageA, 32, 18);
      sphere(0.22 * scale, [x + 0.14 * scale, 0.77 * scale, z + 0.05 * scale], mat.foliageB, 32, 18);
      sphere(0.2 * scale, [x, 0.95 * scale, z - 0.08 * scale], mat.foliageA, 32, 18);
    }
  };

  const addHouse = (x: number, z: number, width = 0.7, depth = 0.58, colorMaterial: THREE.Material = mat.wood) => {
    roundedBox([width, 0.5, depth], [x, 0.32, z], colorMaterial, 0.035, 6);
    addShingleRoof(x, 0.79, z, width * 0.62, depth, mat.roof);
    box([0.16, 0.26, 0.035], [x - width * 0.18, 0.22, z + depth * 0.52], mat.dark, 2);
    box([0.14, 0.1, 0.04], [x + width * 0.2, 0.4, z + depth * 0.52], mat.warmLight, 2);
    box([0.08, 0.22, 0.08], [x + width * 0.25, 0.82, z - depth * 0.08], mat.brick, 3);
  };

  if (model === 'homeRobot') {
    roundedBox([1.05, 1.22, 0.68], [0, 0.92, 0], mat.white, 0.16, 14);
    roundedBox([0.78, 0.58, 0.62], [0, 1.84, 0], mat.white, 0.14, 14);
    roundedBox([0.66, 0.22, 0.08], [0, 1.87, 0.34], mat.glass, 0.04, 8);
    sphere(0.07, [-0.2, 1.9, 0.39], mat.emissiveBlue, 32, 18);
    sphere(0.07, [0.2, 1.9, 0.39], mat.emissiveBlue, 32, 18);
    roundedBox([0.55, 0.34, 0.06], [0, 0.98, 0.38], mat.dark, 0.04, 8);
    for (let i = 0; i < 6; i += 1) {
      box([0.055, 0.26, 0.075], [-0.22 + i * 0.088, 0.99, 0.43], i % 2 ? mat.emissiveBlue : mat.chrome, 2);
    }
    [-1, 1].forEach((side) => {
      sphere(0.18, [side * 0.66, 1.4, 0], mat.chrome, 32, 18);
      const upper = cyl(0.105, 0.105, 0.64, [side * 0.9, 1.02, 0], mat.white, 48);
      upper.rotation.z = side * 0.22;
      const elbow = sphere(0.13, [side * 0.98, 0.68, 0], mat.chrome, 32, 18);
      elbow.scale.y = 0.78;
      const forearm = cyl(0.09, 0.11, 0.48, [side * 1.02, 0.42, 0.02], mat.white, 48);
      forearm.rotation.z = side * -0.1;
      sphere(0.13, [side * 1.05, 0.16, 0.04], mat.dark, 32, 18);
      [-0.08, 0, 0.08].forEach((offset) => {
        const finger = cyl(0.018, 0.022, 0.2, [side * (1.1 + offset), 0.05, 0.11], mat.dark, 18);
        finger.rotation.x = Math.PI / 2;
      });
    });
    [-1, 1].forEach((side) => {
      const hip = sphere(0.15, [side * 0.32, 0.3, 0], mat.chrome, 32, 18);
      hip.scale.y = 0.72;
      const leg = cyl(0.12, 0.1, 0.46, [side * 0.34, 0.04, 0], mat.white, 48);
      leg.rotation.z = side * 0.05;
      roundedBox([0.35, 0.14, 0.48], [side * 0.34, -0.24, 0.08], mat.dark, 0.05, 8);
    });
    cyl(0.035, 0.045, 0.4, [0, 2.28, 0], mat.dark, 32);
    sphere(0.12, [0, 2.52, 0], mat.emissiveBlue, 40, 20);
    torus(0.68, 0.018, [0, 1.2, 0], mat.chrome, [Math.PI / 2, 0, 0]);
    return;
  }

  if (model === 'indianGada') {
    const alignToDirection = (mesh: THREE.Mesh, direction: THREE.Vector3) => {
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    };
    const coneSpike = (direction: THREE.Vector3, center: THREE.Vector3, baseRadius: number, length: number) => {
      const spike = add(new THREE.Mesh(new THREE.ConeGeometry(baseRadius, length, 32, 8), mat.gold));
      alignToDirection(spike, direction);
      spike.position.copy(center.clone().add(direction.clone().normalize().multiplyScalar(0.64 + length * 0.5)));
      return spike;
    };

    cyl(0.09, 0.11, 2.15, [0, 0.75, 0], mat.gold, 128);
    cyl(0.13, 0.15, 0.26, [0, -0.26, 0], mat.gold, 128);
    const pommel = sphere(0.22, [0, -0.46, 0], mat.gold, 96, 48);
    pommel.scale.y = 0.72;
    [-0.14, 0.18, 0.5, 0.82, 1.14].forEach((y) => {
      torus(0.155, 0.022, [0, y, 0], mat.gold, [Math.PI / 2, 0, 0]);
      torus(0.102, 0.014, [0, y + 0.09, 0], mat.gold, [Math.PI / 2, 0, 0]);
    });
    for (let row = 0; row < 4; row += 1) {
      for (let i = 0; i < 12; i += 1) {
        const angle = (Math.PI * 2 * i) / 12 + row * 0.25;
        sphere(
          0.022,
          [Math.cos(angle) * 0.125, 0.04 + row * 0.24, Math.sin(angle) * 0.125],
          mat.gold,
          16,
          10,
        );
      }
    }
    cyl(0.36, 0.48, 0.42, [0, 1.64, 0], mat.gold, 128);
    const headCenter = new THREE.Vector3(0, 2.18, 0);
    const head = sphere(0.68, [headCenter.x, headCenter.y, headCenter.z], mat.gold, 128, 64);
    head.scale.y = 0.92;
    torus(0.54, 0.035, [0, 2.18, 0], mat.gold, [Math.PI / 2, 0, 0]);
    torus(0.46, 0.026, [0, 2.18, 0], mat.gold, [0, Math.PI / 2, 0]);
    torus(0.46, 0.026, [0, 2.18, 0], mat.gold, [0, 0, Math.PI / 2]);
    Array.from({ length: 16 }).forEach((_, index) => {
      const angle = (Math.PI * 2 * index) / 16;
      coneSpike(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)), headCenter, 0.065, 0.34);
    });
    [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)].forEach((direction) => {
      coneSpike(direction, headCenter, 0.07, 0.32);
    });
    Array.from({ length: 24 }).forEach((_, index) => {
      const angle = (Math.PI * 2 * index) / 24;
      sphere(0.032, [Math.cos(angle) * 0.42, 2.72, Math.sin(angle) * 0.42], mat.gold, 18, 10);
      sphere(0.028, [Math.cos(angle) * 0.34, 1.55, Math.sin(angle) * 0.34], mat.gold, 18, 10);
    });
    return;
  }

  const stage = roundedBox([3.35, 0.12, 2.58], [0, -0.03, 0], mat.grass, 0.05, 6);
  stage.receiveShadow = true;

  if (model === 'voxelForest') {
    stage.visible = false;
    const unit = 0.22;
    const voxel = (gx: number, gy: number, gz: number, material: THREE.Material, size: [number, number, number] = [1, 1, 1]) => {
      box(
        [unit * size[0], unit * size[1], unit * size[2]],
        [gx * unit, gy * unit + (unit * size[1]) / 2, gz * unit],
        material,
        1,
      );
    };
    const cubeStack = (gx: number, gz: number, height: number, material: THREE.Material) => {
      for (let y = 0; y < height; y += 1) {
        voxel(gx, y, gz, material);
      }
    };
    const addVoxelTree = (gx: number, gz: number, height = 3) => {
      cubeStack(gx, gz, height, voxelMat.logBlock);
      for (let y = height - 1; y <= height + 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
          for (let z = -1; z <= 1; z += 1) {
            if (Math.abs(x) + Math.abs(z) < 3 && !(x === 0 && z === 0 && y < height)) {
              voxel(gx + x, y, gz + z, voxelMat.leafBlock);
            }
          }
        }
      }
      voxel(gx, height + 2, gz, voxelMat.leafBlock);
    };
    const addVoxelHouse = (gx: number, gz: number, width: number, depth: number) => {
      for (let x = 0; x < width; x += 1) {
        for (let z = 0; z < depth; z += 1) {
          if (x === 0 || z === 0 || x === width - 1 || z === depth - 1) {
            voxel(gx + x, 1, gz + z, voxelMat.plankBlock);
            voxel(gx + x, 2, gz + z, voxelMat.plankBlock);
          }
        }
      }
      voxel(gx + 1, 1, gz, mat.dark);
      voxel(gx + width - 2, 2, gz, voxelMat.glassBlock);
      for (let layer = 0; layer < 3; layer += 1) {
        for (let x = -layer; x < width + layer; x += 1) {
          for (let z = -layer; z < depth + layer; z += 1) {
            const edge = x === -layer || z === -layer || x === width + layer - 1 || z === depth + layer - 1;
            if (edge || layer === 2) {
              voxel(gx + x, 3 + layer, gz + z, voxelMat.roofBlock);
            }
          }
        }
      }
      voxel(gx + width, 2, gz + depth - 1, voxelMat.stoneBlock);
      voxel(gx + width, 3, gz + depth - 1, voxelMat.stoneBlock);
    };

    for (let gx = -7; gx <= 7; gx += 1) {
      for (let gz = -5; gz <= 5; gz += 1) {
        const pond = gx >= 2 && gx <= 5 && gz >= -4 && gz <= -2;
        voxel(gx, -1, gz, voxelMat.dirt);
        voxel(gx, 0, gz, pond ? voxelMat.waterBlock : voxelMat.grassBlock);
      }
    }
    addVoxelHouse(-5, -1, 4, 4);
    addVoxelHouse(1, 0, 3, 3);
    addVoxelTree(-7, -4, 3);
    addVoxelTree(6, 2, 4);
    addVoxelTree(-1, 4, 3);
    addVoxelTree(6, -5, 3);
    addVoxelTree(-6, 5, 4);
    for (let i = 0; i < 26; i += 1) {
      const gx = -7 + (i * 3) % 15;
      const gz = -5 + (i * 5) % 11;
      if (!(gx >= 2 && gx <= 5 && gz >= -4 && gz <= -2)) {
        voxel(gx, 1, gz, i % 3 ? voxelMat.leafBlock : voxelMat.stoneBlock, [0.42, 0.42, 0.42]);
      }
    }
    [-2, -1, 0, 1, 2].forEach((gx) => {
      voxel(gx, 1, -5, voxelMat.plankBlock, [1, 0.25, 1]);
    });
    return;
  }

  addHouse(-0.9, -0.35, 0.74, 0.62, mat.wood);
  addHouse(0.78, 0.38, 0.76, 0.6, mat.brick);
  addHouse(0.05, -0.88, 0.64, 0.55, mat.wood);
  addHouse(-1.15, 0.72, 0.56, 0.5, mat.stone);
  const road = roundedBox([2.8, 0.035, 0.34], [0.18, 0.035, -0.12], mat.stone, 0.04, 8);
  road.rotation.y = -0.22;
  roundedBox([0.5, 0.18, 0.22], [1.05, 0.14, -0.5], mat.emissiveBlue, 0.04, 8);
  sphere(0.06, [0.86, 0.25, -0.39], mat.dark, 18, 10);
  sphere(0.06, [1.2, 0.25, -0.6], mat.dark, 18, 10);
  [[-1.4, 0.95, 0.8], [1.25, -0.82, 0.8], [1.38, 0.92, 0.68], [-1.45, -0.95, 0.62]].forEach(([x, z, scale], index) => {
    addTree(x, z, scale, index % 2 === 1);
  });
  [-1.1, -0.55, 0.1, 0.78, 1.34].forEach((x, index) => {
    cyl(0.018, 0.025, 0.62, [x, 0.33, 0.08 + (index % 2) * 0.18], mat.dark, 24);
    sphere(0.07, [x, 0.69, 0.08 + (index % 2) * 0.18], index % 2 ? mat.warmLight : mat.emissiveBlue, 24, 12);
  });
  for (let i = 0; i < 28; i += 1) {
    const flower = sphere(0.025, [-1.55 + (i % 8) * 0.42, 0.08, -1.12 + Math.floor(i / 8) * 0.45], i % 3 ? mat.warmLight : mat.emissiveBlue, 12, 8);
    flower.scale.y = 0.55;
  }
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
