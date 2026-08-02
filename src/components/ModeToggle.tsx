'use client';

import { useMode, type Mode } from '@/lib/mode';

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'builder', label: 'Builder' },
];

const GROUP_LABEL =
  'Content mode. Recruiter shows outcomes, dates and numbers. Builder shows why each thing was built and what went wrong.';

/**
 * Two-state switch for the site's reading mode. Rendered as a pair of buttons
 * so it is operable with Tab and Enter without any key handling of our own,
 * and so a screen reader announces both states by name.
 */
export default function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, setMode, ready } = useMode();

  return (
    <div
      role="group"
      aria-label={GROUP_LABEL}
      className={`relative inline-flex items-center p-[3px] rounded-full
                  border border-[var(--color-tertiary)]/20
                  bg-[var(--color-background)] shadow-sm ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[3px] bottom-[3px] left-[3px] w-[86px] rounded-full
                    bg-[var(--color-primary)]
                    ${ready ? 'transition-transform duration-200 ease-out' : ''}
                    ${mode === 'builder' ? 'translate-x-full' : 'translate-x-0'}`}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setMode(option.value)}
          aria-pressed={mode === option.value}
          className={`relative z-10 w-[86px] py-1.5 rounded-full cursor-pointer
                      text-[11px] uppercase tracking-widest font-medium
                      transition-colors duration-200
                      ${
                        mode === option.value
                          ? 'text-white'
                          : 'text-[var(--color-tertiary)]/70 hover:text-[var(--color-primary)]'
                      }`}
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
