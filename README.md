# juanirmariani.com

My personal portfolio, designed as an **interactive Claude Code session** — because agentic AI tooling is genuinely how I work, the site presents itself as one: typed commands, expandable tool calls (`● Task(cuonti)`), a blinking block cursor, and section headers like `$ git log --work`.

**Live: [juanirmariani.com](https://juanirmariani.com)** · [/en](https://juanirmariani.com/en) · [/es](https://juanirmariani.com/es)

## Stack

- **Next.js 16** (App Router, static export) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (OKLCH tokens, CSS-only grain/scanlines/glow effects)
- **Motion** for the terminal reveal animations
- Fonts: [Departure Mono](https://departuremono.com) (display) · [Commit Mono](https://commitmono.com) (terminal body) · Schibsted Grotesk (prose)
- Deployed on **Cloudflare Workers** (static assets, `wrangler.jsonc`)

## Design principles

- **SEO-first animation**: every word lives in the prerendered HTML; the typing effect is a progressive reveal layered on top. No JS, crawlers, and `prefers-reduced-motion` users all get the full content instantly. There's also a "skip animation" button.
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

Built with [Claude Code](https://claude.com/claude-code) — fittingly.
