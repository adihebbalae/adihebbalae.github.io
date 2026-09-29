import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT } from '@/data/site';
import SectionHeading from './SectionHeading';

const socialLinks = [
  { href: `mailto:${CONTACT.email}`, label: CONTACT.email, icon: Mail },
  { href: CONTACT.github, label: 'GitHub', icon: Github },
  { href: CONTACT.linkedin, label: 'LinkedIn', icon: Linkedin },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[var(--color-primary)] text-white px-5 sm:px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto py-16 md:py-20">
        <SectionHeading
          dark
          title="Say hi"
          note="Email is the fastest way to reach me. I'm looking for an internship for summer 2027, and I'm always up for talking about any of the things on this page."
        />

        <ul className="-mt-2 flex flex-col sm:flex-row flex-wrap gap-3">
          {socialLinks.map((link) => {
            const external = !link.href.startsWith('mailto');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2.5 px-4 py-3 rounded-sm border border-white/35 text-[16px]
                             transition-colors hover:bg-white hover:text-[var(--color-primary)] break-all"
                >
                  <link.icon size={17} aria-hidden="true" />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-14 pt-5 border-t border-white/15 text-[14px] text-white/55">
          &copy; {year} Adi Hebbalae
        </p>
      </div>
    </footer>
  );
}
