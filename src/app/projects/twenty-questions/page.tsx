import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import twentyQuestions from '@/data/projects/twenty-questions';

export const metadata: Metadata = {
  title: '20 Questions: a C game ported to the browser with WebAssembly',
  description: twentyQuestions.tagline.recruiter,
  openGraph: {
    title: '20 Questions: a C game ported to the browser with WebAssembly',
    description: twentyQuestions.tagline.recruiter,
  },
};

export default function TwentyQuestionsPage() {
  return <ProjectPage project={twentyQuestions} />;
}
