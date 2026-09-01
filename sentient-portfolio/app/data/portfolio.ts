export type DeliveryState =
  | 'planned'
  | 'in-development'
  | 'implemented'
  | 'tested'
  | 'benchmarked'
  | 'documented'
  | 'deployed';

export type Evidence = {
  label: string;
  value: string;
  note?: string;
};

export type FlagshipProject = {
  number: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  constraint: string;
  architecture: string[];
  depth: string;
  states: DeliveryState[];
  evidence: Evidence[];
  technologies: string[];
  repository?: string;
  documentation?: string;
};

export const profile = {
  name: 'Kunal Vaghani',
  eyebrow: 'Software engineer · AI/ML systems',
  headline: 'Building local AI systems for constrained hardware.',
  introduction:
    'I am an AI & Data Science student building inspectable systems across local LLM inference, agent runtimes, retrieval, evaluation, reliability, and hardware-aware optimization.',
  email: 'kunalvaghani35@gmail.com',
  github: 'https://github.com/kunalvaghani',
  linkedin: 'https://www.linkedin.com/in/kunal-vaghani-b19217235/',
  labRepository: 'https://github.com/kunalvaghani/Local-AI-System-Lab',
};

export const hardwareContext = [
  { label: 'GPU', value: 'RTX 3050', detail: '4 GB VRAM' },
  { label: 'CPU', value: 'Ryzen 7', detail: '8 cores' },
  { label: 'Memory', value: '32 GB', detail: 'system RAM' },
  { label: 'Operating target', value: 'Fully local', detail: 'no paid inference API' },
];

export const flagshipProjects: FlagshipProject[] = [
  {
    number: '01',
    title: 'Local AI Systems Lab',
    kicker: 'Flagship runtime',
    summary:
      'An inspectable local AI runtime that makes scheduling, routing, permissions, recovery, traces, and hardware constraints explicit.',
    problem:
      'Agent frameworks often hide the mechanics that determine reliability. This lab exposes those decisions as testable runtime components.',
    constraint:
      'A single-user, loopback system designed around a laptop RTX 3050 with 4 GB VRAM rather than elastic cloud compute.',
    architecture: [
      'Explicit agent state machine',
      'Bounded FIFO / priority scheduler',
      'Model registry and explained routing',
      'Exact-grant tools',
      'SQLite checkpoints and recovery',
      'Hash-chained trace and replay',
    ],
    depth:
      'The release exercises cancellation, deadline and aging policy, guarded tool access, deterministic replay, controlled fault injection, and one retained real llama.cpp inference.',
    states: ['implemented', 'tested', 'benchmarked', 'documented'],
    evidence: [
      { label: 'Backend', value: '154 tests passed', note: 'Retained Stage 26 acceptance evidence' },
      { label: 'Frontend', value: '39 tests passed', note: 'Retained Stage 26 acceptance evidence' },
      { label: 'Release', value: 'Candidate', note: 'Single-user loopback scope; overall maturity remains partial' },
    ],
    technologies: ['Python', 'TypeScript', 'React', 'SQLite', 'llama.cpp', 'SSE', 'C++ runtime'],
    repository: 'https://github.com/kunalvaghani/Local-AI-System-Lab',
    documentation:
      'https://github.com/kunalvaghani/Local-AI-System-Lab/blob/main/docs/portfolio/README.md',
  },
  {
    number: '02',
    title: 'Multilingual Retrieval Engine',
    kicker: 'Planned platform track',
    summary:
      'A local information-retrieval track for English, Hindi, and Gujarati, designed around lexical, dense, and reranked evidence.',
    problem:
      'A useful local knowledge system needs measurable retrieval quality and citations, not only a document upload and chat surface.',
    constraint:
      'Multilingual and transliterated queries must remain reproducible and resource-aware on the same consumer machine.',
    architecture: [
      'Tokenizer and inverted index',
      'BM25 lexical retrieval',
      'Vector retrieval',
      'Hybrid score fusion',
      'Reranking and citations',
      'Recall, MRR, NDCG evaluation',
    ],
    depth:
      'The intended work isolates retrieval, reranking, and citation correctness so each stage can be evaluated independently before generation is added.',
    states: ['planned'],
    evidence: [
      { label: 'Current truth', value: 'Architecture planned', note: 'No benchmark or implementation claim is published' },
    ],
    technologies: ['Python', 'C++', 'BM25', 'Vector search', 'Hybrid retrieval', 'Evaluation'],
  },
  {
    number: '03',
    title: 'Local LLM Performance Lab',
    kicker: 'Measured systems track',
    summary:
      'A hardware-aware inference track inside the Local AI Systems Lab for comparing guarded model profiles and resource tradeoffs.',
    problem:
      'A model that fits is not automatically a usable model. Configuration choices must be tied to latency, memory, failure, and workload evidence.',
    constraint:
      'Quantized llama.cpp inference must stay within a 4 GB VRAM envelope while preserving a practical local response path.',
    architecture: [
      'Live hardware profiling',
      'Admission policy',
      'Model and profile registry',
      'GPU / CPU offload controls',
      'Benchmark runner',
      'Regression gates',
    ],
    depth:
      'Measured profiles remain model-specific and intentionally avoid universal performance claims. The current evidence covers one real Qwen/llama.cpp backend.',
    states: ['implemented', 'tested', 'benchmarked', 'documented'],
    evidence: [
      { label: 'TTFT', value: '1,801.341 ms', note: 'One retained real local inference' },
      { label: 'Generation', value: '103.47 tokens/s', note: 'Same retained run; not a universal model claim' },
      { label: 'Peak delta', value: '1,189 MiB VRAM', note: 'Process delta recorded by the release gate' },
    ],
    technologies: ['llama.cpp', 'Qwen2.5', 'GGUF', 'CUDA', 'Python', 'Hardware telemetry'],
    repository: 'https://github.com/kunalvaghani/Local-AI-System-Lab',
    documentation:
      'https://github.com/kunalvaghani/Local-AI-System-Lab/blob/main/docs/portfolio/benchmark-methodology-and-results.md',
  },
];

