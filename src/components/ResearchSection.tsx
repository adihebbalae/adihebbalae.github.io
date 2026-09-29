import { ExternalLink, Github } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { SWARM } from '@/data/site';

/**
 * Facts here come from Corpus/experiences/{swarm-lab,crossview-meva,ucair-mri}.md
 * in the _Resumes repo, which wins on any conflict. Notes that bit before:
 * - The title is "Undergraduate Researcher" (resolved 2026-08-10), not "Robotics Lab Researcher".
 * - AFRL was ONE summer 2026 project, not the lab's funding (corrected 2026-09-16).
 *   Do not put an "AFRL-funded" badge back on the lab.
 * - Pipeline line counts are volume metrics and never lead; they are not shown.
 */

interface Fact {
  value: string;
  label: string;
}

interface ResearchRole {
  org: string;
  affiliation: string;
  role: string;
  period: string;
  body: string[];
  facts?: Fact[];
  links?: { href: string; label: string; github?: boolean }[];
}

const ROLES: ResearchRole[] = [
  {
    org: 'SWARM Lab',
    affiliation: 'UT Austin ECE, Chinchali Group',
    role: 'Undergraduate Researcher',
    period: 'Sept 2025 to present',
    body: [
      'The lab needed a way to tell whether a vision-language model actually reasons across cameras or just answers from whichever single view it was given. That became CrossView, a 6,000-question benchmark over four multi-camera datasets.',
      'I owned one of the four: MEVA, surveillance video from 28 cameras across four sites. Its annotations record that an activity happened, not who did it, so before any question about a person could exist I had to tie activities to people from bounding boxes and camera geometry. The first version handed question generation to an LLM. Moving it into a symbolic layer made every answer computable from the annotations, and regenerating the whole dataset went from about $50 to $1.86.',
      'MEVA turned out to be the subset models score lowest on in every category. Over summer 2026 I stayed on as a funded research assistant on a multi-camera scene understanding project with the Air Force Research Laboratory, and presented our findings to the sponsor.',
    ],
    facts: [
      { value: '2,250', label: 'of the benchmark’s 6,000 questions, the largest of its four datasets' },
      { value: '95.5%', label: 'of surveillance slots with cross-camera identity resolved (887 of 929)' },
      { value: '$1.86', label: 'to regenerate the full MEVA set, down from about $50' },
    ],
    links: [
      { href: SWARM.github, label: 'SWARM Lab on GitHub', github: true },
      { href: SWARM.crossview.site, label: 'CrossView project page' },
    ],
  },
  {
    org: 'UCAIR',
    affiliation: 'University of Utah',
    role: 'Student Researcher',
    period: 'Jun to Sept 2024',
    body: [
      'Undersampled MRI scans finish faster but come back with artifacts. The usual correction trains a network on ground-truth reconstructions. Deep Image Prior does not need any, because the structure of the network does the regularizing, so it runs unsupervised on the scan in front of it.',
      'My work was on convergence for cardiac MRI: reaching a good reconstruction in 40% less training time, checked with PSNR and SSIM.',
    ],
  },
];

const AUTHORS_BEFORE = 'Sahil Shah, S P Sharan, Harsh Goel, Manvik Pasula, ';
const AUTHORS_AFTER = ', Minkyu Choi, Sandeep P. Chinchali';

export default function ResearchSection() {
  return (
    <section
      id="research"
      className="px-5 sm:px-8 md:px-12 py-20 md:py-28 bg-[var(--color-surface)] border-y border-[var(--color-rule)]"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionHeading title="Research" />

        <PublicationCard />

        <div className="mt-16 md:mt-20 space-y-16 md:space-y-20">
          {ROLES.map((entry) => (
            <RoleEntry key={entry.org} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleEntry({ entry }: { entry: ResearchRole }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)] gap-4 md:gap-12">
      <header>
        <h3 className="text-3xl md:text-4xl">{entry.org}</h3>
        <p className="mt-2 text-[15px] text-[var(--color-tertiary)]/70">{entry.affiliation}</p>
        <p className="mt-1 text-[15px] text-[var(--color-tertiary)]/70">
          {entry.role}, {entry.period}
        </p>
        {entry.links && (
          <ul className="mt-4 space-y-2">
            {entry.links.map((l) => (
              <li key={l.href}>
                <OutLink href={l.href} github={l.github}>
                  {l.label}
                </OutLink>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="max-w-[66ch]">
        <div className="space-y-5 text-[17px] leading-[1.7]">
          {entry.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        {entry.facts && (
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[var(--color-rule)] pt-6">
            {entry.facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd
                  className="text-3xl font-semibold text-[var(--color-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {f.value}
                </dd>
                <dd className="mt-1 text-[14px] leading-snug text-[var(--color-tertiary)]/70">{f.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

function PublicationCard() {
  const cv = SWARM.crossview;
  return (
    <article className="relative bg-[var(--color-night)] text-white rounded-sm p-6 sm:p-8 md:p-10 overflow-hidden">
      <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[6px] bg-[var(--color-primary)]" />
      <p className="text-[15px] text-white/65">ECCV 2026, accepted as a poster</p>
      <h3 className="mt-3 text-white text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.1] max-w-[24ch]">
        CrossView: Can Vision-Language Models Reason Across Cameras?
      </h3>
      <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-white/70">
        {AUTHORS_BEFORE}
        <strong className="font-semibold text-white">Adithya Hebbalae</strong>
        {AUTHORS_AFTER}
      </p>

      <ul className="mt-7 flex flex-wrap gap-3">
        {[
          { href: cv.site, label: 'Project page' },
          { href: cv.paper, label: 'Paper' },
          { href: cv.code, label: 'Code', github: true },
          { href: cv.dataset, label: 'Dataset' },
        ].map((l, i) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-[15px] rounded-sm border transition-colors ${
                i === 0
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] hover:bg-white hover:text-[var(--color-night)] hover:border-white'
                  : 'border-white/30 hover:bg-white hover:text-[var(--color-night)]'
              }`}
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
            >
              {l.github ? <Github size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />}
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

function OutLink({
  href,
  github,
  children,
}: {
  href: string;
  github?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-[15px] text-[var(--color-primary)] underline underline-offset-4 decoration-[var(--color-primary)]/35 hover:decoration-[var(--color-primary)]"
    >
      {github ? <Github size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />}
      {children}
    </a>
  );
}
