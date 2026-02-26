export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-[3px] rounded-full animate-spin"
          style={{
            borderColor: 'var(--color-primary)',
            borderTopColor: 'transparent',
          }}
        />
        <p
          className="text-xs uppercase tracking-widest font-medium"
          style={{
            fontFamily: 'var(--font-primary)',
            color: 'var(--color-secondary)',
          }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
