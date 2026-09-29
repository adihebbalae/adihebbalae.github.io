import SectionHeading from './SectionHeading';

const BODY = [
  'I started coding at 8, making a game in Scratch. The way I learn has not changed much since: pick something I do not understand, build with it, and find out where it breaks.',
  'I study electrical and computer engineering at UT Austin, mostly computer architecture and embedded systems, and most of my week goes to a research lab working on how vision-language models reason across cameras.',
  'The projects below are the rest of it. A few are live and used by other students. The rest were the fastest way for me to understand something.',
];

export default function AboutSection() {
  return (
    <section id="about" className="px-5 sm:px-8 md:px-12 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_340px] gap-10 md:gap-16 items-start">
        <div>
          <SectionHeading title="About" />
          <div className="max-w-[62ch] space-y-5 text-[17px] md:text-[18px] leading-[1.7]">
            {BODY.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>

        <figure className="relative max-w-[240px] md:max-w-none md:mt-16">
          <span
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[var(--color-primary)]/40 rounded-sm"
          />
          <img
            src="/portrait.jpg"
            alt="Adi Hebbalae at his high school graduation, holding a UT Austin sign"
            width={900}
            height={1200}
            loading="lazy"
            className="relative w-full h-auto rounded-sm"
          />
        </figure>
      </div>
    </section>
  );
}
