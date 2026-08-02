import type { Project } from '@/data/types';

/**
 * Facts come from a local checkout of the repo: README,
 * package.json, src/components/ProposalPopup.tsx, and git history (all commits
 * dated 2026-02-12). The folder is `valentines-day-site`; the repo is `vd-site`.
 * framer-motion is in package.json but imported nowhere in src/, so it is not
 * listed under tech. Links verified 2026-08-01: repo and Pages site both 200.
 */
const valentines: Project = {
  slug: 'valentines',
  title: "Valentine's Day Proposal",

  tagline: {
    recruiter: 'A proposal site disguised as an RSVP form. Next.js, static export, on GitHub Pages.',
    builder: 'A joke with a build step. The No button runs away; the Yes button ends it.',
  },

  summary: {
    recruiter:
      'A one-page Next.js site that opens as a plain RSVP form (name, email, major, year, phone, a fun fact), then fades to black and asks the actual question. Answering no moves the button out from under the cursor and cycles ten rejection messages; answering yes fires full-screen confetti. It builds to static HTML and serves from a docs/ folder on GitHub Pages. Written and shipped in a day.',
    builder:
      'The form is the joke. It looks like every other club RSVP, deliberately plain and with no hearts anywhere, so the reveal has something ordinary to land against. The only part with real logic is the rejection loop. All the animation is CSS, and the whole thing went up the same day; most of the late commits were arguments with GitHub Pages about which folder to publish.',
  },

  role: 'Sole developer',
  period: 'Feb 2026',
  status: 'live',
  depth: 'overview',
  category: ['Web App', 'Interactive'],

  tech: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'canvas-confetti', 'GitHub Pages'],

  metrics: [
    {
      value: '10',
      label: 'Rejection messages, cycled — a persistent no does eventually see them repeat',
    },
    {
      value: '1',
      label: 'Answer that advances the page',
    },
  ],

  links: {
    live: 'https://adihebbalae.github.io/vd-site/',
    github: 'https://github.com/adihebbalae/vd-site',
  },

  sections: [
    {
      heading: 'The rejection loop',
      body: `The No button holds still for the first click, which shakes the screen and shows a message. After that it starts dodging on hover, offset by a random amount that scales with the number of refusals so far and caps at a fixed maximum. From about the fifth refusal it disappears entirely for a couple of seconds, which is where most people stop testing it.

Everything else is a form and a fade. The RSVP page collects name, email, major, year, phone and a fun fact, drops a hint about Saturday once a year is picked, then runs a fake loading screen over a blurred second page before blacking out. The proposal fades in on the black screen using the first name from the form. Yes triggers a confetti burst and a celebration screen.`,
    },
  ],
};

export default valentines;
