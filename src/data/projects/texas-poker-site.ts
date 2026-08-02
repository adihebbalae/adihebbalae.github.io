import type { Project } from '../types';

/**
 * Source repo is private; the deployed site is public. Architecture and stack
 * only — no code, no member data, no analytics figures.
 */
const project: Project = {
  slug: 'texas-poker-site',
  title: 'Texas Poker Club Site',
  tagline: {
    recruiter: 'The public site for the 150+ member UT student club I co-founded. Astro on Cloudflare.',
    builder: 'Static by default, React only where a page needed state, one Worker for the contact form.',
  },
  summary: {
    recruiter:
      'I co-founded the Texas Poker Club at UT Austin in September 2025 and built its website. It carries everything the club has to say in public: the weekly Monday lesson at McCombs, upcoming events, membership details, sponsorship tiers, and a written lesson library a new member can read before their first game night. Astro renders it statically, React runs only the interactive pieces, and a Cloudflare Worker handles the contact form.',
    builder:
      'A club that meets every week produces the same handful of questions on repeat, and a page answers them more reliably than an officer does. Almost all of it is content, so the site is static by default and only ships JavaScript where a component needs state. Lessons and posts are MDX in typed content collections, which means adding one is writing a file rather than editing a template.',
  },
  role: 'Co-founder & Head of Operations and Strategy',
  period: 'Apr 2026 – Present',
  status: 'live',
  depth: 'overview',
  category: ['Web App'],
  tech: [
    'Astro',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'MDX',
    'Cloudflare Pages',
    'Cloudflare Workers',
    'Cloudflare KV',
  ],
  metrics: [
    { value: '150+', label: 'Members in the club the site serves' },
    { value: '10', label: 'Lessons and posts published through the content collections' },
  ],
  links: {
    live: 'https://texaspokerclub.org',
  },
  sourcePrivate: true,
  sections: [
    {
      heading: 'What it does for the club',
      body:
        'Two audiences land here wanting different things. A prospective member wants to know when meetings are, whether beginners are welcome, and how to join, so the lesson schedule, a membership page, and a resources section with hand rankings and a glossary are the shortest paths off the home page. A sponsor wants tiers and a way to make contact, which gets its own page and its own form.\n\nThe rest is the club’s own record: who the officers are, how it started, events past and upcoming, and a lesson library that lets a first-timer show up already knowing what pot odds are.',
    },
    {
      heading: 'Architecture',
      body:
        'Astro builds every page to static HTML and ships no JavaScript for the pages that need none. React runs as islands for the FAQ accordion, the contact form, the newsletter signup, and a daily challenge component. Lesson and blog content lives in typed content collections as MDX, so the writing stays separate from the layout and a malformed post fails the build rather than the page.\n\nCloudflare Pages deploys on push. The only server-side piece is a Cloudflare Worker behind the contact form, which rate-limits through a KV namespace so the endpoint cannot be turned into a free mailer. No database, no CMS, which for a club site is the right amount of infrastructure.',
    },
  ],
};

export default project;
