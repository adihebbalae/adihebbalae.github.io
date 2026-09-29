'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Links are written as /#section so they work from a project page too. On the
 * home page the browser treats them as same-page anchors and
 * scroll-padding-top in globals.css keeps the heading clear of this bar.
 */
const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#research', label: 'Research' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!onHome);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileOpen]);

  const solid = isScrolled || isMobileOpen;
  const ink = solid ? 'text-[var(--color-tertiary)]' : 'text-white';

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        solid
          ? 'bg-[var(--color-background)]/95 backdrop-blur border-b border-[var(--color-rule)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 sm:px-8 md:px-12 h-16">
        <Link href="/" className="relative z-50" onClick={() => setIsMobileOpen(false)}>
          <img
            src="/favicon.png"
            alt="Adi Hebbalae, home"
            className={`h-10 w-10 object-contain transition-[filter] duration-300 ${
              solid ? '' : 'brightness-0 invert'
            }`}
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
                  solid ? '' : 'hover:text-white/70'
                } ${ink}`}
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden relative z-50 w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-[2px] w-6 transition-all duration-300 ${
                solid ? 'bg-[var(--color-tertiary)]' : 'bg-white'
              } ${
                isMobileOpen
                  ? i === 0
                    ? 'rotate-45 translate-y-[8px]'
                    : i === 1
                      ? 'opacity-0'
                      : '-rotate-45 -translate-y-[8px]'
                  : ''
              }`}
            />
          ))}
        </button>
      </div>

      {isMobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 bg-[var(--color-background)] px-5 sm:px-8 pt-8"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-[var(--color-rule)]">
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-4 text-3xl font-semibold text-[var(--color-tertiary)] hover:text-[var(--color-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
