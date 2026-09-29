/**
 * Section titles sit on a tilted highlighter plate, the same move as the
 * "Hi, I'm Adi" plate in the hero, so the whole page shares one gesture.
 * The plate is a sibling of the text, not its background, so the rotation
 * tilts the plate without tilting the letters.
 */
export default function SectionHeading({
  title,
  note,
  dark,
}: {
  title: string;
  note?: string;
  /** On a dark or maroon background: a paler plate, white text. */
  dark?: boolean;
}) {
  return (
    <div className="mb-10 md:mb-12">
      <h2 className="relative inline-block px-3 -mx-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-tight">
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-[18%] bottom-[4%] -rotate-[1.5deg] ${
            dark ? 'bg-white/20' : 'bg-[var(--color-primary)]/18'
          }`}
        />
        <span className={`relative ${dark ? 'text-white' : ''}`}>{title}</span>
      </h2>
      {note && (
        <p className={`mt-4 max-w-[60ch] text-[17px] ${dark ? 'text-white/80' : 'text-[var(--color-tertiary)]/70'}`}>
          {note}
        </p>
      )}
    </div>
  );
}
