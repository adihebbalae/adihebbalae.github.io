import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import project from '@/data/projects/claude-usage-widget';

export const metadata: Metadata = {
  title: `${project.title} — Adithya Hebbalae`,
  description: project.tagline.recruiter,
};

export default function ClaudeUsageWidgetPage() {
  return <ProjectPage project={project} />;
}
