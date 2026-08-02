import type { Project } from '@/data/types';

const neuralgto: Project = {
  slug: 'neuralgto',
  title: 'NeuralGTO',

  tagline: {
    recruiter: 'Grounds LLM poker explanations in real CFR solver output. Shipped at $0/month.',
    builder: 'A language model on both ends of a CFR solver, with a fallback ladder underneath.',
  },

  summary: {
    recruiter:
      'NeuralGTO takes a poker hand written in plain English and returns a game theory optimal strategy along with the reasoning behind the numbers. A language model parses the input and writes the explanation; a counterfactual regret minimization solver produces the actual frequencies in between. I built the pipeline, the React and FastAPI product around it, the security hardening, and the benchmark evaluation, then tagged v1.0.0 in March 2026 on infrastructure that costs nothing to run.',
    builder:
      'TexasSolver answers exactly one kind of question: two players, postflop. Everything else in NeuralGTO is a decision about what to substitute when the solver cannot answer, and how much accuracy each substitution costs. Preflop goes to pre-solved lookup tables, multi-way pots to a pairwise decomposition, and an unreachable solver to the language model. The benchmark numbers on this page are the record of those tradeoffs.',
  },

  role: 'Founder and sole engineer',
  period: 'Feb 2026 – Mar 2026',
  status: 'complete',
  depth: 'full',
  category: ['ML/AI', 'Web App'],

  tech: [
    'Python 3.13',
    'TypeScript',
    'React 19',
    'Vite',
    'Tailwind CSS',
    'FastAPI',
    'Pydantic',
    'Poetry',
    'pytest',
    'Google Gemini 2.5 Flash',
    'TexasSolver (CFR)',
    'Cloudflare Pages',
    'Oracle Cloud (Ampere ARM64)',
    'nginx',
    'systemd',
  ],

  metrics: [
    {
      value: '88.5%',
      label: 'GTO accuracy on the 244 PokerBench preflop scenarios the lookup tables covered, 24.4% of the set',
    },
    {
      value: '58–74.5%',
      label: 'Accuracy across modes on 424 multi-way scenarios solved by pairwise decomposition',
    },
    {
      value: '$0/mo',
      label: 'Infrastructure: Cloudflare Pages, Oracle Cloud Always Free, Gemini free tier',
    },
    {
      value: '444+',
      label: 'Tests passing at deployment, 392 of them runnable offline with no API key or solver binary',
    },
    {
      value: '7 of 11',
      label: 'Vulnerabilities patched out of 11 assessed in a pre-deployment audit',
    },
    {
      value: '12 days',
      label: '51 commits across 146 files, from the first commit to the v1.0.0 tag',
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/NeuralGTO',
  },

  sections: [
    {
      heading: 'Where the frequencies come from',
      body: `A game theory optimal strategy is an equilibrium strategy for a two-player zero-sum game: play it and no opponent, however good, can exploit you over a long enough run. For no-limit hold’em that equilibrium is not something anyone can write down, so solvers approximate it with counterfactual regret minimization — repeatedly playing the game against itself, tracking how much each action would have regretted in hindsight, and shifting frequencies toward the actions it regretted least. Run enough iterations and the average strategy converges toward equilibrium.

That is a numerical procedure, and a language model asked to perform it directly will return plausible frequencies that were invented. Gemini on its own scored 86.5% against the PokerBench preflop set, which sounds respectable until you notice it cannot tell you which 13.5% it got wrong. NeuralGTO handles preflop by looking the answer up instead, matching each scenario against 1,108 pre-solved range files. That reached 88.5% on the 244 scenarios the tables covered. The lift over the model alone is two points, which was the surprising part of the evaluation. The real argument for the lookup is that when it fires, the number came out of a solver and can be pointed at.

Postflop there is nothing to look up. The tree is too large to pre-solve, so the CFR binary runs live as a subprocess, one to six minutes depending on the accuracy target.`,
    },
    {
      heading: 'Multi-way pots and where the accuracy goes',
      body: `TexasSolver is a two-player solver. Real six-max hands reach the flop three and four players deep, and those spots have no equilibrium it can compute. The workaround is pairwise decomposition: break the multi-way spot into the heads-up matchups inside it, solve or look up each one, and reconcile the results into a single recommendation, with the language model synthesizing where the pairs disagree.

That covers all 424 multi-way scenarios in the benchmark, and accuracy lands between 58% and 74.5% depending on the mode. The per-action breakdown is more useful than the headline. In heuristic-only mode the system is right 91.2% of the time when the answer is fold, 66.4% when it is raise, and 2.4% when it is call. Folding survives the decomposition — a hand behind in every pairwise matchup is behind in the pot. The call-versus-raise margin does not survive it, and that is where nearly all the error sits.`,
    },
    {
      heading: 'Running the whole thing for nothing',
      body: `The bill was $0/month, and that constraint shaped the architecture more than any other decision. The React frontend went on Cloudflare Pages. The solver backend ran on an Oracle Cloud Always Free instance. Those are Ampere machines and TexasSolver publishes no ARM64 build, so the binary was compiled from source on the box. Gemini, Supabase, and Clerk all sat inside their free tiers, behind a daily budget tracker that trips the rate limiter before the quota runs out.

A second language-model-only backend on Cloud Run covered the case where the solver host was unreachable, which is a live possibility on a tier that reclaims idle instances. That is the actual price of a zero-dollar bill, so the pipeline degrades in steps rather than failing: solver down falls back to the language model, network error falls back to a hash-keyed cache of earlier identical queries. Something actionable comes back either way, tagged with which layer produced it.`,
    },
    {
      heading: 'The security pass',
      body: `A public endpoint that shells out to a compiled binary is the most obviously attackable thing in the system, so I ran an audit against it before deploying. Eleven vulnerabilities came out of that pass and seven were patched.

The patches were 14 regexes rejecting shell metacharacters and injection patterns at the input boundary, path validation on the solver binary so the subprocess cannot be aimed somewhere else, rate limiting at the session, IP, and global level, and a lockout at five failed attempts per fifteen minutes. Pre-commit hooks keep hardcoded secrets, eval, exec, and shell=True out of the repo, and a pre-push gate runs the full suite. 444 tests were green at deployment, 392 of them offline with no API key and no solver binary required, which is what made running them on every commit practical rather than aspirational.`,
    },
    {
      heading: 'What it does not do',
      body: `This is a study tool. A solve takes one to six minutes, which rules out using it at a table even if that were the goal, and there is no bot and no live-play path. Game theory optimal means unexploitable, which is a different property from profitable — an equilibrium strategy declines to lose to a strong opponent rather than promising to beat a weak one. The output is an explanation of why a frequency is what it is.

The repo has not been touched since v1.0.0 in March 2026. The research thread that came out of it, using a language model to prune the CFR game tree before solving, targets 40 to 60% fewer solver iterations at under 5% strategy deviation. That is a hypothesis on a paused branch, not a result.`,
    },
  ],
};

export default neuralgto;
