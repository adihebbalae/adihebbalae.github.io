import type { Project } from '@/data/types';

/**
 * Facts, metrics and stack come from the private experience corpus record and a
 * local checkout of the repo (README, package.json, git history: 79 commits,
 * 2026-04-05 to 2026-07-09, sole author). The folder is `brain2`; the product is
 * Cortex — use Cortex. Nothing here may claim users, deployment or distribution:
 * it runs on localhost for one person. Repo verified public 2026-08-01.
 * Note: HEAD sits on an unmerged feature branch, so the default GitHub view does
 * not show the current state.
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
      'Cortex reads markdown that already exists on disk (project state files, an Obsidian vault, a deadlines file) and puts all of it behind one local web UI. There is no database, no accounts and no hosted backend; it runs on localhost for a single user. React and Vite on the front, Express on the back, both TypeScript, with an optional Electron shell and optional local AI through Ollama. 79 commits and 68 Vitest test files, sole author, April to July 2026.',
    builder:
      'Every personal dashboard I had tried wanted me to import my notes into it, and then the notes lived in two places. Cortex never owns the data — it parses the markdown that is already there and writes back into the original files, under an allowlist of eight paths it is permitted to touch. That constraint is the reason the feature count got as far as it did: once the blast radius was written down, everything after it was cheap to add.',
  },

  role: 'Sole developer',
  period: 'Apr 2026 – Present',
  status: 'in-progress',
  depth: 'overview',
  category: ['Developer Tools', 'Web App'],

  tech: [
    'TypeScript',
    'React 18',
    'Vite',
    'Express',
    'Electron',
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
      value: '68',
      label: 'Vitest test files',
    },
    {
      value: '8',
      label: 'Paths the app may write to. Read-only everywhere else.',
    },
    {
      value: '1',
      label: 'User. It runs on localhost and was never deployed.',
    },
    {
      value: '79',
      label: 'Commits over three months, sole author, April to July 2026',
      recruiterOnly: true,
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/Brain2',
  },

  sections: [
    {
      heading: 'What it reads and what it may write',
      body: `A scanner walks the projects directory looking for a state file in a fixed priority order, starting with agent_state.md and falling back to README.md, and pulls status, last-modified date and next steps out of whichever it finds first. Anything untouched for 14 or 30 days gets flagged as stale. A second pass reads every markdown file across the projects and the vault for unchecked boxes and TODO, FIXME and HACK markers, and groups what it finds by project.

Ticking one of those boxes in the UI edits the original file in place rather than a copy, which is the part worth being careful about. So the app is read-only by default with an explicit eight-path write allowlist: append-only to the inbox and the reading log, review-log updates, weekly-review generation, add-node-only on Obsidian canvas files, in-place checkbox toggling, deadline add and remove, and OAuth token storage.`,
    },
    {
      heading: 'Local AI, and one user',
      body: `The AI features are optional and off unless configured. Per-project summaries and chat over the vault run through Ollama on the same machine against an embedding index; running offline is the only reason I was willing to index the entire vault instead of a curated subset. The Claude API and Google Calendar are the two things that can send anything outward, and both take an explicit key. The same aggregated data is also exposed as an MCP server, so Claude Desktop can query the scanners as tools instead of re-reading the vault itself.

The caveat is the audience. There is no deployment, no accounts and nobody else using it, and the feature count outran the one user a while ago. It is a tool I keep, not a product.`,
    },
  ],
};

export default brain2;
