import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import nameThatSong from '@/data/projects/name-that-song';

export const metadata: Metadata = {
  title: `${nameThatSong.title} — Adithya Hebbalae`,
  description: nameThatSong.tagline.recruiter,
};

export default function NameThatSongOverview() {
  return <ProjectPage project={nameThatSong} />;
}
