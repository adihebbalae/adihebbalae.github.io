import SectionHeading from './SectionHeading';

/**
 * Plain, friendly prose. Every fact is from the corpus (Corpus/profile/identity.md
 * and the activity records in Corpus/experiences/).
 *
 * High school is one sentence on purpose (decision 2026-09-28): activities
 * named, no dates, no pages. A character-sheet version was tried the same day
 * and rolled back: too close to the site that inspired it, and Adi does not
 * want a video game aesthetic.
 */
const BODY = [
  'I grew up in Saratoga, California, and now study electrical and computer engineering at UT Austin, mostly computer architecture and embedded systems.',
  'I started coding at 8, making a game in Scratch. The way I learn has not changed much since: pick something I do not understand, build with it, and find out where it breaks.',
  'Most of my week goes to the SWARM Lab, working on whether vision-language models can reason across cameras. The rest goes to the projects below and to the Texas Poker Club, which I co-founded.',
];

const HIGH_SCHOOL =
  'In high school I captained cross-country and track, played second violin in the orchestra, co-captained and choreographed for the dance team, co-founded the geography club, and coached middle school track.';

export default function AboutSection() {
  return (
    <section id="about" className="px-5 sm:px-8 md:px-12 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_340px] gap-10 md:gap-16 items-start">
        <div>
          <SectionHeading title="About me" />
          <div className="max-w-[62ch] space-y-5 text-[17px] md:text-[18px] leading-[1.7]">
            {BODY.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            <p className="text-[16px] text-[var(--color-tertiary)]/70">{HIGH_SCHOOL}</p>
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
