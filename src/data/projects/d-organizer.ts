import type { Project } from '../types';

/**
 * Source repo is private. Architecture and stack only — no code, no file
 * listings, no screenshots.
 */
const project: Project = {
  slug: 'd-organizer',
  title: 'd-Organizer',
  tagline: {
    recruiter: 'Local-first Python CLI that dedupes and organizes file trees, with every move reversible.',
    builder: 'Undo designed in before anything got fast. Duplicates found by hash, since names lie.',
  },
  summary: {
    recruiter:
      'd-Organizer scans a directory, finds exact duplicates by SHA256 content hash, sorts files into a category tree, and moves them. Every move is written to a SQLite journal before it happens, so a whole run can be undone. It installs as a console script with one runtime dependency and makes no network calls. The scope was small on purpose, and it got finished.',
    builder:
      'The problem is narrow: a Downloads folder holding the same PDF five times under five names, where nothing about the names tells you they match. Content hashes do. The harder half was trust: a tool that relocates thousands of a person’s files earns it by being reversible, so the journal and the undo command came before any of the work that made repeat scans fast.',
  },
  role: 'Sole developer',
  period: 'Apr 2026 – May 2026',
  status: 'complete',
  depth: 'overview',
  category: ['Developer Tools'],
  tech: ['Python 3.11', 'Typer', 'SQLite', 'SHA256', 'pytest', 'setuptools'],
  metrics: [
    { value: '221', label: 'Tests across 16 files' },
    { value: '36', label: 'Tracked files in the whole repo' },
    { value: '0', label: 'Network calls, by design' },
  ],
  links: {},
  sourcePrivate: true,
  sections: [
    {
      heading: 'How it works',
      body:
        'A scan walks the tree, hashes each file with SHA256, and records path, size, modified time, extension, and category in a SQLite manifest. Later scans compare the cheap metadata first and skip rehashing anything unchanged, which is what makes running it weekly over a large directory reasonable rather than punishing.\n\nClassification maps file extensions onto a preset category tree. Moves are two-phase: the intent is journaled, the move happens, then the entry is marked complete. An interrupted run is therefore still recoverable, and undo replays the journal in reverse. The read-only commands are separated from the single command that touches files, and that one refuses to run without an explicit confirmation flag. Destination collisions get a numeric suffix instead of an overwrite, path traversal is rejected before any I/O, and Windows long paths are handled.',
    },
    {
      heading: 'Why the test count looks wrong',
      body:
        '221 tests across 16 files, against 36 tracked files in the entire repo. The ratio is deliberate. Classification, deduplication, the journal, the manifest, the scanner, the safety rules, and the CLI each get their own test file, because the failure mode for this tool is someone’s files sitting in the wrong place with no obvious way back.\n\nThe rest of the discipline is in what it refuses to do. One runtime dependency, no network, no telemetry, no account. It does one job and stops, which is why it is the only thing I have built that has an ending instead of a backlog.',
    },
  ],
};

export default project;
