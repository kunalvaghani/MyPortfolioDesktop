import { Simulation } from '@/app/components/SimulationViewer';

/**
 * Dummy simulations representing game/engine projects. Each
 * simulation contains runtime telemetry values like FPS and stability
 * as well as metadata. The layer key determines where it appears in
 * the neural rotator.
 */
const simulations: Simulation[] = [
  {
    id: 'S001',
    name: 'Orbital Mechanics',
    layer: 'simulation',
    status: 'active',
    fps: 144,
    stability: 0.96,
    agentCount: 12,
    renderQuality: 'High',
    description:
      'Real‑time simulation of planetary bodies with accurate gravitational modelling and high‑resolution rendering.',
    metrics: {
      Bodies: '12',
      Integrator: 'RK4',
      'Time Warp': '5x',
    },
    trailer: '',
    github: 'https://github.com/username/orbital-mechanics',
    demo: 'https://demo.example.com/orbital',
  },
  {
    id: 'S002',
    name: 'AI Flocking',
    layer: 'simulation',
    status: 'active',
    fps: 120,
    stability: 0.9,
    agentCount: 50,
    renderQuality: 'Medium',
    description:
      'An emergent behaviour simulation where simple agents interact via steering behaviours to produce complex flock dynamics.',
    metrics: {
      Agents: '50',
      Cohesion: '0.5',
      Separation: '0.3',
    },
    trailer: '',
    github: 'https://github.com/username/ai-flocking',
    demo: 'https://demo.example.com/flocking',
  },
  {
    id: 'S003',
    name: 'Procedural City Builder',
    layer: 'simulation',
    status: 'dormant',
    fps: 60,
    stability: 0.82,
    agentCount: 0,
    renderQuality: 'Ultra',
    description:
      'Generates sprawling cities with dynamic traffic and population simulations. Currently in hibernation awaiting further improvements.',
    metrics: {
      Buildings: '1k',
      Roads: '500km',
      Population: 'Simulated',
    },
    trailer: '',
    github: 'https://github.com/username/procedural-city',
    demo: 'https://demo.example.com/city',
  },
];

export default simulations;