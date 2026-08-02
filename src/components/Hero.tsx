'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/lib/mode';

const SUBTEXT = {
  recruiter:
    'Electrical and computer engineering at UT Austin. Video understanding research in the SWARM Lab.',
  builder: 'I build things to find out how they work, then write down what broke.',
};

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { mode } = useMode();

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="relative h-screen overflow-hidden bg-[#040913]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/header.png"
          alt="Portfolio hero background featuring Adithya Hebbalae"
          className={`w-full h-full object-cover transition-all duration-[2000ms] ease-[cubic-bezier(.25,1,.30,1)] ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setLoaded(true)}
          fetchPriority="high"
        />
        {/* Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 73%, rgba(0,0,0,0.6) 100%)',
            backdropFilter: 'blur(6px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className="relative inline-block px-6 py-4 md:px-10 md:py-5 -rotate-2" style={{ background: 'var(--color-primary)' }}>
            {/* Shadow layer */}
            <span
              className="absolute -top-1 -left-1 -right-1 -bottom-1 rotate-2 -z-10"
              style={{ background: 'rgba(255, 0, 0, 0.4)' }}
            />
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white m-0"
              style={{
                fontFamily: 'var(--font-display)',
                textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.6)',
              }}
            >
              Hi, I&apos;m Adi
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
          className="mt-6 mx-auto max-w-[42rem] px-6 text-lg md:text-xl text-white font-light tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {SUBTEXT[mode]}
        </motion.p>
      </div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={scrollToAbout}
          aria-label="Scroll down to the About me section"
          className="pointer-events-auto px-6 py-3 text-sm uppercase tracking-widest font-medium
                     text-white bg-[var(--color-primary)] border border-[var(--color-primary)]
                     rounded-sm cursor-pointer transition-all duration-200
                     hover:bg-transparent hover:text-white hover:border-white
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          About me
        </button>
      </motion.div>
    </header>
  );
}
