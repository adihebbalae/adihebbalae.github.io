import type { Project } from '../types';

/**
 * Source repo is private. Architecture and stack only — no code, no data
 * files, no performance figures.
 */
const project: Project = {
  slug: 'courtalpha',
  title: 'CourtAlpha',
  tagline: {
    recruiter: 'Sports modelling pipeline whose headline finding is a negative result that held up.',
    builder: 'I built the review layer that killed my own headline result. Then it happened again.',
  },
  summary: {
    recruiter:
      'CourtAlpha is a from-scratch modelling pipeline over 17 NBA seasons and 13 seasons of European soccer results. The question it asks is whether published closing prices can be predicted at all, and across every strategy tested, they could not. What outlasted the modelling is the review layer built to check it, which caught two findings I had already convinced myself were real. The output is research about market efficiency, and nothing in it is a system for placing bets.',
    builder:
      'Public repositories in this area report returns that would be remarkable if they were real, and they almost never are: leakage, overfitting, or a data-quality problem nobody looked for. I produced two of those myself. The first version computed player ratings over a full season and then predicted games inside that same season, which is future information laundered through a feature. The second survived my own checks and died under independent review, because half the historical prices were recorded in a format the real market does not use.',
  },
  role: 'Sole researcher and developer',
  period: 'Feb 2026 – Present',
  status: 'in-progress',
  depth: 'overview',
  category: ['Research', 'ML/AI'],
  tech: ['Python', 'C via ctypes', 'scikit-learn', 'NumPy', 'pandas', 'Parquet'],
  metrics: [
    { value: '21,578', label: 'NBA games modelled, 2008 to 2025' },
    { value: '2', label: 'Of my own findings retracted after review' },
    { value: '7', label: 'Falsification checks a result has to survive' },
  ],
  links: {},
  sourcePrivate: true,
  sections: [
    {
      heading: 'The pipeline',
      body:
        'Historical results and price data land in Parquet through a resumable scraper. A stint-parsing engine written in C and called from Python through ctypes computes regularized adjusted plus-minus ratings, which is the one place where the pure-Python version was too slow to iterate on. Everything above it is scikit-learn: ridge regression and gradient boosting across spreads, moneylines, and totals, trained walk-forward so a model only ever sees information that existed before the game it is scoring.\n\nRoughly 20,000 lines of Python across 85 files. The two sports are separate research programs sharing one review layer, which is what forced the review code to stay generic instead of quietly growing assumptions about basketball.',
    },
    {
      heading: 'The review layer',
      body:
        'Two parts, and the second one matters more. The first is a falsification battery that runs in code and knows nothing about the sport: cluster-bootstrap confidence intervals, a placebo test that shuffles the signal and requires the result to collapse, dose-response monotonicity, per-season consistency, bias detection across price buckets, and stability across nuisance choices in the specification. It returns a verdict rather than a score. It was validated by showing it can pass a result that holds up and flag one that does not, since a check that only ever says no proves nothing.\n\nThe second part removes me from my own review. Independent reviewer agents each get the claim, its exact specification, and the location of the raw data. They share no context with each other or with my write-up, and each has to re-derive every number with its own code before a claim is kept. Claims are pre-registered before testing, including a written list of what would falsify them. My own checks had passed the finding that turned out to be an artifact, which is the entire argument for making review structural instead of careful.',
    },
  ],
};

export default project;
