import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import sentimentDemo from '@/data/projects/sentiment-demo';

export const metadata: Metadata = {
  title: `${sentimentDemo.title} — Adithya Hebbalae`,
  description: sentimentDemo.tagline.recruiter,
};

export default function SentimentDemoOverview() {
  return <ProjectPage project={sentimentDemo} />;
}
