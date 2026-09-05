import type { Project } from '@/data/types';

/**
 * Facts, metrics and defect counts come from the private experience corpus record.
 * Nothing here may claim npm distribution, installs, or users: the package is
 * publish-ready and unpublished (registry 404, checked 2026-07-30 and 2026-09-04).
 * The source repo is public (github.com/adihebbalae/glassbox, since 2026-08-02).
 */
const glassbox: Project = {
  slug: 'glassbox',
  title: 'Glassbox',

  tagline: {
    recruiter:
      'A local browser daemon that gives coding agents a one-call UI verification report.',
    builder:
      'Built because hand-checking my own UI after every agent edit was the bottleneck.',
  },

  summary: {
    recruiter:
      'Glassbox answers one question for a coding agent: did the page I just edited actually work and look right? A single call returns console errors, network failures, layout problems, accessibility violations and screenshots as one structured report with source maps already applied. It ships as a CLI and a 14-tool MCP server over one shared daemon, with 296 checks that run against a real Chromium. I found 18 defects in it by pointing it at two applications I had already built, fixed every one, and pinned each fix with a check that fails on the pre-fix commit.',
    builder:
      'I kept hand-verifying DegreeForge after every agent edit, and that was the slow step. The agent could write the code faster than I could check it. Glassbox moves that checklist into a tool: one call instead of fifteen fragile steps, with browser state living in a daemon rather than in a conversation that compacts and forks. Four adversarial passes against my own live projects turned up 18 defects in Glassbox itself, and one of them proved my own root-cause filing wrong.',
  },

  role: 'Sole developer',
  period: 'Jul 2026 – Present',
  status: 'in-progress',
  depth: 'full',
  featured: true,
  category: ['Developer Tools'],

  tech: [
    'Node.js',
    'JavaScript (ESM)',
    'Playwright',
    'Chrome DevTools Protocol',
    'Model Context Protocol',
    'Chromium',
    'axe-core',
    'WebSockets',
  ],

  metrics: [
    {
      value: '18',
      label: 'Defects found by dogfooding it against two of my own apps, over four rounds',
    },
    {
      value: '296',
      label: 'Checks across 13 proof modules, run against a real Chromium',
    },
    {
      value: '14',
      label: 'MCP tools, the same verb set the CLI exposes, over one daemon',
    },
    {
      value: '1',
      label: 'Runtime dependency (Playwright)',
    },
    {
      value: '6 days',
      label: 'First commit to a working v0.1.0: 28 commits, 106 tracked files, sole author',
      recruiterOnly: true,
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/glassbox',
  },

  sections: [
    {
      heading: 'Why it exists',
      body: `I was building DegreeForge with a coding agent, and the slow step was me. The agent would change a component and I would open the browser, click through the planner, read the console, resize to mobile, toggle dark mode. Every edit. The agent could not do that for itself. It could take a screenshot and it could dump the console, but stitching those into a verdict was about fifteen fragile steps.

Glassbox runs that checklist. One call returns console errors, page errors, a network failure taxonomy, layout problems like overflow and low contrast and unreachable controls, accessibility violations from axe-core, any build-error overlay, and screenshots. The report comes back with source maps already applied, and the screenshots come back as file paths rather than inline images, because inline images cost ten to twenty times the tokens inside an agent loop.

The scope is deliberately small. It is not a scraper, a general web agent, or a test runner. It checks the UI you are building, on localhost, right now.`,
    },
    {
      heading: 'One daemon, two interfaces',
      body: `A session is a named browser context inside one shared Chromium process, with its own storage, its own artifact directory, and its own JSONL journal. Ten subagents get ten sessions with no cookie or localStorage bleed between them, and commands serialize within a session while running fully in parallel across sessions. Opening one takes about 250ms.

Browser state lives in the daemon instead of in the agent's conversation. Agent memory is mortal: conversations compact, fork, and die, and subagents start with nothing. A session addressable by name and a journal readable cold means a fresh agent can pick up exactly where a dead one stopped.

Both interfaces are thin clients of that daemon. The CLI and the 14-tool MCP server expose the same verbs against the same endpoints, so a human debugging by hand and an agent working alone drive identical code. That is also what made the CLI the fastest way to exercise the MCP surface. Every dogfooding round below was driven through the CLI, and the MCP tools inherited every fix.

Playwright owns browser launch, cleanup, actionability waiting, and input dispatch. Raw CDP owns what Playwright does not expose: the debugger, coverage, matched styles, the accessibility tree, screencast, and event-listener lookup. One runtime dependency in total.`,
    },
    {
      heading: 'Answering why a page looks wrong',
      body: `A screenshot tells an agent that a button is invisible. It does not tell it why. An agent handed a picture of white text on a white background has to guess at the cause. An agent told that .cta computes to color #fff over background #fff, inherited from .hero at styles.css:214, fixes it in one edit.

So there is a debug plane under the observation layer. The style verb returns matched CSS rules in cascade order with computed specificity and a won-or-overridden mark per declaration. Glassbox calculates the specificity itself, because CDP does not ship it. Breakpoints resolve to the first valid location at or after the requested line, and a paused frame can be inspected, stepped, and evaluated against while sibling sessions keep working. Coverage reports count:0 for code that never ran, which separates a broken handler from a handler nothing calls.

The listener check is the one I like most, because it started out wrong. Asked whether a button had a click handler, it used to answer "no event listeners (dead element)": a confident, wrong verdict, since it had matched the first button in the DOM (a hidden mobile menu toggle) and had no idea React attaches its handlers at the root container. It now echoes the node it actually inspected, warns when the selector matched several, and checks ancestors for delegated listeners before calling anything dead.`,
    },
    {
      heading: 'What dogfooding surfaced',
      body: `A verification tool that reports a false clean is worse than no tool, so before trusting it I pointed it at two applications I had already built: DegreeForge, a Vite/React app whose course map renders 233 nodes, and WCII, an Astro static site. Four adversarial passes across three days. Eighteen defects, all of them in Glassbox itself.

Each one was graded on a single question: did it produce a wrong verdict or hide a real bug? The first was the worst. Glassbox reported a successful click on a zoom control no real pointer could reach, because a legend sat on top of it, and its own layout audit had already flagged that button as covered. The two halves of the tool contradicted each other, and the acting half was the one lying.

The most useful defect corrected my own filing. Clipped screenshots were coming back framed on the wrong part of the page, but only after a summary element was clicked, so I filed it against a collapsed details element and a compositor state. Then I measured instead of patching. The real cause was a coordinate basis mismatch: DOM.getBoxModel answers in viewport coordinates while Page.captureScreenshot wants page coordinates, so every clip taken after any scroll was framed against the wrong origin. Clicking a summary scrolls it into view, which is the only reason details looked causal. scrollTo(0,1500) alone reproduces it on a page with no details element anywhere. The fix generalized to every clipped capture rather than to one element type, and the wrong diagnosis is still in the defect log, sitting above the correction.

Every fix ships with a check verified to fail at the pre-fix commit, which is what makes the count mean anything. The suite grew from 214 checks to 296 across the rounds, and all four defect logs are committed in the repo with repro commands, severity ratings, and the defects I chose not to fix.`,
    },
    {
      heading: 'The limits of automated UI verification',
      body: `Headless Chromium was reporting zero horizontal overflow on pages that visibly overflowed, and I assumed headless simply could not see scrollbars. The real cause was that Playwright appends --hide-scrollbars to every headless launch, unconditionally, which is a sound default for screenshot diffing and a destructive one for layout checks. Measured at 800x600 on a page with a 100vw child: 0px of overflow with the flag, 15px without it, 15px headed.

Why the suite missed it matters more than the finding. The only seeded overflow fixture was a 3000px element, which overflows by so much that it shows up either way. The 100vw case, which overflows by exactly the scrollbar width and is the only case the flag erases, was never seeded, so 293 checks went green against a configuration that could not see the whole bug class. An assertion that passes because it has nothing left to inspect is the exact failure Glassbox exists to catch, and this one was committed inside Glassbox.

Every report now carries the conditions it measured under, and every finding carries a tag saying whether it was computed from CSS values and the DOM, measured off rendered text with a substitute typeface, or produced by the sandbox environment.

The rest of the edges are in the README, since anyone deciding whether to run this needs to know what it will not catch. No flame charts, no heap diffs, no WebKit, no network mocking: chrome-devtools-mcp and playwright-mcp do those well, and the comparison table lists the rows where they win. macOS is broken and documented as broken: the process reaper reads /proc, which macOS does not have, so roughly twenty "no strays" assertions would pass vacuously and a Mac user would see a mostly-green run whose green means nothing. The fixes are written and unverifiable without a Mac. There is no CI yet either, because the suite drives a real browser for six minutes. It is MIT licensed and open to anyone who wants to run it on hardware I do not have.`,
    },
  ],
};

export default glassbox;
