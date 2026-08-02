'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'live' | 'complete' | 'in-progress';
}

const projects: Project[] = [
  {
    id: 'vision-learning',
    title: 'Visionary: How Computers See',
    description:
      'An interactive educational website explaining Computer Vision through hands-on visualizations. Explore pixel matrices, CNN convolution filters, saliency maps, and watch a neural network train in real-time.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: ['ML/AI', 'Interactive', 'Web App'],
    status: 'complete',
  },
  {
    id: 'music-recommender',
    title: 'Music Recommender System',
    description:
      'A multi-part ML project using CNNs, KNNs, and RNNs to classify and recommend music based on song metadata and audio timbre features. Built across four progressive Jupyter notebook sections.',
    tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Librosa'],
    category: ['ML/AI'],
    liveUrl: '/projects/music-recommender',
    githubUrl: 'https://github.com/adihebbalae/adihebbalae-MusicRecommenders',
    status: 'complete',
  },
  {
    id: 'poker-ledger',
    title: 'Poker Ledger',
    description:
      'A mobile-responsive poker game payout calculator. Configure buy-ins, track chip counts for any number of players, and instantly calculate net gains/losses with balance verification.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: ['Web App'],
    liveUrl: '/projects/poker-ledger',
    githubUrl: 'https://github.com/adihebbalae/pokerledger2',
    status: 'live',
  },
  {
    id: 'name-that-song',
    title: 'Name That Song',
    description:
      'A browser-based music guessing game across four genres: Classical, Country, Hip-Hop, and Pop. Listen to audio clips and test your music knowledge.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: ['Interactive', 'Web App'],
    liveUrl: '/projects/name-that-song',
    githubUrl: 'https://github.com/adihebbalae/NameThatSong',
    status: 'live',
  },
  {
    id: 'valentines-day',
    title: "Valentine's Day Proposal",
    description:
      'A creative proposal site disguised as an RSVP form. Features a dramatic reveal, a fleeing "No" button with 10 humorous rejection messages, and full-screen confetti on acceptance.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    category: ['Web App'],
    liveUrl: 'https://adihebbalae.github.io/vd-site/',
    githubUrl: 'https://github.com/adihebbalae/vd-site',
    status: 'live',
  },
  {
    id: 'ai-notebooks',
    title: 'AI / ML Experiments',
    description:
      'Standalone ML experiment notebooks covering NLP sentiment classification and computer vision. Includes model training, evaluation, and data visualization.',
    tags: ['Python', 'TensorFlow', 'Scikit-learn', 'NLTK'],
    category: ['ML/AI'],
    liveUrl: '/projects/sentiment-demo',
    githubUrl: 'https://github.com/adihebbalae/AI-stuff',
    status: 'complete',
  },
  {
    id: 'academic-website',
    title: 'Professor Academic Portfolio',
    description:
      'A polished academic website for a professor in Child Neurology at the University of Louisville. Built with University of Louisville brand colors and responsive design.',
    tags: ['HTML', 'CSS'],
    category: ['Freelance'],
    status: 'complete',
  },
];

const allCategories = ['All', 'ML/AI', 'Web App', 'Interactive', 'Freelance'];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');

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
            Building, learning, exploring
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
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
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
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
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
            project.status === 'live'
              ? 'bg-green-500/10 text-green-600'
              : project.status === 'in-progress'
              ? 'bg-yellow-500/10 text-yellow-600'
              : 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]'
          }`}
        >
          {project.status === 'live' ? '● Live' : project.status === 'in-progress' ? '◐ In Progress' : '● Complete'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold uppercase text-[var(--color-tertiary)] mb-3 pr-20 leading-tight">
          {project.title}
        </h3>

        <p className="text-sm text-[var(--color-tertiary)]/70 leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
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

        {/* Links */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-black/5">
          {project.liveUrl && project.liveUrl.startsWith('/') ? (
            <Link
              href={project.liveUrl}
              aria-label={`View live demo of ${project.title}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                         text-[var(--color-primary)] hover:text-white
                         border border-[var(--color-primary)] px-4 py-2 rounded-sm
                         transition-all duration-200 hover:bg-[var(--color-primary)]"
            >
              <ExternalLink size={12} aria-hidden="true" />
              Live Demo
            </Link>
          ) : project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo of ${project.title}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                         text-[var(--color-primary)] hover:text-white
                         border border-[var(--color-primary)] px-4 py-2 rounded-sm
                         transition-all duration-200 hover:bg-[var(--color-primary)]"
            >
              <ExternalLink size={12} aria-hidden="true" />
              Live Demo
            </a>
          ) : null}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
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
