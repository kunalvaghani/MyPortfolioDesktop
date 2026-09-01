# Kunal Vaghani Portfolio

This repository contains the source for [sentient-portfolio.vercel.app](https://sentient-portfolio.vercel.app/). The application lives in `sentient-portfolio/` and uses the Next.js App Router.

## Why the homepage changed

The previous homepage was KunalOS: a bootable Windows-inspired portfolio focused on games, graphics, draggable windows, mini-games, and interactive browser demos. It was creative technical work, but it delayed the information recruiters need most and no longer matched Kunal's primary direction.

The root route now leads with Software Engineering and AI/ML Systems: local LLM infrastructure, agent runtimes, retrieval, evaluation, reliability, C++ performance work, and hardware-aware inference. The old interface remains recoverable at git commit `b5528ed` and is documented at `/kunalos`.

## Information architecture

1. Immediate role and local-AI constraint
2. Connected platform architecture
3. Flagship projects with separate delivery states
4. Engineering methodology
5. Relevant experience and graphics foundation
6. Skills by engineering domain
7. Education, certifications, and contact

Portfolio claims live in `sentient-portfolio/app/data/portfolio.ts`. A project may independently be planned, implemented, tested, benchmarked, documented, or deployed. Do not add a benchmark number without a retained repository artifact.

## Local development

```powershell
cd sentient-portfolio
npm ci
npm run dev
```

## Verification

```powershell
npm run typecheck
npm run lint
npm run build
npm run start
npm run qa
```

The QA script accepts `PORTFOLIO_URL` and captures responsive screenshots under `sentient-portfolio/qa-artifacts/`.

## Deployment

Production remains attached to the existing Vercel project that owns `sentient-portfolio.vercel.app`. Never allow an unlinked CLI command to create a replacement project. Verify `.vercel/project.json`, the authenticated scope, project ID, and production alias before deploying.

Required release order:

1. Local production build and browser QA
2. Preview deployment
3. Preview browser and visual verification
4. Promote the verified artifact or deploy it to production using the existing workflow
5. Re-run QA against `https://sentient-portfolio.vercel.app/`

The 2026-09-01 redesign followed this sequence: preview deployment, authenticated route verification, promotion of that preview, public production route verification, and full production browser QA.
