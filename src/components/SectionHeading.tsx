/**
 * Every section opens the same way: a short maroon rule, then the title. The
 * rule is the only ornament, so the sections read as one document and the
 * tilted plate stays special to the hero.
 */
export default function SectionHeading({
  title,
  note,
  dark,
}: {
  title: string;
  note?: string;
  /** On a dark or maroon background: white rule and text. */
  dark?: boolean;
}) {
  return (
    <div className="mb-10 md:mb-12">
      <span
        aria-hidden="true"
        className={`block w-12 h-[5px] mb-5 ${dark ? 'bg-white/70' : 'bg-[var(--color-primary)]'}`}
      />
      <h2 className={`text-[clamp(2.25rem,5vw,3.5rem)] leading-none ${dark ? 'text-white' : ''}`}>{title}</h2>
      {note && (
        <p className={`mt-4 max-w-[60ch] text-[17px] ${dark ? 'text-white/80' : 'text-[var(--color-tertiary)]/70'}`}>
          {note}
        </p>
      )}
    </div>
  );
}
