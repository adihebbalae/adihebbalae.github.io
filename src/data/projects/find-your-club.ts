import type { Project } from '@/data/types';

/**
 * SOURCE IS PRIVATE (adihebbalae/find-your-club, verified private 2026-08-01).
 * Architecture and stack only — no code, no screenshots, no links to source.
 * Counts verified against a local checkout of that repo: 121 clubs
 * (20 EPL / 20 La Liga / 20 Serie A / 18 Bundesliga / 18 Ligue 1, plus 5 each
 * from Portugal, Belgium, Netherlands, Türkiye, Poland), 19 questions, 12 traits.
 * No deployed URL has been verified, so no live link is claimed.
 */
const findYourClub: Project = {
  slug: 'find-your-club',
  title: 'Find Your Club',

  tagline: {
    recruiter: 'A blind personality quiz that matches you to one of 121 European football clubs.',
    builder: 'Nineteen questions that never name a club, scored by cosine similarity.',
  },

  summary: {
    recruiter:
      'Nineteen abstract questions build a hidden profile across 12 traits, which is then compared against 121 clubs in 10 leagues by cosine similarity. The questions ask about the shape of your next ten years or how you would fight a war rather than about football, so no single answer can hand you a team. React 18 and Vite, a static single-page app with no backend.',
    builder:
      'The scoring is the interesting half. Each option adds weights to a 12-trait vector, and both that vector and every club vector are normalized before the dot product, so the match is on the shape of a profile rather than on how hard any one answer got weighted. The tedious half is the data, and it is most of the project.',
  },

  role: 'Sole developer',
  period: 'Jul 2026',
  status: 'complete',
  depth: 'overview',
  category: ['Interactive', 'Web App'],
  sourcePrivate: true,

  tech: ['React 18', 'Vite', 'JavaScript', 'CSS'],

  metrics: [
    {
      value: '121',
      label: 'Clubs, across 10 leagues',
    },
    {
      value: '19',
      label: 'Questions. One asks about league preference; none name a club.',
    },
    {
      value: '12',
      label: 'Trait dimensions in the profile vector',
    },
  ],

  links: {},

  sections: [
    {
      heading: 'How the matching works',
      body: `Every answer option carries a few small weights on traits like glory, chaos, grit, atmosphere and underdog, and the picks sum into one 12-trait vector. Each club has its own hand-written vector on the same 12 traits. The match is cosine similarity between the two, with both sides normalized, so a profile that leans hard on one trait does not automatically get handed whichever club scores highest on that trait.

One question does ask about league preference directly, including a no-preference option and a catch-all for Europe's sixth through tenth leagues. It applies a modest multiplier to clubs in the chosen league instead of filtering anything out, so it tilts the result without deciding it. The result screen returns one winner plus a short list of runners-up, and picks the reasons it shows by taking the traits you scored highest that the winning club also rates highly on.`,
    },
    {
      heading: 'The club data',
      body: `The set covers every club in the big five leagues for the 2026-27 season, plus the top five from each of the next five by UEFA coefficient: Portugal, Belgium, the Netherlands, Türkiye and Poland. That comes to 121. Each entry carries the 12 trait ratings, home city, primary and secondary colors, a one-line description and its main rival.

The scoring function is short; rating 121 clubs across all twelve traits carefully enough that two similar mid-table sides still come out distinguishable took considerably longer, and it is the part that decides whether the result feels right to someone who already knows the leagues.`,
    },
  ],
};

export default findYourClub;
