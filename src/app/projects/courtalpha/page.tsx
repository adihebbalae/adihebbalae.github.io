import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import project from '@/data/projects/courtalpha';

export const metadata: Metadata = {
  title: `${project.title} — Adithya Hebbalae`,
  description: project.tagline.recruiter,
};

export default function CourtAlphaPage() {
  return <ProjectPage project={project} />;
}
