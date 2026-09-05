import type { Project } from '@/data/types';

/**
 * PRIVACY — read before editing.
 *
 * Cortex runs over the owner's real notes. Nothing on this page may describe
 * what is in them: no screenshots, no images, no sample content, no note or
 * page titles, no vault directory structure, no counts of personal notes,
 * pages or bookmarks, no project names taken from the vault. Architecture,
 * engineering decisions and counts of CODE are the whole allowed surface.
 *
 * The repo is PRIVATE (gh repo view, 2026-08-01: visibility PRIVATE). It must
 * not be linked. links stays {} and sourcePrivate stays true.
 *
 * Numbers verified against a local checkout on 2026-08-01, not from the corpus
 * record, which has drifted:
 *   - 80 commits total across master + two feature branches, 2026-04-05 to
 *     2026-08-01, single author (git rev-list --count --all, git shortlog -sne --all)
 *   - 286 tracked files on the active branch feat/organizer-integration
 *     (master has 249; the corpus says 292, which matches neither)
 *   - 66 Vitest test files on that branch; vitest.config.ts excludes e2e/, so
 *     the corpus figure of 68 is the Vitest files plus the 2 Playwright specs
 *   - 23 Express route modules, 44 non-test modules in server/lib
 *   - 11 MCP tools (server/mcp-server.ts, 11 server.tool() calls in mcp-tools.ts)
 *   - 8-path write allowlist (README "Write-back Policy")
 *
 * The folder is `brain2`; the product is Cortex — use Cortex. Nothing here may
 * claim users, deployment or distribution: it runs on localhost for one person.
 */
const brain2: Project = {
  slug: 'brain2',
  title: 'Cortex',

  tagline: {
    recruiter: 'A local-only dashboard over my own files: projects, deadlines, TODOs, notes.',
    builder: 'The filesystem is the database, so there is nothing to import and nothing to lose.',
  },

  summary: {
    recruiter:
      'Cortex reads markdown that already exists on disk and puts all of it behind one local web UI. There is no database, no accounts and no hosted backend; it runs on localhost for a single user. React and Vite on the front, Express on the back, both TypeScript, with an optional Electron shell, an 11-tool MCP server, and optional local AI through Ollama. 80 commits, 286 tracked files and 66 Vitest test files, sole author, April to August 2026.',
    builder:
      'Every personal dashboard I had tried wanted me to import my notes into it, and then the notes lived in two places. Cortex never owns the data: it parses the markdown that is already there and writes back into the original files, under an allowlist of eight paths it is permitted to touch. That constraint is the reason the feature count got as far as it did: once the blast radius was written down, everything after it was cheap to add.',
  },

  role: 'Sole developer',
  period: 'Apr 2026 – Present',
  status: 'in-progress',
  depth: 'full',
  category: ['Developer Tools', 'Web App'],

  tech: [
    'TypeScript',
    'React 18',
    'Vite',
    'Tailwind CSS',
    'Express',
    'Electron',
    'better-sqlite3',
    'Vitest',
    'Playwright',
    'Recharts',
    'D3',
    'Ollama',
    'Model Context Protocol',
    'Google Calendar API',
  ],

  metrics: [
    {
      value: '80',
      label: 'Commits across three branches, sole author, April to August 2026',
    },
    {
      value: '286',
      label: 'Tracked files on the active branch, 66 of them Vitest test files',
    },
    {
      value: '23',
      label: 'Express route modules over one filesystem substrate',
    },
    {
      value: '11',
      label: 'MCP tools exposing the same data to Claude Desktop',
    },
    {
      value: '8',
      label: 'Paths the app may write to. Read-only everywhere else.',
    },
    {
      value: '1',
      label: 'User. It runs on localhost and was never deployed.',
    },
  ],

  links: {},
  sourcePrivate: true,

  sections: [
    {
      heading: 'The filesystem is the database',
      body: `A scanner walks the projects directory looking for a state file in a fixed priority order, starting with agent_state.md and falling back to README.md, and pulls status, last-modified date and next steps out of whichever it finds first. Anything untouched for 14 or 30 days gets flagged as stale. A second pass reads every markdown file across the projects tree and the notes vault for unchecked boxes and TODO, FIXME and HACK markers, and groups what it finds by project.

Nothing is imported. There is no schema, no sync step and no migration, because the parse happens on read and the files stay where they were. Which is also why the surface count got large: 23 Express route modules sit on one substrate, and adding a feature means writing a parser and a route rather than a table and a backfill. The frontend is 28 React components and 16 hooks against that API, with Recharts for the time-series views and D3 for the link graph between notes.`,
    },
    {
      heading: 'Deciding what it may write',
      body: `Ticking a checkbox in the UI edits the original file in place rather than a copy, and that is the part worth being careful about. A parser bug in a read-only tool shows you wrong data on a screen. The same bug in a tool with write access rewrites files that have no other copy.

So the app is read-only by default and the writes are enumerated: eight paths, written into the README before most of the features that needed them existed. Append-only to the capture file and the reading log, review-log updates, weekly-review generation, add-node-only on Obsidian canvas files, in-place checkbox toggling, deadline add and remove, and OAuth token storage. Everything outside that list is read-only.

A later hardening pass added path containment on top of the allowlist, so a filename that tries to walk out of an allowed root is rejected before any I/O, and it sanitizes URLs coming out of the AI layer rather than trusting model output to be a safe href.`,
    },
    {
      heading: 'Local AI that stays local',
      body: `The AI features are optional and off unless configured. Per-project summaries and question answering over the notes run through Ollama on the same machine against an embedding index. Running offline is the only reason I was willing to index everything instead of a curated subset, and the tradeoffs below are all downstream of that.

The index is better-sqlite3 with embeddings stored as JSON arrays and cosine similarity computed in plain JavaScript. sqlite-vss would be faster and does not build cleanly on Windows, and a vector extension that fails to compile on the only machine this runs on is worth less than a slower loop that always works. Text is chunked at roughly 500 characters on paragraph boundaries with overlap, and each chunk is keyed by a SHA-256 of its own content against a separate embeddings table, so editing one paragraph of a file reuses the embeddings for every paragraph it did not touch. A chokidar watcher with per-file debouncing re-indexes on change instead of on a timer.

The Claude API and Google Calendar are the two things that can send anything outward, and both stay dark until an explicit key is supplied.`,
    },
    {
      heading: 'The MCP server and the desktop shell',
      body: `The same aggregated data is exposed over MCP on a stdio transport: 11 tools covering TODOs, deadlines, projects, note search, capture, daily context, wiki search, wiki lint, the reading log, weekly-review generation and per-project detail. That means Claude Desktop calls a scanner that has already parsed the tree, instead of walking the tree again for every question. The scanners are the same modules the Express routes call, so the two surfaces cannot drift apart.

The Electron shell is optional and thin. esbuild compiles the main and preload entrypoints, and the window it opens loads the same Vite build a browser would get. What the shell adds is what a browser tab cannot do: a tray icon and a global shortcut that drops a capture overlay over whatever is on screen, dismissed again on blur. electron-builder is configured for NSIS, dmg and AppImage targets.`,
    },
    {
      heading: 'The scale, and the caveat',
      body: `80 commits between April and August 2026, sole author. 286 tracked files on the active branch, 66 of them Vitest test files against 44 modules in the server library, plus two Playwright specs for smoke and visual coverage.

The caveat is the audience. There is no deployment, no accounts and nobody else using it, and the feature count outran the one user a while ago. Two feature branches are still unmerged, so the default branch does not show the current state either. It is a tool I keep, not a product.`,
    },
  ],
};

export default brain2;