export const platformLayers = [
  { label: 'Interfaces', items: ['React workbench', 'CLI', 'Loopback API'] },
  { label: 'Runtime', items: ['Agent state', 'Scheduler', 'Model router'] },
  { label: 'Evidence', items: ['Hybrid retrieval', 'Reranker', 'Citations'] },
  { label: 'Inference', items: ['llama.cpp', 'Profiles', 'Hardware admission'] },
];

export const crossCuttingSystems = ['Security', 'Reliability', 'Observability', 'Evaluation', 'Fault injection'];

export const methodology = ['Baseline', 'Profile', 'Bottleneck', 'Hypothesis', 'Change', 'Benchmark', 'Keep / revert'];

export const experience = [
  {
    organization: 'Nuno4 Games',
    role: 'C++ and Unreal engineering work',
    period: 'Previous engineering experience',
    description:
      'Gameplay and real-time systems work grounded in profiling, debugging, performance analysis, and production constraints.',
    tags: ['C++', 'Unreal Engine', 'Gameplay systems', 'Profiling', 'Debugging'],
  },
  {
    organization: 'Independent systems work',
    role: 'Local AI runtime engineering',
    period: 'Current focus',
    description:
      'Designing a local-first runtime with explicit scheduling, model routing, recovery, security controls, observability, and acceptance evidence.',
    tags: ['Python', 'llama.cpp', 'SQLite', 'Reliability', 'Evaluation'],
  },
];

export const foundationProjects = [
  {
    title: 'OpenGL Game Engine',
    description: 'Custom C++ rendering and engine work covering input, assets, lighting, and performance-sensitive real-time loops.',
    tags: ['C++', 'OpenGL', 'SDL', 'Rendering'],
    href: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
  {
    title: 'Vulkan Game Engine',
    description: 'Explicit graphics resource management across swapchains, buffers, textures, depth, shaders, and synchronization-oriented design.',
    tags: ['C++', 'Vulkan', 'GPU resources', 'Shaders'],
    href: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
  {
    title: 'Game AI and pathfinding',
    description: 'Navigation and behavior experiments that connect algorithmic reasoning with real-time, observable agent state.',
    tags: ['A*', 'Dijkstra', 'Behavior systems', 'Debugging'],
    href: 'https://github.com/kunalvaghani/Kunals_Repo',
  },
];

export const skillGroups = [
  {
    title: 'AI / ML systems',
    items: ['Local LLM inference', 'Agent runtimes', 'Model routing', 'Evaluation', 'Embeddings', 'Machine learning'],
  },
  {
    title: 'Information retrieval',
    items: ['BM25', 'Inverted indexes', 'Vector search', 'Hybrid retrieval', 'Reranking', 'Multilingual retrieval'],
  },
  {
    title: 'Systems / performance',
    items: ['C++', 'Python', 'Concurrency', 'Memory management', 'Profiling', 'Latency and throughput', 'Linux'],
  },
  {
    title: 'Data / tooling',
    items: ['SQL', 'SQLite', 'Git', 'Testing', 'Reproducibility', 'Observability'],
  },
  {
    title: 'Graphics foundation',
    items: ['Unreal Engine', 'OpenGL', 'Vulkan', 'Rendering', 'Real-time game systems'],
  },
];

export const education = [
  {
    institution: 'Parul University',
    credential: 'B.Tech · Artificial Intelligence and Data Science',
    period: '2026–2030',
    primary: true,
  },
  {
    institution: 'Humber College',
    credential: 'Advanced Diploma · Game Programming',
    period: '2022–2024',
    primary: false,
  },
];

export const certifications = [
  { issuer: 'Kaggle', title: 'Intro to Machine Learning', date: 'Aug 2026' },
  {
    issuer: 'Microsoft Applied Skills',
    title: 'Develop a Generative AI Chat App Using the Microsoft Foundry SDK',
    date: 'Aug 2026',
  },
  {
    issuer: 'Microsoft Applied Skills',
    title: 'Enhance agents with autonomous capabilities',
    date: 'Aug 2026',
  },
];

export const recognition = 'Dean’s List recognition · Humber College';
