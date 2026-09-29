import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT } from '@/data/site';

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
        <h2 className="text-white text-[clamp(2.25rem,5vw,3.5rem)] leading-none">Get in touch</h2>
        <p className="mt-4 max-w-[48ch] text-[17px] text-white/80">
          Email is the fastest way to reach me. I am looking for internships for summer 2027.
        </p>

        <ul className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
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
