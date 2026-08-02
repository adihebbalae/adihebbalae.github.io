'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data';
import type { Category, Project } from '@/data/types';
import { useMode } from '@/lib/mode';

/** Display order for the filter tabs. Only tabs with projects behind them show. */
const CATEGORY_ORDER: Category[] = [
  'Research',
  'ML/AI',
  'Developer Tools',
  'Web App',
  'Embedded',
  'Civic',
  'Interactive',
  'Freelance',
];

const HEADER = {
  recruiter: 'Shipped work',
  builder: 'Building, learning, exploring',
};

export default function ProjectsSection() {
  const { mode } = useMode();
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');

  const categories = useMemo<(Category | 'All')[]>(() => {
    const present = new Set(projects.flatMap((p) => p.category));
    return ['All', ...CATEGORY_ORDER.filter((c) => present.has(c))];
  }, []);

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category.includes(activeFilter));

  return (
    <section id="projects" className="py-20 md:py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold uppercase text-[var(--color-tertiary)]">
            Projects
          </h2>
          <p className="text-sm uppercase tracking-[5px] text-[var(--color-secondary)] mt-2">
            {HEADER[mode]}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-5 py-2 text-xs uppercase tracking-widest font-medium border rounded-sm transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-transparent text-[var(--color-tertiary)] border-[var(--color-tertiary)]/30 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const STATUS_STYLES: Record<Project['status'], string> = {
  live: 'bg-green-500/10 text-green-600',
  'in-progress': 'bg-yellow-500/10 text-yellow-600',
  complete: 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]',
  archived: 'bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)]/55',
};

const STATUS_LABELS: Record<Project['status'], string> = {
  live: '● Live',
  'in-progress': '◐ In progress',
  complete: '● Complete',
  archived: '○ Archived',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { mode } = useMode();
  const { live, github } = project.links;
  const href = `/projects/${project.slug}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white rounded-sm border border-black/5 overflow-hidden
                 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm ${
            STATUS_STYLES[project.status]
          }`}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold uppercase text-[var(--color-tertiary)] mb-3 pr-24 leading-tight">
          <Link href={href} className="hover:text-[var(--color-primary)] transition-colors">
            {project.title}
          </Link>
        </h3>

        <p className="text-sm text-[var(--color-tertiary)]/70 leading-relaxed mb-5 flex-1">
          {project.tagline[mode]}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="text-[11px] uppercase tracking-wider font-medium
                         bg-[var(--color-background)] text-[var(--color-tertiary)]/60
                         px-3 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links. Every card links to its own page; external links are extra. */}
        <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-black/5">
          <Link
            href={href}
            aria-label={`Read about ${project.title}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                       text-[var(--color-primary)] hover:text-white
                       border border-[var(--color-primary)] px-4 py-2 rounded-sm
                       transition-all duration-200 hover:bg-[var(--color-primary)]"
          >
            <ArrowRight size={12} aria-hidden="true" />
            Read more
          </Link>

          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit the live site for ${project.title}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                         text-[var(--color-tertiary)] hover:text-white
                         border border-[var(--color-tertiary)]/30 px-4 py-2 rounded-sm
                         transition-all duration-200 hover:bg-[var(--color-tertiary)]"
            >
              <ExternalLink size={12} aria-hidden="true" />
              Live
            </a>
          )}

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                         text-[var(--color-tertiary)] hover:text-white
                         border border-[var(--color-tertiary)]/30 px-4 py-2 rounded-sm
                         transition-all duration-200 hover:bg-[var(--color-tertiary)]"
            >
              <Github size={12} aria-hidden="true" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
