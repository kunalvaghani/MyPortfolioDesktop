import { Memory } from '@/app/components/MemoryViewer';

/**
 * Dummy memory fragments representing past projects. Each memory has a
 * confidence (depicted by the ring), an emotion label, a stability
 * factor and a set of tags. Memories are assigned to a layer to
 * control where they appear in the neural interface.
 */
const memories: Memory[] = [
  {
    id: 'M001',
    name: 'Autonomous Drone Navigation',
    layer: 'decision',
    tags: ['ML', 'Robotics'],
    confidence: 0.9,
    emotion: 'Curiosity',
    stability: 0.92,
    description:
      'Developed a reinforcement learning system enabling drones to navigate complex environments without GPS, using only onboard sensors.',
    tech: ['Python', 'PyTorch', 'OpenAI Gym', 'ROS'],
    metrics: {
      'Training Accuracy': '94%',
      'Inference Latency': '50ms',
      Episodes: '10k',
    },
    github: 'https://github.com/username/drone-nav',
    demo: 'https://demo.example.com/drone-nav',
  },
  {
    id: 'M002',
    name: 'Financial Fraud Detection',
    layer: 'perception',
    tags: ['ML', 'Security'],
    confidence: 0.85,
    emotion: 'Vigilance',
    stability: 0.88,
    description:
      'Built a machine learning pipeline to detect anomalous transactions in real time, leveraging unsupervised clustering and supervised classification.',
    tech: ['Python', 'Scikit‑Learn', 'Pandas', 'SQL'],
    metrics: {
      Precision: '92%',
      Recall: '89%',
      Throughput: '5k tx/s',
    },
    github: 'https://github.com/username/fraud-detection',
    demo: 'https://demo.example.com/fraud-detection',
  },
  {
    id: 'M003',
    name: 'Chatbot Dialogue System',
    layer: 'decision',
    tags: ['NLP', 'UX'],
    confidence: 0.78,
    emotion: 'Empathy',
    stability: 0.86,
    description:
      'Implemented a conversational agent capable of carrying out customer support tasks with natural language understanding and generation.',
    tech: ['Python', 'TensorFlow', 'Transformers', 'Node.js'],
    metrics: {
      'BLEU Score': '0.65',
      'User Satisfaction': '4.6/5',
      Sessions: '15k',
    },
    github: 'https://github.com/username/chatbot',
    demo: 'https://demo.example.com/chatbot',
  },
  {
    id: 'M004',
    name: 'Interactive Portfolio',
    layer: 'expression',
    tags: ['Web', '3D'],
    confidence: 0.95,
    emotion: 'Pride',
    stability: 0.93,
    description:
      'A fully interactive, three‑dimensional web portfolio showcasing projects with physics‑based interactions and real‑time graphics.',
    tech: ['Next.js', 'React', 'Three.js', 'Framer Motion'],
    metrics: {
      'Build Size': '1.2MB',
      'Average FPS': '60+',
      'Visitors': '20k+',
    },
    github: 'https://github.com/username/interactive-portfolio',
    demo: 'https://portfolio.example.com',
  },
];

export default memories;