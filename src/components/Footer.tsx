'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  { href: 'mailto:adihebbalae07@gmail.com', label: 'Email', icon: Mail },
  { href: 'https://github.com/adihebbalae', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/adi-hebbalae-931165332/', label: 'LinkedIn', icon: Linkedin },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[var(--color-primary)] text-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold uppercase mb-3 text-white"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            Adithya Hebbalae
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-8 max-w-md mx-auto">
            Building, learning, and exploring, one project at a time.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-10">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="w-10 h-10 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-secondary)]
                           flex items-center justify-center transition-all duration-200
                           hover:bg-white hover:text-[var(--color-secondary)] group"
                aria-label={link.label}
              >
                <link.icon size={16} className="text-white group-hover:text-[var(--color-secondary)]" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/50 text-xs">
              &copy; {year} Adi Hebbalae. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
