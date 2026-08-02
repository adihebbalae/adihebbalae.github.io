import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ResearchSection from '@/components/ResearchSection';
import ProjectsSection from '@/components/ProjectsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main className="relative">
        <AboutSection />
        <ResearchSection />
        <ProjectsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
