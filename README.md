# adihebbalae.github.io

Personal site and project portfolio for Adi Hebbalae — [adihebbalae.github.io](https://adihebbalae.github.io).

Next.js 16 App Router, statically exported and served from GitHub Pages.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Rendering | `output: "export"` — fully static, no server |
| Styling | Tailwind CSS v4 + CSS custom properties in `globals.css` |
| Animation | Framer Motion |
| Icons | lucide-react |
| Hosting | GitHub Pages via `.github/workflows/deploy.yml` |

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> ./out
npm run lint
```

## Layout

```
src/
  app/
    layout.tsx              # metadata, fonts, root shell
    page.tsx                # home: Navbar > Hero > About > Projects > Footer
    projects/<slug>/        # interactive per-project demo pages
  components/
    Navbar · Hero · AboutSection · ProjectsSection · Footer · ScrollToTop
public/                     # images, favicon, .nojekyll
```

The project list is a single `projects` array at the top of
`src/components/ProjectsSection.tsx`. Adding a project means adding one object
there — a `liveUrl` starting with `/` renders as an internal `next/link`,
anything else opens in a new tab.

## Deploying

Any push to `main` triggers the Pages workflow: build, upload `out/` as a Pages
artifact, deploy. No manual step.

## Conventions

- **Every link must resolve.** Repo renames have silently broken project links
  here before — verify a URL 200s before committing it.
- Design tokens live as CSS variables in `globals.css`; use
  `var(--color-primary)` and friends rather than hardcoding hex values.
- Components that use hooks, Framer Motion, or browser APIs need `'use client'`.
- Images are unoptimized by necessity (`next/image` optimization needs a server) —
  compress before adding to `public/`.
