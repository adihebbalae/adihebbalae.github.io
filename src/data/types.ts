/**
 * The contract every project page codes against.
 *
 * One file per project under src/data/projects/, default-exporting a Project.
 * Separate files so pages can be authored in parallel without write conflicts.
 */

export type Status = 'live' | 'complete' | 'in-progress' | 'archived';

/** How much page a project earns. Complex work gets `full`. */
export type Depth = 'full' | 'overview';

export type Category = 'Research' | 'ML/AI' | 'Developer Tools' | 'Web App' | 'Embedded' | 'Civic' | 'Interactive' | 'Freelance';

/** Copy that reads differently to a recruiter than to another engineer. */
export interface ModalCopy {
  /** Outcome-first. What it did, what it cost, what shipped. */
  recruiter: string;
  /** Process-first. Why it exists, what broke, what it taught. */
  builder: string;
}

export interface Metric {
  value: string;
  label: string;
  /**
   * Metrics that only make sense as credentials. Hidden in builder mode so
   * that view does not read as a resume.
   */
  recruiterOnly?: boolean;
}

export interface Links {
  live?: string;
  github?: string;
  /** An interactive demo hosted inside this site, e.g. /projects/x/demo */
  demo?: string;
}

export interface Section {
  heading: string;
  /** Plain prose. Sentence case headings. See the private writing-style notes. */
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line, under ~90 chars. Shown on the card. */
  tagline: ModalCopy;
  /** Two to four sentences. Shown at the top of the project page. */
  summary: ModalCopy;
  role: string;
  /** e.g. "Mar 2026 – Present" */
  period: string;
  status: Status;
  depth: Depth;
  category: Category[];
  tech: string[];
  metrics: Metric[];
  links: Links;
  /**
   * Source repo is private. Nothing may appear that is not architecture or
   * stack: no code, no screenshots, no business figures.
   */
  sourcePrivate?: boolean;
  /** Surfaced above the fold on the home page. */
  featured?: boolean;
  /** Long-form body for depth: 'full' projects. */
  sections?: Section[];
}
