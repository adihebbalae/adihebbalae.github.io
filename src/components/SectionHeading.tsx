/**
 * Every section opens the same way: a short maroon rule, then the title. The
 * rule is the only ornament, so the sections read as one document.
 */
export default function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-10 md:mb-12">
      <span aria-hidden="true" className="block w-12 h-[5px] bg-[var(--color-primary)] mb-5" />
      <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-none">{title}</h2>
      {note && (
        <p className="mt-4 max-w-[60ch] text-[17px] text-[var(--color-tertiary)]/70">{note}</p>
      )}
    </div>
  );
}
