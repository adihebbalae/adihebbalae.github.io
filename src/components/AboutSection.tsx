import SectionHeading from './SectionHeading';

/**
 * A character sheet, after andiqu.com, which Adi named as the inspiration.
 * Every value is a corpus fact (Corpus/profile/identity.md and the activity
 * records in Corpus/experiences/). Jokes in his voice are his to write: add a
 * Dislikes or Weaknesses row only with words he supplied, never invented ones.
 *
 * High school is one row on purpose (decision 2026-09-28): activities named,
 * no dates, no pages.
 */
const SHEET: { key: string; value: string }[] = [
  { key: 'Name', value: 'Adithya Hebbalae (Adi is fine)' },
  { key: 'Spawn point', value: 'Saratoga, California' },
  { key: 'Home base', value: 'Austin, Texas' },
  { key: 'Class', value: 'Electrical and computer engineer (UT Austin, 2029)' },
  { key: 'Main quest', value: 'An internship for summer 2027' },
  { key: 'Side quests', value: 'Research in the SWARM Lab, co-founding the Texas Poker Club' },
  { key: 'First program', value: 'A Scratch game, at age 8' },
  {
    key: 'Previous save file',
    value:
      'High school: cross-country and track captain, assistant principal second violin, dance team co-captain and choreographer, geography club co-founder, middle school track coach',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="px-5 sm:px-8 md:px-12 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_340px] gap-10 md:gap-16 items-start">
        <div>
          <SectionHeading title="About me" />

          <p className="max-w-[60ch] text-[17px] md:text-[18px] leading-[1.7]">
            The way I learn has not changed much since that Scratch game: pick something I do not
            understand, build with it, and find out where it breaks. These days that is mostly
            computer architecture, embedded systems, and vision-language models.
          </p>

          <dl className="mt-8 max-w-[62ch] space-y-3 text-[16px] md:text-[17px]">
            {SHEET.map(({ key, value }) => (
              <div key={key} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5">
                <span aria-hidden="true" className="text-[var(--color-primary)] font-semibold select-none">
                  &gt;
                </span>
                <div>
                  <dt
                    className="inline font-semibold"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
                  >
                    {key}:
                  </dt>{' '}
                  <dd className="inline text-[var(--color-tertiary)]/80">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
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
