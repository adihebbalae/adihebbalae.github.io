import type { CodeExcerpt, MediaImage, Video } from '@/data/types';

/** Responsive 16:9 privacy-friendly video embed. Static markup, no client JS. */
export function ProjectVideo({ video }: { video: Video }) {
  return (
    <figure className="mt-12">
      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={video.embedUrl}
          title={video.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {video.caption && (
        <figcaption className="mt-3 text-[14px] text-[var(--color-tertiary)]/65 leading-snug">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ProjectImages({ images }: { images: MediaImage[] }) {
  return (
    <div className="mt-12 grid gap-8">
      {images.map((m) => (
        <figure key={m.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt={m.alt}
            width={m.width}
            height={m.height}
            loading="lazy"
            className="w-full h-auto border border-[var(--color-tertiary)]/10"
            style={m.pixelated ? { imageRendering: 'pixelated', maxWidth: m.width } : undefined}
          />
          <figcaption className="mt-3 text-[14px] text-[var(--color-tertiary)]/65 leading-snug">
            {m.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const KEYWORDS = new Set([
  'void', 'if', 'while', 'return', 'static', 'extern', 'const', 'else', 'uint8_t', 'int8_t',
  'uint32_t', 'int', 'unsigned',
]);

type Tok = { text: string; kind: 'comment' | 'string' | 'number' | 'keyword' | 'plain' };

/** Minimal C/C++ tokenizer: enough for short excerpts, no dependency. */
function tokenize(src: string): Tok[] {
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(\b0x[0-9A-Fa-f]+\b|\b\d+U?\b)|(\b[A-Za-z_]\w*\b)|([\s\S])/g;
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[1]) out.push({ text: m[1], kind: 'comment' });
    else if (m[2]) out.push({ text: m[2], kind: 'string' });
    else if (m[3]) out.push({ text: m[3], kind: 'number' });
    else if (m[4]) out.push({ text: m[4], kind: KEYWORDS.has(m[4]) ? 'keyword' : 'plain' });
    else out.push({ text: m[5], kind: 'plain' });
  }
  return out;
}

const COLORS: Record<Tok['kind'], string | undefined> = {
  comment: '#7f8c8d',
  string: '#e6b673',
  number: '#d98c8c',
  keyword: '#7fb3d5',
  plain: undefined,
};

export function CodeBlocks({ blocks }: { blocks: CodeExcerpt[] }) {
  return (
    <div className="mt-12 grid gap-8">
      {blocks.map((b) => (
        <figure key={b.caption}>
          <pre
            className="overflow-x-auto p-4 text-[13px] leading-[1.55] rounded-sm"
            style={{ background: '#1c1f22', color: '#d6d9db' }}
            aria-label={b.caption}
          >
            <code className={`language-${b.language}`}>
              {tokenize(b.code).map((t, i) => (
                <span key={i} style={{ color: COLORS[t.kind] }}>
                  {t.text}
                </span>
              ))}
            </code>
          </pre>
          <figcaption className="mt-3 text-[14px] text-[var(--color-tertiary)]/65 leading-snug">
            {b.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
