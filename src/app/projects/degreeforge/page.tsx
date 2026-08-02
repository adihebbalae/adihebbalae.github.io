'use client';

// No `export const metadata` here: Next.js forbids it in a client component,
// and ProjectPage reads the recruiter/builder mode from client context.

import ProjectPage from '@/components/ProjectPage';
import degreeforge from '@/data/projects/degreeforge';

export default function DegreeForgePage() {
  return <ProjectPage project={degreeforge} />;
}
