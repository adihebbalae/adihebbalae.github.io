import type { Metadata } from 'next';
import ProjectPage from '@/components/ProjectPage';
import pokerLedger from '@/data/projects/poker-ledger';

export const metadata: Metadata = {
  title: `${pokerLedger.title} — Adithya Hebbalae`,
  description: pokerLedger.tagline.recruiter,
};

export default function PokerLedgerOverview() {
  return <ProjectPage project={pokerLedger} />;
}
