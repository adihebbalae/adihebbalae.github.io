'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#research', label: 'Research' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        const navbarHeight = 80;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-background)] shadow-md border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 md:px-16 lg:px-24 py-4">
        {/* Logo */}
        <Link href="/" className="z-50 relative">
          <img
            src="/favicon.png"
            alt="Adithya Hebbalae — Home"
            className={`h-10 md:h-12 object-contain transition-all duration-300 ${
              !isScrolled && !isMobileOpen ? 'brightness-0 invert' : ''
            }`}
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={`relative text-sm tracking-widest uppercase font-medium transition-colors duration-200
                  ${isScrolled ? 'text-[var(--color-tertiary)]' : 'text-[var(--color-background)]'}
                  hover:text-[var(--color-primary)]
                  after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:h-[2px] after:w-0 
                  after:-translate-x-1/2 after:transition-all after:duration-200
                  after:bg-current hover:after:w-full
                `}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden z-50 relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isMobileOpen}
        >
          <span
            className={`block h-[2px] w-6 transition-all duration-300 ${
              isMobileOpen
                ? 'rotate-45 translate-y-[5px] bg-[var(--color-tertiary)]'
                : isScrolled ? 'bg-[var(--color-tertiary)]' : 'bg-white'
            }`}
          />
          <span
            className={`block h-[2px] w-6 transition-all duration-300 ${
              isMobileOpen
                ? 'opacity-0'
                : isScrolled ? 'bg-[var(--color-tertiary)]' : 'bg-white'
            }`}
          />
          <span
            className={`block h-[2px] w-6 transition-all duration-300 ${
              isMobileOpen
                ? '-rotate-45 -translate-y-[5px] bg-[var(--color-tertiary)]'
                : isScrolled ? 'bg-[var(--color-tertiary)]' : 'bg-white'
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[var(--color-background)] z-40 flex flex-col items-start justify-center px-8"
          >
            <ul className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                      }
                      handleNavClick(link.href);
                    }}
                    className="text-2xl uppercase tracking-widest font-medium text-[var(--color-tertiary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
