import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { POEMS } from '../../data/poems.js';

function PoemTitle({ poem, index }) {
  const [lead, ...rest] = poem.title.split(' ');
  if (rest.length > 0) {
    return (
      <>
        <span
          className={`block font-display italic leading-[0.86] text-text ${
            index ? 'text-[clamp(3.2rem,8vw,5rem)]' : 'text-[clamp(3.6rem,9vw,5.6rem)]'
          }`}
        >
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

export default function WritingPage({ onBack, onOpen }) {
  return (
    <div className="relative">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-4xl px-6 pb-24 pt-32 md:pt-40">
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back home
        </a>

        <p className="mt-10 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Writing
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] text-text">
          Notes on <em className="italic text-accent">seeing.</em>
        </h1>
        <p className="mt-6 max-w-xl font-display text-xl leading-relaxed text-text md:text-2xl">
          Occasional poems on love, memory, and the space between. No schedule.
          Only when something is worth saying.
        </p>

        <section aria-label="Poems" className="mt-16 border-t border-border">
          <div className="flex items-center gap-3 pt-12">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-accent">
              Poems
            </p>
          </div>

          {POEMS.map((poem) => (
            <a
              key={poem.slug}
              href={`#/writing/${poem.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen(poem.slug);
              }}
              className="group grid gap-8 border-b border-border py-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16"
            >
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  {poem.language ? `${poem.language} · ${poem.date}` : poem.date}
                </p>
                <h2 className="mt-5">
                  <PoemTitle poem={poem} index />
                </h2>
              </div>

              <div className="flex flex-col justify-between gap-8">
                <p
                  lang={poem.lang}
                  className="max-w-xl font-display text-lg leading-[1.9] text-text/80 md:text-xl"
                >
                  {poem.stanzas[0].slice(0, 2).map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent">
                  Read poem
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </section>

        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          More notes when they are ready.
        </p>
      </div>
    </div>
  );
}
