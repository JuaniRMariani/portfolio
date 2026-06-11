# juanirmariani.com

My personal portfolio, designed as a **technical editorial** — an engineering magazine layout: oversized display type, numbered sections (`01 ── ABOUT ─── +`), hairline blueprint grids and CAD-style annotations, in ink navy + electric orange.

**Live: [juanirmariani.com](https://juanirmariani.com)** · [/en](https://juanirmariani.com/en) · [/es](https://juanirmariani.com/es)

## Stack

- **Next.js 16** (App Router, static export) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (OKLCH tokens, CSS-only grain/grid/glow effects)
- **Motion** for the staggered reveal animations
- Fonts: Bricolage Grotesque (display) · Schibsted Grotesk (body) · [Commit Mono](https://commitmono.com) (annotations)
- Deployed on **Cloudflare Workers** (static assets, `wrangler.jsonc`)

## Design principles

- **SEO-first animation**: every word lives in the prerendered HTML; the entrance animation is a progressive reveal layered on top. No JS, crawlers, and `prefers-reduced-motion` users all get the full content instantly. There's also a "skip intro" button.
- **Bilingual by routes**: `/en` and `/es` are two statically generated pages with reciprocal hreflang — not a client-side toggle.
- **Typed content layer**: all copy lives in `src/content/` as `{ en, es }` fields, so the two languages can't drift apart.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # static export to out/
pnpm lint
pnpm typecheck
```

---

Built with [Claude Code](https://claude.com/claude-code).
