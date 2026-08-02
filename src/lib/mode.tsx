'use client';

/**
 * The site used to ship two voices behind a toggle — a recruiter view that read
 * like a resume, and a builder view. The toggle is gone: a portfolio that
 * rearranges itself into a resume reads as a resume, which is the one thing
 * worth avoiding. There is one voice now, and it is the builder one.
 *
 * `Mode` and the two-key copy objects survive because every project record is
 * authored against them and the recruiter strings are worth keeping as raw
 * material. Nothing reads them: `useMode` always answers 'builder', and
 * `byMode` always picks the builder branch.
 */
export type Mode = 'recruiter' | 'builder';

export function useMode(): { mode: Mode } {
  return { mode: 'builder' };
}

export function byMode<T>(_mode: Mode, values: { recruiter: T; builder: T }): T {
  return values.builder;
}
