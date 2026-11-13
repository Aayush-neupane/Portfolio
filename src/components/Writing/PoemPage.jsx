import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import LikeButton from '../Like/LikeButton.jsx';

function PoemTitle({ poem }) {
  const [lead, ...rest] = poem.title.split(' ');
  if (rest.length > 0) {
    return (
      <>
        <span className="block font-display text-[clamp(3.2rem,8vw,5rem)] italic leading-[0.86] text-text">
          {lead}
        </span>
        <span className="mt-4 block font-sans text-[clamp(0.95rem,1.8vw,1.15rem)] font-semibold uppercase tracking-[0.42em] text-accent">
          {rest.join(' ')}
        </span>
      </>
    );
  }
  return (
    <>
      <span
        lang={poem.lang}
        className="block font-display text-[clamp(3.6rem,9vw,5.6rem)] leading-[1.1] text-text"
      >
        {lead}
      </span>
      {poem.translit && (
        <span
          lang="en"
          className="mt-4 block font-sans text-[clamp(0.95rem,1.8vw,1.15rem)] font-semibold uppercase tracking-[0.42em] text-accent"
        >
          {poem.translit}
        </span>
      )}
    </>
  );
}

export default function PoemPage({ poem, prev, next, onBack, onOpen }) {
  const bodyStanzas = poem.coda ? poem.stanzas.slice(0, -1) : poem.stanzas;
  const coda = poem.coda ? poem.stanzas[poem.stanzas.length - 1] : null;
  const links = [
    prev ? { label: 'Previous poem', item: prev, align: 'left' } : null,
    next ? { label: 'Next poem', item: next, align: 'right' } : null,
  ].filter(Boolean);

  return (
    <div className="relative">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-4xl px-6 pb-24 pt-32 md:pt-40">
        <a
          href="#/writing"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All writing
        </a>

        <header className="mt-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Poem
          </p>
          <h1 className="mt-5">
            <PoemTitle poem={poem} />
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
              {poem.language ? `${poem.language} · ${poem.date}` : poem.date}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <LikeButton kind="poem" id={poem.slug} />
              {poem.source && (
                <a
                  href={poem.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                >
                  Original on Instagram
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </header>

        <article className="mt-12 border-t border-border pt-12">
          <div
            lang={poem.lang}
            className={
              poem.lang === 'ne'
                ? 'max-w-xl space-y-8 font-display text-[1.15rem] leading-[2.05] text-text md:text-[1.32rem]'
                : 'max-w-lg space-y-7 font-display text-[1.15rem] leading-[1.9] text-text/90 md:text-[1.3rem]'
            }
          >
            {bodyStanzas.map((stanza, i) => (
              <p key={i}>
                {stanza.map((line, j) => {
                  const quoted = line.startsWith('“') || line.endsWith('”');
                  const highlighted = /याद|yaad/i.test(line);
                  return (
                    <span
                      key={j}
                      className={
                        quoted
                          ? 'block border-l border-accent/40 pl-4 font-sans text-[0.92em] italic leading-[1.8] text-accent'
                          : highlighted
                            ? 'block rounded-md bg-accent-soft px-3 py-1 -mx-3 font-semibold leading-[1.9] text-accent'
                            : 'block'
                      }
                    >
                      {line}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>

          {coda && (
            <>
              <div className="mt-10 h-px w-12 bg-accent/40" aria-hidden="true" />
              <p className="mt-6 font-mono text-[0.7rem] uppercase leading-[2] tracking-[0.22em] text-text md:text-[0.75rem]">
                {coda.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </>
          )}
        </article>

        {links.length > 0 && (
          <nav
            aria-label="More poems"
            className={`mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border ${
              links.length > 1 ? 'sm:grid-cols-2' : ''
            }`}
          >
            {links.map(({ label, item, align }) => (
              <a
                key={label}
                href={`#/writing/${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen(item.slug);
                }}
                className={`group bg-elevated p-6 transition-colors hover:bg-subtle ${
                  align === 'right' ? 'text-right' : ''
                }`}
              >
                <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                  {align === 'left' && <ArrowLeft className="h-3 w-3" aria-hidden="true" />}
                  {label}
                  {align === 'right' && <ArrowRight className="h-3 w-3" aria-hidden="true" />}
                </span>
                <span className="mt-3 block font-display text-xl text-text transition-colors group-hover:text-accent">
                  {item.translit || item.title}
                </span>
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
