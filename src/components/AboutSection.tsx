'use client';

import { motion } from 'framer-motion';
import { useMode } from '@/lib/mode';

const COPY = {
  recruiter: {
    eyebrow: 'ECE at UT Austin',
    body: [
      'I study electrical and computer engineering at the University of Texas at Austin, with a concentration in computer architecture and embedded systems, graduating May 2029. I am a University Honors student.',
      "Since September 2025 I have worked in the SWARM Lab on video understanding, where I own the data pipeline behind a benchmark that tests whether vision-language models can follow a person across cameras. Before that I spent a summer at the University of Utah reconstructing undersampled cardiac MRI.",
      'The rest of my time goes to the projects below: developer tools, web apps, and embedded firmware.',
    ],
  },
  builder: {
    eyebrow: 'Learning by building',
    body: [
      'I started coding at 8, making a game in Scratch. The way I learn has not changed much since. Pick something I do not understand, build with it, and find out where it breaks.',
      'I am at UT Austin now for electrical and computer engineering, mostly computer architecture and embedded systems, and most of my week goes to a research lab.',
      'The projects below are the rest of it. A few are useful to other people. Most were the fastest way for me to understand something.',
    ],
  },
};

export default function AboutSection() {
  const { mode } = useMode();
  const copy = COPY[mode];

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_34%] gap-12 lg:gap-24 items-center">
        {/* Left: Text Content */}
        <div className="relative">
          {/* Red accent bar. It is absolutely positioned, and a positioned
              element paints above static siblings no matter what the DOM order
              is — so the text below has to be positioned too, or the bar covers
              it. The padding then keeps them from overlapping visually: it has
              to stay wider than the bar at BOTH breakpoints, which is what
              lg:pl-0 got wrong while the bar grew to 3.4vw. */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 w-[15px] lg:w-[3.4vw] h-[62px] lg:h-[115px] bg-[var(--color-primary)]"
          />

          <div className="relative pl-8 lg:pl-[calc(3.4vw+2rem)]">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45 }}
              className="block text-4xl lg:text-5xl font-bold uppercase leading-tight text-[var(--color-tertiary)]"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              About me
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="block text-sm lg:text-lg uppercase tracking-[5px] text-[var(--color-tertiary)] mt-1 mb-6"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              {copy.eyebrow}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="max-w-[62ch]"
            >
              {copy.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-[15px] leading-relaxed mb-5 text-[var(--color-tertiary)]"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <motion.a
              href="#projects"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45, delay: 0.45 }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('projects');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center text-sm uppercase tracking-widest font-medium
                         text-[var(--color-primary)] bg-transparent border border-[var(--color-primary)]
                         px-8 py-3 rounded-sm cursor-pointer transition-all duration-200
                         hover:bg-[var(--color-primary)] hover:text-white min-w-[200px] mt-2"
            >
              View projects
            </motion.a>
          </div>
        </div>

        {/* Right: Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block relative"
        >
          {/* Offset block, so the single portrait reads as framed rather than stranded */}
          <div
            aria-hidden="true"
            className="absolute -top-6 -right-6 w-[70%] h-[70%] border-[6px] border-[var(--color-primary)]/15 rounded-sm"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 w-[38%] h-[3px] bg-[var(--color-primary)]"
          />
          <img
            src="/1.png"
            alt="Adithya Hebbalae"
            className="relative w-full h-auto object-cover rounded-sm shadow-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
