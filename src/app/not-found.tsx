import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="text-center">
        <h1
          className="text-[8rem] md:text-[12rem] font-bold leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-primary)',
            textShadow: '0 4px 24px rgba(136, 8, 8, 0.2)',
          }}
        >
          404
        </h1>

        <p
          className="text-xl md:text-2xl uppercase tracking-widest font-medium mb-2"
          style={{
            fontFamily: 'var(--font-primary)',
            color: 'var(--color-tertiary)',
          }}
        >
          Page not found
        </p>

        <p
          className="text-sm mb-10 max-w-md mx-auto"
          style={{ color: 'var(--color-secondary)' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center text-sm uppercase tracking-widest font-medium
                     text-white bg-[var(--color-primary)] border border-[var(--color-primary)]
                     px-8 py-3 rounded-sm transition-all duration-200
                     hover:bg-transparent hover:text-[var(--color-primary)]"
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
