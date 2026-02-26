'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_55%] gap-12 lg:gap-20 items-start">
        {/* Left: Text Content */}
        <div className="relative">
          {/* Red accent bar */}
          <div className="absolute top-0 left-0 w-[15px] lg:w-[3.4vw] h-[62px] lg:h-[115px] bg-[var(--color-primary)]" />

          <div className="pl-8 lg:pl-0">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45 }}
              className="block text-4xl lg:text-5xl font-bold uppercase leading-tight text-[var(--color-tertiary)]"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              About Me
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="block text-sm lg:text-lg uppercase tracking-[5px] text-[var(--color-tertiary)] mt-1 mb-6"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              Lifetime Learner
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              <p className="text-[15px] leading-relaxed mb-6 text-[var(--color-tertiary)]">
                I first discovered my love for coding at 8, through Scratch, building my very first game. 
                From there I explored animations and the fundamentals of programming through JavaScript and Python and have been constantly learning. Since then, I&apos;ve developed machine learning models to recommend music, predict social media trends, and even reconstruct MRI images. 
                I&apos;ve also started exploring web development, creating interactive websites and applications. I&apos;m currently pursuing a BS in Electrical and Computer Engineering at UT Austin.
              </p>
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
                         hover:bg-[var(--color-primary)] hover:text-white min-w-[200px]"
            >
              View Projects
            </motion.a>
          </div>
        </div>

        {/* Right: Image Panorama */}
        <div className="hidden lg:grid grid-cols-3 gap-7">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/1.png"
              alt="Adithya Hebbalae portrait"
              className="w-full h-auto object-cover rounded-sm"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-[32%]"
          >
            <div className="w-full aspect-[240/475] bg-[var(--color-secondary)]/20 rounded-sm" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-[64%]"
          >
            <div className="w-full aspect-[240/475] bg-[var(--color-primary)]/10 rounded-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
