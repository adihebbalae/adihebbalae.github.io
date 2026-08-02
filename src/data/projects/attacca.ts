import type { Project } from '@/data/types';

const attacca: Project = {
  slug: 'attacca',
  title: 'Attacca',

  tagline: {
    recruiter: 'A Claude Code plugin marketplace: three plugins, 25 skills, three subagents.',
    builder: 'Context engineering for Claude Code. Ships nothing the model already does unaided.',
  },

  summary: {
    recruiter:
      'Attacca is a context-engineering toolkit for Claude Code, shipped as three plugins that install independently from one marketplace. Version 4.0.0 replaced a clone-a-template boilerplate with 25 skills, three subagents, and enforcement hooks another developer can install into their own repo in three commands. An Anthropic reviewer evaluating it for the Claude plugins community marketplace opened issue #1 in June 2026, reporting that the plugin failed claude plugin validate on YAML frontmatter that would not parse. I fixed the defect and closed the issue on August 2, 2026.',
    builder:
      'Attacca began as a boilerplate I cloned into my own projects. By mid-2026 most of it was ceremony: Manager and Engineer personas coordinating through state files, an .agents/ state machine, and rule ports for eight coding tools, five of which were dead or fading. The v4 rewrite ran one test over every file, which was whether the model already did this without me, and deleted everything that failed. What survived divides in two: context the model has no way to know, and verification it has no way to skip.',
  },

  role: 'Sole developer',
  period: 'Mar 2026 – Present',
  status: 'live',
  depth: 'full',
  category: ['Developer Tools'],

  tech: ['Claude Code', 'Node.js', 'Markdown', 'YAML', 'Git hooks', 'Semantic versioning'],

  metrics: [
    {
      value: '3 plugins',
      label: 'attacca-core, attacca-security, attacca-init. Each installs standalone.',
    },
    {
      value: '25 skills',
      label: 'Shipped in v4.0.0 across the three plugins, with 3 subagents',
    },
    {
      value: 'v4.0.0',
      label: 'A breaking redesign from a template you clone to a marketplace you install',
    },
    {
      value: 'Issue #1',
      label:
        'Opened by an Anthropic reviewer evaluating Attacca for the Claude plugins community marketplace. Validation defect fixed, issue closed Aug 2026.',
    },
    {
      value: 'git push',
      label: 'Blocked by a hook until a fresh clean security audit exists',
    },
    {
      value: '55 commits',
      label: '62 tracked files, sole author, Mar to Jul 2026',
      recruiterOnly: true,
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/Attacca',
  },

  featured: true,

  sections: [
    {
      heading: 'What context engineering means here',
      body:
        'Attacca is an Italian musical instruction: proceed to the next movement without pause.\n\n' +
        'Context engineering here means writing down the things a model has no way to know. It can read the code, and it can read the git history, but git history records what changed, not what was decided and why the alternative was rejected. The answer in this toolkit is CONTEXT.md, a committed file capped at about a hundred lines because past that nobody reads it, human or model. It is prose because its readers include people, and it lives in git because that is the one place a fresh clone, a teammate, and a cloud agent will all find it.\n\n' +
        'The rule behind the whole toolkit is that it ships nothing the model already knows how to do. Process knowledge gets absorbed by every model generation. Context and verification do not. Every skill in the repo carries a Delete when line naming the native capability that should eventually make it unnecessary.',
    },
    {
      heading: 'The two things a model cannot do for itself',
      body:
        'The list stops at two on purpose.\n\n' +
        'The first is the questions a project needs answered before anyone builds it. Ask for a webstore with Stripe and auth and you will get a generic one. A model can ask good questions; it will not reliably choose to. The /interrogate skill walks nine domains that have to be settled first, among them identity and auth, payments, the data model, external integrations, hosting, compliance, and non-goals. It asks in batches of two or three, proposes a default for each question, and accepts a deferral as long as the assumption behind it gets named out loud. The answers land in CONTEXT.md, so the interrogation pays off in every later session instead of only the first.\n\n' +
        'The second is the gates a project cannot skip before it ships. Those are hooks, which are code that runs whether or not the model feels like cooperating. A skill that reminds you to run an audit is a suggestion, and suggestions lose to deadlines.',
    },
    {
      heading: 'From a template you clone to a marketplace you install',
      body:
        'Version 3 was a repo you cloned. It had Manager and Engineer personas coordinating through state files, an .agents/ state machine, and rule ports for eight AI coding tools. Every project that used it forked the boilerplate and then drifted away from it.\n\n' +
        'By mid-2026 the reasons for most of that had gone. Claude Code had native subagents, plan mode, session memory, hooks, and plugin distribution. Persona hierarchies and clone-a-boilerplate had both been written up by the community as anti-patterns. Five of the eight ported tools were dead or fading. So v4.0.0 kept the fifth of version 3 that still earned its place and cut the rest, including the persona system, which was the most elaborate thing I had built and the hardest to give up.\n\n' +
        'What shipped is three plugins from one marketplace. attacca-core holds the workflow skills plus the critic and researcher subagents. attacca-security holds the audit skills and the push gate. attacca-init holds /interrogate and the project intake skills. Each installs on its own, so nobody takes more than they need, and the per-project footprint is four small files: CLAUDE.md, AGENTS.md, a CONTEXT.md skeleton, and settings.json.\n\n' +
        'A break this size needs an exit for anyone still on the old version, even when the only current user is me. Version 3 is preserved on branch legacy/v3 at tag v3.11.2-final, with a migration guide covering state.json to CONTEXT.md and personas to subagents. It cost an hour.',
    },
    {
      heading: 'A gate that can refuse',
      body:
        'The security plugin registers a hook on the Bash tool that reads every command before it runs. If the command contains git push, the hook looks for .attacca/audits/latest.md and blocks the push unless that file exists, contains VERDICT: CLEAN, and is newer than the last commit, so the audit has to have seen the code being pushed. Setting ATTACCA_SKIP_AUDIT=1 gets past it when something is genuinely on fire, and that bypass leaves no audit trail on purpose.\n\n' +
        'The auditor behind the gate is a subagent invoked with file paths and nothing else: no commit message, no explanation of what the change was meant to do. That rule came out of version 3 and survived the rewrite intact, because an auditor who cannot read your justification cannot be argued into accepting it.\n\n' +
        'As models get faster and ship more code, this is the piece I expect to keep. Its own Delete when line names the thing that would retire it, a native enforced pre-push review gate, and Claude Code does not have one.',
    },
    {
      heading: 'The bug an outside reviewer found',
      body:
        'On June 27, 2026, bryan-anthropic opened issue #1 on the repo while reviewing Attacca for the Claude plugins community marketplace. claude plugin validate was failing on one agent file: the YAML frontmatter would not parse, so the agent loaded with empty metadata.\n\n' +
        'The cause was a missing pair of quotes. The description value was a plain YAML scalar containing a colon followed by a space, which YAML reads as a key-value separator, and that aborts the whole frontmatter block. The name and model fields went down with the description, and nothing printed a warning.\n\n' +
        'The report named one file. A second agent file had the same unquoted colon and would have kept validation failing after the named fix, so both got quoted, matching the convention every skill file in the repo already followed. Validation passes now, including under --strict. The v4 redesign retires those persona agents entirely, so the files that failed are gone from the default branch as well. I closed the issue on August 2, 2026.\n\n' +
        'The failure was silent. A file that parses into an empty object is worse than a file that refuses to parse at all, and it took an outside tool run by an outside person to surface it.',
    },
  ],
};

export default attacca;
