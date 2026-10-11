# Ember rework — `feat/ember-rework`

Plan: `~/.claude/plans/eager-soaring-eagle.md`

## Core (lead)
- [x] Branch + deps (three, R3F, drei, postprocessing, gsap, @gsap/react, lenis)
- [x] Tokens / globals.css (ember palette, utilities)
- [x] `fx/scene/*` stage + ember field shader + store
- [x] smooth-scroll (Lenis ↔ ScrollTrigger)
- [x] cursor, magnetic, scramble-text, tilt-card, count-up, marquee, scroll-hud
- [x] achievements context + toasts
- [x] SectionShell redesign, page.tsx layout, header, ui.ts strings
- [x] Protective commit

## Feature agents (parallel)
- [x] A: hero 3D name particles + preloader
- [x] B: experience git graph + how-I-work orbit
- [x] C: skills breakout + projects bento + press drag
- [x] D: terminal + konami + contact + services/about

## Integration
- [x] typecheck / lint / build green
- [x] `out/en.html` + `out/es.html` keep all text
- [x] Browser QA 375/1440 all sections, terminal, breakout, reduced motion, console clean

## Review
- tsc / eslint / `pnpm build` green; `out/en.html` + `out/es.html` contain every project, job, bullet, press outlet and email.
- Bugs found in QA and fixed: WebGL canvas hidden behind body background (moved fallback bg to `html`, content layer `z-10` over stage `z-0`); washed-out colors from sRGB/tone-mapping (`<Canvas flat linear>`); headline words lost spaces (SplitWords); wrapped name broke particle sampling (now word-by-word via DOM Ranges).
- QA round 2: load starts at scrollY 0 (earlier 14% was external wheel input). Fixed: blown-out flames at page end (shader highlight roll-off, contact heat 0.85); small/noisy mobile particle name (bigger mobile type, tighter jitter, 7k budget); hydration mismatch under reduced motion (`useReducedMotion` → `useSyncExternalStore` with server snapshot). 375px: no horizontal overflow.
- Optional assets: `/public/images/me-cutout.webp` (`HAS_CUTOUT` in about/portrait.tsx), `/public/media/<slug>.mp4` (`PROJECT_MEDIA` in projects/project-screen.tsx).
