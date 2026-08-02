import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import musicRecommender from '@/data/projects/music-recommender';

export const metadata: Metadata = {
  title: `${musicRecommender.title} — Adithya Hebbalae`,
  description: musicRecommender.tagline.recruiter,
};

export default function MusicRecommenderOverview() {
  return <ProjectPage project={musicRecommender} />;
}
