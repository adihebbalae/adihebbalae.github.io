import type { Project } from '@/data/types';

/**
 * West Campus Integrity Index.
 *
 * Source repo is PRIVATE — architecture and stack only on this page. No code,
 * no screenshots, no file listings, and no `github` link.
 *
 * The project indexes public records about named commercial operators, so the
 * copy here follows the project's own legal guardrails: no individual landlord,
 * owner, or address is named, no one is characterised as a bad actor, and no
 * legal conclusion is asserted. Describe what the index measures, never who
 * scores badly.
 *
 * Every number below traces to the private experience corpus record.
 */
const wcii: Project = {
  slug: 'wcii',
  title: 'West Campus Integrity Index',

  tagline: {
    recruiter:
      'An accountability index for UT Austin student housing, built on Austin public records.',
    builder:
      'A zero-dependency Node pipeline that commits its own raw data to git as the audit trail.',
  },

  summary: {
    recruiter:
      "West Campus is the student-housing district next to UT Austin, and most of what a prospective tenant can find about a building is reviews. WCII indexes what the city’s own records say instead, under rules published before any result ships. A scheduled pipeline pulls 14 public-record datasets, commits each pull to git, and rebuilds a static site with no server and no manual upkeep. It has been live at wcii.pages.dev since July 2026.",
    builder:
      'The pipeline came before the site. Austin publishes its code complaints, 311 requests, permits and occupancy certificates through a Socrata API, so a scheduled job pulls each dataset, writes a dated snapshot, and commits it. That commit is the audit trail: the time series starts the day the pipeline does, and nothing in it can be quietly rewritten. Everything downstream reads those committed files, which is part of why the whole thing runs on zero runtime dependencies.',
  },

  role: 'Sole developer',
  period: 'Jul 2026 – Present',
  status: 'live',
  depth: 'full',
  category: ['Civic', 'Web App'],

  tech: [
    'Node.js',
    'JavaScript',
    'Astro',
    'Cloudflare Pages',
    'GitHub Actions',
    'Socrata SODA API',
    'Git',
  ],

  metrics: [
    { value: '14', label: 'Austin public-record datasets in the pipeline' },
    { value: '0', label: 'Runtime dependencies in the ingest pipeline' },
    { value: '5', label: 'GitHub Actions workflows covering ingest and deploy' },
    { value: '1,496', label: 'Files tracked in the repo, most of them dated data snapshots' },
    { value: '200', label: 'HTTP status the deploy workflow re-checks, or the build fails' },
    {
      value: '89',
      label: 'Commits authored, alongside 48 from the scheduled ingest bot',
      recruiterOnly: true,
    },
  ],

  links: {
    live: 'https://wcii.pages.dev',
  },

  sourcePrivate: true,

  sections: [
    {
      heading: 'Why the index exists',
      body:
        'West Campus is the dense student-housing district next to UT Austin. A small number of operators run most of the buildings, leases get signed months before move-in, and most of the people signing them are signing their first lease. What they have to go on is a review page per building.\n\n' +
        'Reviews are the wrong unit twice over. They attach to a building, so a rebrand resets the record, and they say nothing about a company that runs several other buildings on the same street. Austin publishes the records that would answer those questions: code complaints, 311 requests, permits, occupancy certificates, repeat-offender filings. Those records sit in separate municipal datasets that nobody reads before signing a lease.\n\n' +
        'WCII puts those records under a different accountability unit: the company that operates a building rather than the building itself. A record aggregates up from the building to the owning entity to the operator, so it survives a rebrand and follows a portfolio.',
    },
    {
      heading: 'Where the data comes from',
      body:
        "Austin runs its open-data portal on Socrata, and most of what the index needs is already there behind a public API: code complaint cases, 311 service requests, issued construction permits, certificates of occupancy, and three separate Repeat Offender Program streams covering registrations, property activity and recorded deficiencies. Ownership comes from Travis County appraisal records joined against Texas Comptroller franchise-tax entity records, which is how a parcel gets connected to the company behind it. Fourteen record sets are wired in.\n\n" +
        'The capture scopes are published as methodology inputs: which datasets, which columns, which date floors, which geographic box. None of that lives only in the pipeline config. The complaint dataset is the primary signal, and the Repeat Offender data sits on top of it as an escalation, because that program’s threshold rarely triggers for newer buildings.\n\n' +
        'The one source that is not a government dataset is asking-price history, taken from each building’s own public floor-plan page under a named user agent, one page per site per run, with robots.txt honored. There is no review scraper, and there will not be one. Bulk review collection would mean breaking the terms of the service holding the reviews, and a project whose whole claim is that it plays by published rules cannot start there.',
    },
    {
      heading: 'Every pull is a commit',
      body:
        'Each scheduled run writes the raw API response to a dated file and commits it to the repository. Nothing is overwritten in place.\n\n' +
        'The reason is adversarial. An index that grades named companies will eventually be accused of moving its own inputs to reach the conclusion it wanted, and the only useful answer to that is a history anyone can diff. Because every snapshot is a commit, a reader can check what the city said on a given date without taking my word for any of it, and I cannot revise the past without leaving the revision in the log.\n\n' +
        'It cost nothing to do on day one and would have been close to impossible to add later, because a time series cannot be backfilled out of records the city has already updated in place. The repository now tracks about fifteen hundred files and the large majority of them are those snapshots.',
    },
    {
      heading: 'Zero runtime dependencies',
      body:
        'The pipeline has no runtime dependencies. Not a small dependency tree but an empty one. The Socrata client, the paging, the retry and backoff, the snapshot writing are all plain Node ESM, and the only third-party packages anywhere in the project are the static site generator and two build-time font and image tools.\n\n' +
        'This started as a maintenance decision. The pipeline has to keep running through a semester when nobody is watching it, and the likeliest way an unattended job dies is a transitive dependency shipping a breaking change into a version range that was never pinned. Removing that surface removes the failure.\n\n' +
        'It also pushed the architecture somewhere useful. With no server and no database, every piece of state is a file in the repository, and the behavior of the whole system is reconstructable from what is checked in. Astro reads the computed files at build time, the output goes to Cloudflare Pages, and a push is the only trigger anything needs.\n\n' +
        'That trigger was wrong for a while. The data jobs were committing on schedule and the site was serving numbers six days old, because committing data and publishing the site were never connected: a deploy only happened when I ran one by hand. On a site whose entire claim is that these are the current public records, quietly serving stale numbers is the worst available failure. The fix publishes on any push to the default branch, which catches every data job at once, and it re-checks the live URL afterward so a deploy that leaves the site unhealthy fails instead of passing.',
    },
    {
      heading: 'What a public-records index cannot tell you',
      body:
        "A complaint case means somebody filed; it does not mean the city found a violation. Some close with no violation found, and about a third of the rows in the scoring window carry Austin’s own duplicate disposition. The published rule counts a duplicate as half a filing, which is a chosen constant, not a discovered one: counting duplicates in full overstates the record, discarding them understates it, and nothing in the data separates the two cases. Both bounds are published beside the number so a reader who disagrees with the weight can compute either.\n\n" +
        'The count is not adjusted for building size, because verified bed counts do not exist across most of the index. A nine-hundred-bed tower and a two-hundred-bed building sit on the same scale, and the larger one will tend to sit higher for that reason alone. A building that cannot be matched to a city parcel gets no label at all rather than a favorable one.\n\n' +
        'The scale runs one direction. Complaint-based enforcement under-reports, because tenants who expect retaliation do not file, so a high count is strong evidence of a problem while a low count is weak evidence of quality. The top label says only that the city has no adverse record on file inside the window. It is not an endorsement, and nothing in this data would justify reading it as one.\n\n' +
        'For the same reason no composite score exists. A composite needs weights across three layers, two of those layers have no data yet, and publishing one now would mean inventing the weights. Putting the methodology out before the results was the point: once the rules are public they cannot be tuned after seeing which answer they produce. An earlier draft graded A through F and that scale was withdrawn, because a single letter travels away from the record that produced it and starts meaning something the record never said.',
    },
  ],
};

export default wcii;
