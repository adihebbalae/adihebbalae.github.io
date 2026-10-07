/**
 * The project registry.
 *
 * One file per project under ./projects, each default-exporting a Project.
 * Array order is display order. Projects marked `featured` render first as
 * large cards; the rest follow in a grid.
 *
 * The list was cut to the strongest nine on 2026-09-28. The other twelve
 * (coursework, high school work, one-offs, a contribution to someone else's
 * repo) live in Documents/_Websites/_archive/portfolio-next-projects-2026-09-28
 * with a README saying how to restore one. Add back only what beats the
 * weakest project still listed here.
 *
 * Standing exclusions: no tribev2 (a facebookresearch clone, zero commits by
 * Adi), no canvas-mcp or mcp-discord (untouched forks), and never Balae /
 * HebbalaeLLC or PokerPostMortem in any form.
 */

import type { Project } from './types';

import degreeforge from './projects/degreeforge';
import glassbox from './projects/glassbox';
import attacca from './projects/attacca';
import wcii from './projects/wcii';
import utpoll from './projects/utpoll';
import neuralgto from './projects/neuralgto';
import pentris from './projects/pentris';
import twentyQuestions from './projects/twenty-questions';
import texasPokerSite from './projects/texas-poker-site';
import visionLearning from './projects/vision-learning';

export const projects: Project[] = [
  degreeforge,
  glassbox,
  attacca,
  wcii,
  utpoll,
  neuralgto,
  pentris,
  twentyQuestions,
  texasPokerSite,
  visionLearning,
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export type { Project, Category, Status, Depth, Metric, Links, Section, ModalCopy } from './types';
