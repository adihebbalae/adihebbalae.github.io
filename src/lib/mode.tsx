'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Mode = 'recruiter' | 'builder';

const STORAGE_KEY = 'site-mode';

/**
 * Runs before first paint so the page never renders in the wrong mode and
 * then snaps. Kept as a string because it is injected via
 * dangerouslySetInnerHTML in the root layout.
 */
export const modeBootstrapScript = `
(function() {
  try {
    var m = localStorage.getItem('${STORAGE_KEY}');
    if (m !== 'recruiter' && m !== 'builder') m = 'recruiter';
    document.documentElement.dataset.mode = m;
  } catch (e) {
    document.documentElement.dataset.mode = 'recruiter';
  }
})();
`;

interface ModeContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
  /** False until the client has read localStorage. */
  ready: boolean;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('recruiter');
  const [ready, setReady] = useState(false);

  // The bootstrap script already put the real value on <html>. Read it back
  // rather than localStorage so the two can never disagree.
  useEffect(() => {
    const attr = document.documentElement.dataset.mode;
    if (attr === 'builder' || attr === 'recruiter') setModeState(attr);
    setReady(true);
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    document.documentElement.dataset.mode = m;
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // Private browsing with storage denied. The mode still applies for
      // this page view, it just will not survive a reload.
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'recruiter' ? 'builder' : 'recruiter');
  }, [mode, setMode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle, ready }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside a ModeProvider');
  return ctx;
}

/**
 * Picks between two mode-specific values. Most components only differ in copy,
 * so this keeps them from growing a conditional per field.
 */
export function byMode<T>(mode: Mode, values: { recruiter: T; builder: T }): T {
  return values[mode];
}
