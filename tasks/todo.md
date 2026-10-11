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
- [ ] Browser QA 375/768/1440, reduced motion, console clean (desktop 1440 hero/about/services/experience done; rest pending — user asked to pause browser windows)

## Review
- tsc / eslint / `pnpm build` green; `out/en.html` + `out/es.html` contain every project, job, bullet, press outlet and email.
- Bugs found in QA and fixed: WebGL canvas hidden behind body background (moved fallback bg to `html`, content layer `z-10` over stage `z-0`); washed-out colors from sRGB/tone-mapping (`<Canvas flat linear>`); headline words lost spaces (SplitWords); wrapped name broke particle sampling (now word-by-word via DOM Ranges).
- Open: one headed run loaded scrolled to ~14% — likely the user's own wheel input on the popped window; re-check. Mobile 375 + reduced-motion + games still need a visual pass.
- Optional assets: `/public/images/me-cutout.webp` (`HAS_CUTOUT` in about/portrait.tsx), `/public/media/<slug>.mp4` (`PROJECT_MEDIA` in projects/project-screen.tsx).
