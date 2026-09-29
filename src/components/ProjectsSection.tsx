import Link from 'next/link';
import { ArrowUpRight, Github, Lock } from 'lucide-react';
import { projects } from '@/data';
import type { Project } from '@/data/types';
import SectionHeading from './SectionHeading';

/**
 * Two tiers, not one grid. Featured projects get a panel each; the rest are a
 * list, one row per project, so nine projects read as a curated set rather
 * than a wall of identical cards. The category filter is gone: with nine
 * projects it hid more than it helped.
 *
 * The home page reads the recruiter tagline as the plain "what it is" line.
 * Project pages stay in the builder voice (see lib/mode.tsx).
 */
export default function ProjectsSection() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="px-5 sm:px-8 md:px-12 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeading title="Projects" note="Things I built on my own time. Most of them are still up and running, which I count as a win." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <FeaturedCard key={p.slug} project={p} />
          ))}
        </div>

        <ul className="mt-12 border-t border-[var(--color-rule)]">
          {rest.map((p) => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Mar 2026 – Present" -> "2026". Years only, so the list scans. */
function year(period: string): string {
  const years = period.match(/\d{4}/g);
  if (!years) return period;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first} to ${last.slice(2)}`;
}

function StatusDot({ status }: { status: Project['status'] }) {
  const map: Record<Project['status'], { label: string; color: string }> = {
    live: { label: 'Live', color: 'bg-green-600' },
    'in-progress': { label: 'In progress', color: 'bg-amber-500' },
    complete: { label: 'Complete', color: 'bg-[var(--color-tertiary)]/40' },
    archived: { label: 'Archived', color: 'bg-[var(--color-tertiary)]/25' },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-2 text-[14px] text-[var(--color-tertiary)]/70">
      <span aria-hidden="true" className={`w-2 h-2 rounded-full ${s.color}`} />
      {s.label}
    </span>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className="group relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-sm p-6 md:p-7 transition-colors hover:border-[var(--color-primary)]">
      <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[4px] bg-[var(--color-primary)]" />
      <div className="flex items-center justify-between gap-3">
        <StatusDot status={project.status} />
        <span className="text-[14px] text-[var(--color-tertiary)]/55">{year(project.period)}</span>
      </div>

      <h3 className="mt-5 text-[1.9rem] leading-tight">
        {/* The stretched link makes the whole card clickable while the
            external links below stay separately focusable. */}
        <Link href={href} className="after:absolute after:inset-0 group-hover:text-[var(--color-primary)] transition-colors">
          {project.title}
        </Link>
      </h3>
      {/* What it is, then the engineering angle. The home page needs the
          plain description first; the builder line assumes you already know. */}
      <p className="mt-3 text-[17px] leading-snug text-[var(--color-tertiary)]">{project.tagline.recruiter}</p>
      <p className="mt-3 text-[15px] leading-relaxed italic text-[var(--color-tertiary)]/65 flex-1">
        {project.tagline.builder}
      </p>

      <p className="mt-5 text-[14px] text-[var(--color-tertiary)]/60">{project.tech.slice(0, 4).join(', ')}</p>

      <ExternalLinks project={project} />
    </article>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <li className="group relative border-b border-[var(--color-rule)]">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[260px_minmax(0,1fr)_auto] gap-x-8 gap-y-1 py-6 items-baseline">
        <h3 className="text-[1.5rem] leading-tight">
          <Link href={href} className="after:absolute after:inset-0 group-hover:text-[var(--color-primary)] transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="text-[16px] text-[var(--color-tertiary)]/75 sm:col-start-1 md:col-start-2 sm:row-start-2 md:row-start-1">
          {project.tagline.recruiter}
        </p>
        <div className="flex items-center gap-4 sm:col-start-2 md:col-start-3 sm:row-start-1 sm:justify-self-end">
          <span className="text-[14px] text-[var(--color-tertiary)]/55 whitespace-nowrap">{year(project.period)}</span>
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="text-[var(--color-tertiary)]/40 transition-transform group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </li>
  );
}

function ExternalLinks({ project }: { project: Project }) {
  const { live, github } = project.links;
  if (!live && !github && !project.sourcePrivate) return null;
  return (
    <div className="relative z-10 mt-5 pt-4 border-t border-[var(--color-rule)] flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--color-primary)] hover:underline underline-offset-4">
          <ArrowUpRight size={15} aria-hidden="true" />
          Visit
        </a>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--color-tertiary)]/80 hover:text-[var(--color-primary)]">
          <Github size={15} aria-hidden="true" />
          Source
        </a>
      )}
      {!github && project.sourcePrivate && (
        <span className="inline-flex items-center gap-1.5 text-[var(--color-tertiary)]/55">
          <Lock size={14} aria-hidden="true" />
          Private source
        </span>
      )}
    </div>
  );
}
