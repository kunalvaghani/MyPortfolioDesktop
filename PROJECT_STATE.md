# Current Project State

## Active Project

Portfolio redesign

## Current Milestone

Recruiter-facing AI/ML systems portfolio, verification, and same-project Vercel release

## Current Subsystem

Production release complete; ongoing content maintenance

## Last Completed Work

- Reconstructed the clean `main` stopping point at `b5528ed`.
- Confirmed `sentient-portfolio/` as the sole application root in this repository.
- Confirmed the production root still served the KunalOS BIOS experience before implementation.
- Verified the public `Local-AI-System-Lab` repository and its retained release evidence.
- Replaced the root route with a recruiter-first AI/ML systems portfolio.
- Preserved KunalOS as a lightweight archive route and exact git-history link.
- Upgraded the application to Next.js 16.3.4 and React 19.2.0.
- Removed unused historical client dependencies from the production application.
- Verified, previewed, and promoted the release to the existing Vercel project.

## Currently Working On

No active implementation work. The deployed portfolio is the verified release baseline.

## Current Blockers

None. The Vercel connector is scoped to a different team, but the authenticated local CLI resolved and linked the existing personal project unambiguously.

## Important Decisions

- KunalOS is no longer the primary portfolio interface.
- The root page is static/server-rendered except for the mobile navigation control.
- The Three.js and mini-game implementation is not imported by the root route.
- Project delivery states remain separate and evidence-backed.
- The multilingual retrieval engine is shown as planned; no implementation or benchmark is claimed.
- The Local LLM Performance Lab is presented as a measured track within `Local-AI-System-Lab`, not as a separate completed repository.

## Tests Passing

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities
- Responsive browser QA at 390×844, 768×1024, and 1440×1000
- Production route QA for `/`, `/kunalos`, `/robots.txt`, and `/sitemap.xml`
- Lighthouse: 96 performance, 100 accessibility, 100 best practices, 100 SEO; CLS 0

## Known Problems

- LinkedIn blocks Firecrawl extraction, so supplied current profile facts are retained without invented credential URLs.
- The Browserslist data emits a non-blocking age warning during builds.

## Performance Baseline

Local production Lighthouse on 2026-09-01: performance 96, accessibility 100, best practices 100, SEO 100; FCP 1.1 s, LCP 2.7 s, TBT 60 ms, CLS 0, Speed Index 2.1 s.

The emitted static chunks contain no Three.js, React Three Fiber, Framer Motion, or d3-force signatures.

## Next Step

Keep project delivery states and retained benchmark evidence current as the AI systems work evolves.

## Later Backlog

- Implement and benchmark the multilingual retrieval track before changing its status.
- Add current credential URLs only when verified.
