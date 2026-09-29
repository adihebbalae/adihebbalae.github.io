'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT } from '@/data/site';

/**
 * The red city is the site's identity, so it stays full bleed. What changed
 * is the job of the text on top of it: the old hero said hello and nothing
 * else, and a visitor had to scroll to learn who this is. Now the first
 * screen answers that, and carries the three ways to reach him.
 *
 * This is the one orchestrated motion on the page. Sections below render
 * without entrance animations.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.25, 1, 0.3, 1] as const },
        };

  return (
    <header className="relative min-h-[100svh] overflow-hidden bg-[var(--color-night)] flex items-end">
      <img
        src="/header.png"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] scale-105 blur-[3px]"
      />
      {/* Darkens the lower half so the text reads over the lit windows. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(23,11,14,0.35) 0%, rgba(23,11,14,0.15) 35%, rgba(23,11,14,0.78) 75%, rgba(23,11,14,0.95) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 pb-14 md:pb-20 pt-32">
        <motion.div {...rise(0.1)} className="relative inline-block">
          {/* The tilted plate is the old site's signature and it stays. The
              offset shadow is a SIBLING of the plate: -rotate-2 makes the plate
              a stacking context, so a child behind it would never paint. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -rotate-2 -translate-x-2 translate-y-2 bg-[var(--color-quinary)] opacity-50"
          />
          <h1
            className="relative -rotate-2 bg-[var(--color-primary)] text-white m-0 px-5 py-2 sm:px-7 sm:py-3
                       text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.95] font-bold"
          >
            Hi, I&apos;m Adi
          </h1>
        </motion.div>

        <motion.p
          {...rise(0.45)}
          className="mt-8 max-w-[34ch] text-[clamp(1.2rem,2.6vw,1.6rem)] leading-snug text-white/95"
        >
          I study electrical and computer engineering at UT Austin, build research datasets in
          the SWARM Lab, and make software that other students actually use.
        </motion.p>

        {/* The full name lives here so the plate above can stay friendly. */}
        <motion.ul
          {...rise(0.7)}
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/75"
        >
          <li className="text-white">Adithya Hebbalae</li>
          <li>
            Co-author,{' '}
            <a href="#research" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
              CrossView at ECCV 2026
            </a>
          </li>
          {/* Graduation, not class standing: standing goes stale every August. */}
          <li>BS ECE, expected May 2029</li>
        </motion.ul>

        <motion.div {...rise(0.9)} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center px-5 py-3 text-[15px] font-medium text-white bg-[var(--color-primary)]
                       border border-[var(--color-primary)] rounded-sm transition-colors
                       hover:bg-[var(--color-primary-darker)] hover:border-[var(--color-primary-darker)]"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          >
            See the work
          </a>
          <HeroIcon href={`mailto:${CONTACT.email}`} label="Email Adi" icon={<Mail size={18} />} />
          <HeroIcon href={CONTACT.github} label="GitHub" icon={<Github size={18} />} external />
          <HeroIcon href={CONTACT.linkedin} label="LinkedIn" icon={<Linkedin size={18} />} external />
        </motion.div>
      </div>
    </header>
  );
}

function HeroIcon({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center w-12 h-12 rounded-sm text-white
                 border border-white/30 transition-colors hover:bg-white hover:text-[var(--color-night)]"
    >
      {icon}
    </a>
  );
}
