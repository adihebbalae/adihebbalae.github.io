import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import project from '@/data/projects/d-organizer';

export const metadata: Metadata = {
  title: `${project.title} — Adithya Hebbalae`,
  description: project.tagline.recruiter,
};

export default function DOrganizerPage() {
  return <ProjectPage project={project} />;
}
