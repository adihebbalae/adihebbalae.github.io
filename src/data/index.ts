/**
 * The project registry.
 *
 * One file per project under ./projects, each default-exporting a Project.
 * Array order is display order: this is the sequence the cards appear in
 * before any filter is applied.
 */

import type { Project } from './types';

import degreeforge from './projects/degreeforge';
import glassbox from './projects/glassbox';
import attacca from './projects/attacca';
import neuralgto from './projects/neuralgto';
import wcii from './projects/wcii';
import utpoll from './projects/utpoll';
import visionLearning from './projects/vision-learning';
import tutoros from './projects/tutoros';
import pentris from './projects/pentris';
import musicRecommender from './projects/music-recommender';
import nameThatSong from './projects/name-that-song';
import pokerLedger from './projects/poker-ledger';
import sentimentDemo from './projects/sentiment-demo';
import valentines from './projects/valentines';
import brain2 from './projects/brain2';
import dOrganizer from './projects/d-organizer';
import courtalpha from './projects/courtalpha';
import findYourClub from './projects/find-your-club';
// No tribev2 entry: the local tribev2 folder is a clone of facebookresearch/tribev2
// (Meta). Zero commits by Adi, no fork under his account. Not his work.
//
// No canvas-mcp or mcp-discord entry, for the same reason. canvas-mcp is an
// untouched fork of vishalsachdev/canvas-mcp (0 ahead, 138 behind); mcp-discord
// is a local clone of goul4rt/mcp-discord. Zero commits by Adi in either.
//
// claude-usage-widget is a fork of SlavomirDurej/claude-usage-widget where his
// 13 of 252 commits ARE real work (multi-account support, Win11 tray flyout).
// Pending as a contribution entry, not a project entry.
import texasPokerSite from './projects/texas-poker-site';
import ece302Pcb from './projects/ece302-pcb';

export const projects: Project[] = [
  degreeforge,
  glassbox,
  attacca,
  neuralgto,
  wcii,
  utpoll,
  visionLearning,
  tutoros,
  pentris,
  musicRecommender,
  nameThatSong,
  pokerLedger,
  sentimentDemo,
  valentines,
  brain2,
  dOrganizer,
  courtalpha,
  findYourClub,
  texasPokerSite,
  ece302Pcb,
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export type { Project, Category, Status, Depth, Metric, Links, Section, ModalCopy } from './types';
