import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import pentris from '@/data/projects/pentris';

export const metadata: Metadata = {
  title: 'Pentris — handheld game console on a bare-metal MSPM0',
  description: pentris.tagline.recruiter,
  openGraph: {
    title: 'Pentris — handheld game console on a bare-metal MSPM0',
    description: pentris.tagline.recruiter,
  },
};

export default function PentrisPage() {
  return <ProjectPage project={pentris} />;
}
