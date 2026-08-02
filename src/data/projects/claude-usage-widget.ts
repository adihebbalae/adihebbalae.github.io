import type { Project } from '@/data/types';

/**
 * THIS IS NOT ADI'S PROJECT. It is a fork of SlavomirDurej/claude-usage-widget,
 * and the credit line must survive any edit: upstream and its authors are named
 * in the first sentence of both taglines and both summaries. Do not reword this
 * page into something that reads like he built the widget.
 *
 * Commit accounting on the fork branch he works from (`enterprise`), verified
 * 2026-08-01 with `git shortlog -sne HEAD` in the local checkout at
 * _Projects/Random/claude-usage-widget/claude-usage-widget:
 *   252 commits total
 *   220 Damon Downing, across three git identities (202 + 7 + 6 + 4 + 1)
 *    13 Adithya Hebbalae
 *    12 Slavomir Durej, across two identities (6 + 6)
 *     7 others (Junyeob Baek 3, Sergei Kuznetsov 2, Benny 1, Claude 1)
 *
 * His 13 commits total 2,442 insertions / 1,621 deletions
 * (git log --author=boombershiner --numstat). Feature work alone is 2,332 of
 * those insertions: multi-account 881, Liquid skin 744, tray flyout 707.
 *
 * PR #2 verified with `gh pr view 2 --repo adihebbalae/claude-usage-widget`:
 * MERGED 2026-05-29, head feature/multi-account into base main, 11 files changed.
 * Nine of his commits are in it. The PR's +1,233/-330 is the whole branch diff
 * and includes upstream commits synced from develop, so it is NOT cited here.
 *
 * links.github points at PR #2 rather than either repo root: it is the one URL
 * that scopes to his diff, and GitHub renders the "forked from SlavomirDurej"
 * banner above it.
 */
const claudeUsageWidget: Project = {
  slug: 'claude-usage-widget',
  title: 'Multi-account support for Claude Usage Widget',

  tagline: {
    recruiter: 'Slavomir Durej and Damon Downing built this widget. I contributed multi-account support.',
    builder: 'Slavomir Durej and Damon Downing’s widget. 13 of its 252 commits are mine.',
  },

  summary: {
    recruiter:
      'Claude Usage Widget is an Electron desktop app by Slavomir Durej and Damon Downing that reads Claude.ai session and weekly usage limits and draws them in a small always-on-top window. I work on a fork of it, and 13 of the 252 commits on my branch are mine. They add three things: multi-account support, merged as nine commits through PR #2; a see-through skin with an adjustable transparency level; and a Windows 11 tray flyout on Mica. About 2,400 lines added in total. Everything else the widget does is theirs.',
    builder:
      'The widget is Slavomir Durej and Damon Downing’s, and it held one session key at a time. I run two Claude accounts, so the fork got an account store: keys encrypted through Electron safeStorage, a panel that polls every saved account, and a one-time migration of an existing single-account install. The UI was the easy half. Switching accounts swaps the cookie inside one shared Electron session, so two overlapping fetches can label one account’s numbers with another account’s name.',
  },

  role: 'Contributor',
  period: 'May 2026 – Jun 2026',
  status: 'complete',
  depth: 'overview',
  category: ['Developer Tools'],

  tech: [
    'Electron 33',
    'JavaScript',
    'Node.js',
    'Chart.js',
    'electron-store',
    'Windows Mica',
    'CSS',
    'Chrome DevTools Protocol',
    'PowerShell',
  ],

  metrics: [
    {
      value: '13 of 252',
      label: 'Commits on the fork branch that are mine. 220 are Damon Downing’s, 12 Slavomir Durej’s.',
    },
    {
      value: '9',
      label: 'Commits in the merged multi-account pull request (#2)',
    },
    {
      value: '2,442',
      label: 'Lines added across my 13 commits',
    },
    {
      value: '28 → 33',
      label: 'Electron majors, bumped to get the backgroundMaterial API the flyout needs',
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/claude-usage-widget/pull/2',
  },

  sections: [
    {
      heading: 'Whose project this is',
      body: `Slavomir Durej wrote the original Claude Usage Widget. Damon Downing has done the great majority of the work since: of the 252 commits on the branch I work from, 220 are his across three git identities, 12 are Durej's, and 7 belong to four other contributors. Mine are the remaining 13. The usage API client, the rendering, the Chart.js history graph, the settings system, the threshold alerts, the packaging and the release process are all upstream work, MIT licensed, at github.com/SlavomirDurej/claude-usage-widget.

What I added sits on top of that as three separate features. The multi-account branch was merged into my fork, not into upstream.`,
    },
    {
      heading: 'Multi-account',
      body: `The widget stored one session key, and I wanted two accounts visible side by side. The fork got an account store with add, rename, delete and switch from the settings panel, session keys encrypted through Electron's safeStorage with a plaintext fallback for machines where the OS keychain is unavailable, and a panel that shows session and weekly bars for every saved account on the normal poll interval. Existing single-account installs migrate into the store on first launch.

The risk is the shared session. Reading another account's usage means swapping the cookie inside one Electron session object, so two overlapping fetches can return one account's numbers under another account's label. That path runs behind an in-flight mutex, and the previous session is restored in a finally block whether the fetch returned or threw. Account labels are user-supplied, so they reach the DOM through textContent, and the IPC handlers validate id format, label length and the organization UUID before any URL is built.

Nine commits, merged through pull request #2. Neither the fork nor upstream has an automated test suite, so I verified the feature with a PowerShell script that attaches to the running Electron renderer over the Chrome DevTools Protocol and walks five states: baseline, settings panel, an account switch, the all-accounts panel, and a refresh.`,
    },
    {
      heading: 'The skin and the tray flyout',
      body: `Two smaller additions. A "Liquid" skin gives the frameless window see-through translucency with a three-step transparency control, dark and light variants, and the usage colors left untouched so session, weekly, warning and danger states stay readable through the glass. The fidelity limit went into the commit message rather than being papered over: CSS backdrop-filter cannot sample the desktop behind a transparent window, and Windows Acrylic flattens when the window loses focus and will not combine with a transparent Electron window at all. So the skin uses unblurred translucency, and the transparency control exists to trade clarity against legibility.

The other is a Windows 11 tray flyout — a second small window with a Mica backdrop that slides up from the tray icon, shows the two usage bars, and dismisses on blur. Mica arrives through Electron's backgroundMaterial option, which meant taking the app from Electron 28 to 33 and checking the rest of it against the upgrade before the flyout could land.`,
    },
  ],
};

export default claudeUsageWidget;
