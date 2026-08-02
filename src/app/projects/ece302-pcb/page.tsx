import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import ece302Pcb from '@/data/projects/ece302-pcb';

export const metadata: Metadata = {
  title: 'PCB design in KiCad — op-amp gain stage and synchronous buck converter',
  description: ece302Pcb.tagline.recruiter,
  openGraph: {
    title: 'PCB design in KiCad — op-amp gain stage and synchronous buck converter',
    description: ece302Pcb.tagline.recruiter,
  },
};

export default function Ece302PcbPage() {
  return <ProjectPage project={ece302Pcb} />;
}
