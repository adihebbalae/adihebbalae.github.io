'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react';
import type { Project } from '@/data/types';
import { useMode } from '@/lib/mode';

/**
 * Shared shell for every project page. Pages supply a Project and optional
 * children, which render after the standard sections.
 */
export default function ProjectPage({
  project,
  children,
}: {
  project: Project;
  children?: React.ReactNode;
}) {
  const { mode } = useMode();
  const metrics = project.metrics.filter((m) => mode === 'recruiter' || !m.recruiterOnly);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-[900px] mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest
                     text-[var(--color-tertiary)]/60 hover:text-[var(--color-primary)]
                     transition-colors mb-10"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          All projects
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusPill status={project.status} />
            {project.sourcePrivate && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest
                           font-bold px-3 py-1 rounded-sm bg-[var(--color-tertiary)]/10
                           text-[var(--color-tertiary)]/70"
                title="Source is private. This page covers architecture and stack only."
              >
                <Lock size={10} aria-hidden="true" />
                Private source
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold uppercase text-[var(--color-tertiary)] leading-tight">
            {project.title}
          </h1>

          <p className="mt-4 text-lg text-[var(--color-tertiary)]/75 leading-relaxed">
            {project.tagline[mode]}
          </p>

          <p className="mt-6 text-sm uppercase tracking-widest text-[var(--color-tertiary)]/50">
            {project.role} · {project.period}
          </p>
        </motion.header>

        <div className="h-px bg-[var(--color-tertiary)]/10 my-10" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base leading-relaxed text-[var(--color-tertiary)]"
        >
          {project.summary[mode]}
        </motion.p>

        {metrics.length > 0 && (
          <section className="mt-12" aria-label="Key numbers">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-tertiary)]/10">
              {metrics.map((m) => (
                <div key={m.label} className="bg-[var(--color-background)] p-5">
                  <div
                    className="text-2xl font-bold text-[var(--color-primary)]"
                    style={{ fontFamily: 'var(--font-primary)' }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs text-[var(--color-tertiary)]/60 mt-1 leading-snug">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.sections?.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="text-xl font-bold uppercase text-[var(--color-tertiary)] mb-4">
              {s.heading}
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-tertiary)]/85 whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}

        {children}

        <section className="mt-12">
          <h2 className="text-xl font-bold uppercase text-[var(--color-tertiary)] mb-4">Built with</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] uppercase tracking-wider font-medium
                           border border-[var(--color-tertiary)]/15 text-[var(--color-tertiary)]/70
                           px-3 py-1.5 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <ProjectLinks project={project} />
      </div>
    </main>
  );
}

function StatusPill({ status }: { status: Project['status'] }) {
  const styles: Record<Project['status'], string> = {
    live: 'bg-green-500/10 text-green-700',
    'in-progress': 'bg-yellow-500/10 text-yellow-700',
    complete: 'bg-[var(--color-secondary)]/25 text-[var(--color-tertiary)]/70',
    archived: 'bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)]/55',
  };
  const labels: Record<Project['status'], string> = {
    live: '● Live',
    'in-progress': '◐ In progress',
    complete: '● Complete',
    archived: '○ Archived',
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const { live, github, demo } = project.links;
  if (!live && !github && !demo) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-[var(--color-tertiary)]/10">
      {demo && (
        <Link href={demo} className={linkClass(true)}>
          <ExternalLink size={13} aria-hidden="true" />
          Try the demo
        </Link>
      )}
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className={linkClass(!demo)}>
          <ExternalLink size={13} aria-hidden="true" />
          Visit site
        </a>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass(false)}>
          <Github size={13} aria-hidden="true" />
          Source
        </a>
      )}
    </div>
  );
}

function linkClass(primary: boolean) {
  const base =
    'inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium px-5 py-2.5 rounded-sm border transition-all duration-200';
  return primary
    ? `${base} bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)]`
    : `${base} bg-transparent text-[var(--color-tertiary)] border-[var(--color-tertiary)]/25 hover:bg-[var(--color-tertiary)] hover:text-white hover:border-[var(--color-tertiary)]`;
}
