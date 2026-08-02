'use client';

import { motion } from 'framer-motion';
import { useMode, type Mode } from '@/lib/mode';

interface ResearchMetric {
  value: string;
  label: string;
}

interface ResearchRole {
  org: string;
  affiliation: string;
  role: string;
  period: string;
  funding?: string;
  /** Outcome-first. */
  recruiter: string[];
  /** Problem-first. */
  builder: string[];
  /** Recruiter mode only. */
  metrics: ResearchMetric[];
}

const ROLES: ResearchRole[] = [
  {
    org: 'SWARM Lab',
    affiliation: 'UT Austin ECE, Chinchali Group',
    role: 'Robotics Lab Researcher',
    period: 'Sept 2025 – Present',
    funding: 'AFRL-funded',
    recruiter: [
      'I own the MEVA data pipeline: cross-camera person re-identification and symbolic question generation over multi-gigabyte surveillance video. I am the sole author of the MEVA subdataset question set, 2,250 of the benchmark 6,000 QA pairs and its largest single contribution.',
      'Cross-camera person identity reached 95.5% slot coverage, 887 of 929, with 158 persons described from 4.8M image crops. Moving generation out of an LLM-first approach and into a symbolic layer cut cost about 96%, from roughly $50 per batch to $1.86 total. The pipeline runs to about 4,700 lines of Python across 10 versions. I presented the findings to the AFRL sponsor.',
    ],
    builder: [
      'The lab needed a way to tell whether a vision-language model actually reasons across cameras or just answers from whatever single view it was given. Building that test meant matching the same person between cameras in multi-gigabyte surveillance video, then turning those matches into questions with known answers.',
      'The first version handed generation to an LLM, which was the expensive way to do it. Pushing the work down into a symbolic layer instead cut the cost by about 96%, and it took ten versions of the pipeline to settle. I wrote the question set for the MEVA subdataset and presented what we found to the AFRL sponsor.',
    ],
    metrics: [
      { value: '2,250', label: 'QA pairs authored, of 6,000 in the benchmark' },
      { value: '95.5%', label: 'slot coverage for cross-camera identity (887/929)' },
      { value: '~96%', label: 'lower generation cost, $50 per batch to $1.86 total' },
      { value: '4.8M', label: 'image crops behind 158 person descriptions' },
      { value: '~4,700', label: 'lines of Python across 10 pipeline versions' },
    ],
  },
  {
    org: 'UCAIR',
    affiliation: 'University of Utah',
    role: 'Student Researcher',
    period: 'Jun – Sept 2024',
    recruiter: [
      'Reconstructed undersampled cardiac MRI k-space with Deep Image Prior, an unsupervised method that needs no ground-truth training set. Cut training time 40% while improving convergence and reconstruction fidelity, validated with PSNR and SSIM.',
    ],
    builder: [
      'Undersampled MRI scans finish faster but come back with artifacts. The usual correction trains a network on ground-truth reconstructions. Deep Image Prior does not need any, because the structure of the network does the regularizing, so it runs unsupervised on the scan in front of it.',
      'My work was on convergence: reaching a good reconstruction in 40% less training time, checked with PSNR and SSIM.',
    ],
    metrics: [
      { value: '40%', label: 'less training time, with better convergence and fidelity' },
    ],
  },
];

const AUTHORS_BEFORE = 'Sahil Shah, S P Sharan, Harsh Goel, Manvik Pasula, ';
const AUTHORS_AFTER = ', Minkyu Choi, Sandeep P. Chinchali';

const HEADER = {
  recruiter: {
    eyebrow: 'Publication and lab work',
  },
  builder: {
    eyebrow: 'Problems I have been stuck on',
  },
};

export default function ResearchSection() {
  const { mode } = useMode();

  return (
    <section id="research" className="py-20 md:py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold uppercase text-[var(--color-tertiary)]">
            Research
          </h2>
          <p className="text-sm uppercase tracking-[5px] text-[var(--color-secondary)] mt-2">
            {HEADER[mode].eyebrow}
          </p>
        </motion.div>

        {/* Recruiter mode leads with the paper. Builder mode leads with the work. */}
        {mode === 'recruiter' && <PublicationCard className="mb-14" />}

        <ol className="relative ml-2 border-l border-[var(--color-tertiary)]/15 space-y-14">
          {ROLES.map((entry, i) => (
            <TimelineEntry key={entry.org} entry={entry} mode={mode} index={i} />
          ))}
        </ol>

        {mode === 'builder' && <PublicationCard className="mt-14" />}
      </div>
    </section>
  );
}

function TimelineEntry({
  entry,
  mode,
  index,
}: {
  entry: ResearchRole;
  mode: Mode;
  index: number;
}) {
  const body = mode === 'recruiter' ? entry.recruiter : entry.builder;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pl-8 md:pl-12"
    >
      <span
        aria-hidden="true"
        className="absolute -left-[6px] top-[9px] w-3 h-3 rounded-full bg-[var(--color-primary)]"
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl md:text-2xl font-bold uppercase text-[var(--color-tertiary)]">
          {entry.org}
        </h3>
        {entry.funding && (
          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {entry.funding}
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-tertiary)]/60 mt-1">{entry.affiliation}</p>

      <p className="text-xs uppercase tracking-widest text-[var(--color-tertiary)]/50 mt-3">
        {entry.role} · {entry.period}
      </p>

      <div className="mt-5 max-w-[70ch]">
        {body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-[15px] leading-relaxed text-[var(--color-tertiary)]/85 mb-4"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {mode === 'recruiter' && entry.metrics.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mt-6 bg-[var(--color-tertiary)]/10"
          aria-label={`Key numbers for ${entry.org}`}
        >
          {entry.metrics.map((metric) => (
            <div key={metric.label} className="bg-[var(--color-background)] p-4">
              <div
                className="text-2xl font-bold text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                {metric.value}
              </div>
              <div className="text-xs text-[var(--color-tertiary)]/60 mt-1 leading-snug">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.li>
  );
}

function PublicationCard({ className = '' }: { className?: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={`bg-white border border-black/5 border-l-2 border-l-[var(--color-primary)]
                  rounded-sm shadow-sm p-6 md:p-8 ${className}`}
    >
      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)]">
        Publication
      </p>

      <h3 className="normal-case text-lg md:text-xl font-bold text-[var(--color-tertiary)] mt-3 leading-snug">
        CrossView: Can Vision-Language Models Reason Across Cameras?
      </h3>

      <p className="text-sm text-[var(--color-tertiary)]/70 mt-3">
        European Conference on Computer Vision (ECCV) 2026 · Accepted as a poster
      </p>

      <p className="text-sm text-[var(--color-tertiary)]/60 mt-4 leading-relaxed">
        {AUTHORS_BEFORE}
        <strong className="font-bold text-[var(--color-tertiary)]">Adithya Hebbalae</strong>
        {AUTHORS_AFTER}
      </p>
    </motion.article>
  );
}
