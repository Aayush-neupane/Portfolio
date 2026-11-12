import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const LETTERS = [
  {
    slug: 'glorious-purpose',
    title: 'Glorious Purpose',
    date: 'October 2026',
    source: 'https://www.instagram.com/aayushh.np/reel/DfEAETKIGo_/',
    stanzas: [
      [
        "Perhaps we’re never meant to stay,",
        'And perhaps some debts cannot be repaid.',
        'And if the truth must die with me,',
        "I’ll let it rest where no one can see.",
      ],
      [
        'I ask not to be forgiven,',
        'nor do I seek a promised heaven.',
        'For some sins are born of love, it seems,',
        'and some sacrifices bury the dreams.',
      ],
      [
        'And if silence costs me all,',
        'if truth is all I lose,',
        'then let this be my last confession',
        '“You’re still the one I’d choose.”',
      ],
      [
        'For we are, at the end,',
        'all just stories left unread,',
        'Some written down in ink,',
        'While some in tears never shed.',
      ],
      [
        'Cuz when all is forgotten,',
        "when we’re nothing but dust.",
      ],
      ['“For you,', 'For all of us.”'],
      ['Who loved.', 'Who lost.', 'Who lived.', 'Who must.'],
    ],
  },
];

export default function WritingPage({ onBack }) {
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
          Occasional pieces on craft, place, and the space between. No schedule.
          Only when something is worth saying.
        </p>

        <section aria-label="Letters" className="mt-16 border-t border-border pt-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-accent">
              Letters
            </p>
          </div>

          {LETTERS.map((letter) => {
            const [lead, ...rest] = letter.title.split(' ');
            const coda = letter.stanzas[letter.stanzas.length - 1];
            return (
              <article
                key={letter.slug}
                id={letter.slug}
                className="mt-8 grid scroll-mt-28 gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16"
              >
                <header className="md:sticky md:top-28 md:self-start">
                  <h2>
                    <span className="block font-display text-[clamp(3.2rem,8vw,5rem)] italic leading-[0.86] text-text">
                      {lead}
                    </span>
                    <span className="mt-4 block font-sans text-[clamp(0.95rem,1.8vw,1.15rem)] font-semibold uppercase tracking-[0.42em] text-accent">
                      {rest.join(' ')}
                    </span>
                  </h2>

                  <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                    {letter.date}
                  </p>
                  <a
                    href={letter.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                  >
                    Original on Instagram
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                </header>

                <div>
                  <div className="max-w-lg space-y-7 font-display text-[1.15rem] leading-[1.9] text-text/90 md:text-[1.3rem]">
                    {letter.stanzas.slice(0, -1).map((stanza, i) => (
                      <p key={i}>
                        {stanza.map((line, j) => {
                          const quoted = line.startsWith('“') || line.endsWith('”');
                          return (
                            <span
                              key={j}
                              className={
                                quoted
                                  ? 'block border-l border-accent/40 pl-4 font-sans text-[0.92em] italic leading-[1.8] text-accent'
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

                  <div className="mt-10 h-px w-12 bg-accent/40" aria-hidden="true" />
                  <p className="mt-6 font-mono text-[0.7rem] uppercase leading-[2] tracking-[0.22em] text-text md:text-[0.75rem]">
                    {coda.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          More notes when they are ready.
        </p>
      </div>
    </div>
  );
}
