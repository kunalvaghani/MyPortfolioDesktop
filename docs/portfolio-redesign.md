# Portfolio redesign decision

## Decision

KunalOS is no longer the primary portfolio interface.

## Reason

Kunal's career positioning has moved from game/graphics-first toward Software Engineering, AI/ML Systems, Information Retrieval, Local LLM Infrastructure, and Performance Engineering.

A bootable OS interface adds discovery friction for recruiters and obscures the primary technical message. The new root page gives the name, direction, local-hardware differentiator, flagship work, evidence, and contact path in the first viewport.

## Preserved value

KunalOS remains useful evidence of:

- frontend engineering with React, Next.js, and TypeScript;
- browser interaction systems and draggable-window behavior;
- Three.js and graphics work;
- mini-game logic and creative engineering;
- the game/graphics background that preceded local AI systems work.

The final KunalOS source is preserved in git at commit `b5528ed`. `/kunalos` explains the transition without loading the historical 3D or mini-game implementation.

## Design principles

- Recruiter comprehension before novelty
- Calm Material-inspired hierarchy without Google branding
- Accessible contrast, touch targets, focus states, and reduced motion
- Static/server-rendered content by default
- Measured evidence before marketing claims
- Explicit resource constraints rather than decorative AI imagery

## Truthfulness policy

Implementation, testing, benchmarking, documentation, and deployment are independent states. A repository link does not prove all five.

Current portfolio treatment:

- **Local AI Systems Lab:** implemented, tested, benchmarked, and documented for its stated single-user loopback scope; overall maturity remains partial.
- **Multilingual Retrieval Engine:** planned; no result or benchmark is claimed.
- **Local LLM Performance Lab:** implemented, tested, benchmarked, and documented as a track inside the Local AI Systems Lab; retained numbers are scoped to one recorded real local run.

## Content maintenance

Edit `sentient-portfolio/app/data/portfolio.ts`. Keep explanatory copy concise, preserve source links, and attach a qualifying note to measured values. Never publish a phone number or street address through this data model.

## Release record

The redesign was released on 2026-09-01 through the pre-existing Vercel project. That same project ID was later renamed from `sentient-portfolio` to `kunal-vaghani-portfolio`; no duplicate project was created. The canonical production address is `https://kunal-vaghani-portfolio.vercel.app/`, and the former address remains as a compatibility alias.

Release verification included TypeScript, ESLint, an optimized Next.js build, responsive browser checks at three breakpoints, the KunalOS archive route, metadata routes, and Lighthouse. After adding Kunal's portrait and moving profile, education, certifications, and skills ahead of projects, the production Lighthouse result is 91 performance and 100 for accessibility, best practices, and SEO.
