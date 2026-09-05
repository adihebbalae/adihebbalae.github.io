import type { Project } from '@/data/types';

/**
 * TutorOS — closed-loop web app for independent tutors.
 * Stopped deliberately in Apr 2026. Facts sourced from the private experience
 * corpus record for this project, which is the record of truth.
 */
const tutoros: Project = {
  slug: 'tutoros',
  title: 'TutorOS',

  tagline: {
    recruiter:
      'A closed-loop app for independent tutors, killed on purpose when a better tool shipped.',
    builder:
      'Built the interesting half, then killed it when Claude Cowork did that part better.',
  },

  summary: {
    recruiter:
      'TutorOS chained one tutoring workflow end to end: prep a lesson, teach from a whiteboard with the plan loaded beside it, write a short debrief, and let that debrief update the student profile that feeds the next prep. Next.js 15 on Supabase, with row-level security scoping every table to a tutor id and 24-hour tokens for a read-only student view. Work stopped in April 2026, and that was a decision: the half that remained was integration labor, and Claude Cowork had shipped something that did the valuable part of the loop better. The design is the deliverable here. There is no live product.',
    builder:
      'I was the only user, which is why the loop is right and the polish is not. The requirements came out of teaching back-to-back sessions with a chat model, a doc, a notes app and a calendar open at once. Six weeks in, what was left of the build was auth, PDF export and calendar sync (integration work with no design left in it), and a shipped product had taken over the part I cared about. I stopped on purpose rather than letting it rot, and I have never listed it as finished.',
  },

  role: 'Sole developer',
  period: 'Mar 2026 – Apr 2026',
  status: 'archived',
  depth: 'full',
  category: ['Web App', 'ML/AI'],

  tech: [
    'Next.js 15 App Router',
    'TypeScript',
    'Tailwind CSS',
    'shadcn/ui',
    'Supabase',
    'PostgreSQL',
    'Row-level security',
    'Anthropic API',
    'Fabric.js',
    'KaTeX',
    'Zod',
  ],

  metrics: [
    { value: '6', label: 'Postgres tables, each with row-level security keyed to a tutor id' },
    { value: '24 h', label: 'Life of a share token; the read-only student view needs no login' },
    { value: '$0', label: 'API cost in bring-your-own-AI mode, which covers every step but the debrief' },
    { value: '11', label: 'Commits across one month, sole author, before the project was stopped' },
  ],

  links: {
    github: 'https://github.com/adihebbalae/TutorScopeV2',
  },

  sections: [
    {
      heading: 'The loop it was built around',
      body:
        'Before a lesson, the tutor enters a topic. The app searches for resources and the tutor approves one, which the model turns into two versions of the same lesson plan, one written for the tutor and one written for the student, plus a problem set. Resource selection is approved, never auto-chosen.\n\n' +
        'During the lesson, the teaching surface is a Fabric.js canvas with the plan in a sidebar and KaTeX for the math. A share link opens the same lesson read-only on the student’s tablet with no login.\n\n' +
        'After the lesson, the tutor writes two to five sentences. The model returns a structured summary, updates the student’s weak spots and proposes the next topic. That last step is the hinge: it is the only place anything writes back to the student profile, which is why it runs server-side with no bypass path.\n\n' +
        'The debrief feeds the next prep. Everything else in the app existed to make that write happen without extra work from the tutor.',
    },
    {
      heading: 'Multi-tutor isolation, written first',
      body:
        'Six tables: tutors, students, sessions, lesson plans, session summaries, and per-subject prompt overrides. Each carries row-level security policies keyed to a tutor id, written into the first schema rather than added once queries already existed.\n\n' +
        'Sharing is a separate mechanism on purpose. A share token grants read access to one lesson for 24 hours and to nothing else, which is what makes a login-free tablet view safe to hand a student mid-session.\n\n' +
        'Retrofitting tenant scoping onto an app that already has queries costs far more than writing the policies first, because every query written before the policies exist has to be re-audited afterwards.',
    },
    {
      heading: 'A mode that costs nothing to run',
      body:
        'Without an Anthropic key the app switches to bring-your-own-AI. It builds the prompt, the tutor runs it in whatever model they already pay for, and pastes the JSON back; lenient validators accept it and the workflow carries on as normal.\n\n' +
        'That mode existed because a per-lesson API bill would have made the tool unusable for exactly the independent tutors it was aimed at.\n\n' +
        'The debrief is deliberately excluded from it. That path writes structured output into the database, and a hand-pasted blob is the wrong risk to take on the one step that changes a student record.',
    },
    {
      heading: 'Why I stopped',
      body:
        'The short version, in the words I used at the time: “too much hassle, Claude Cowork beat it.”\n\n' +
        'Two things were true at once. The half I had left was auth, PDF export and calendar sync, which is all integration and no design. And Claude Cowork had shipped, doing the prep-and-artifact part of my loop better than I was going to, for free, with nothing for me to maintain.\n\n' +
        'So I stopped, and I made a point of stopping rather than leaving it in a folder and calling it active.\n\n' +
        'What that leaves is uneven, and this page should say so. A good chunk of the app was written but never committed: auth, the dashboard, the student profile page, the debrief screen, PDF export, calendar sync. The repository is smaller than its own README describes and will not build from a clean clone. That lesson is separate from the kill decision and less flattering than it: work you have not committed is work you have not done.\n\n' +
        'I would make the same call again. Finishing a project whose reason for existing has gone is the sunk-cost move, and “I built the interesting half and then killed it” is a more useful thing to be able to say than a fifth half-finished app.',
    },
  ],
};

export default tutoros;
