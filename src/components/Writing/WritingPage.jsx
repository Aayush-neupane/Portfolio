import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const LETTERS = [
  {
    slug: 'glorious-purpose',
    title: 'Glorious Purpose',
    date: 'October 2026',
    source: 'https://www.instagram.com/aayushh.np/reel/DfEAETKIGo_/',
    stanzas: [
      [
        "Perhaps we're never meant to stay,",
        'And perhaps some debts cannot be repaid.',
        'And if the truth must die with me,',
        "I'll let it rest where no one can see.",
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
        '“You\'re still the one I\'d choose.”',
      ],
      [
        'For we are, at the end,',
        'all just stories left unread,',
        'Some written down in ink,',
        'While some in tears never shed.',
      ],
      [
        'Cuz when all is forgotten,',
        "when we're nothing but dust.",
      ],
      ['“For you,', 'For all of us.”'],
      ['Who loved.', 'Who lost.', 'Who lived.', 'Who must.'],
    ],
  },
];

const FRAGMENTS = [
  'Darshan is attention. Pradarshan is audience.',
  'Make the thing worth looking at before you ask anyone to look.',
  'The opposite of showing off is not hiding. It is paying attention.',
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
          {LETTERS.map((letter) => (
            <article
              key={letter.slug}
              id={letter.slug}
              className="grid scroll-mt-28 gap-10 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-12"
            >
              <header>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-accent">
                  Letters
                </p>
                <h2 className="mt-5 font-display text-[clamp(2.1rem,4vw,2.8rem)] leading-[1.05] text-text">
                  {letter.title.split(' ').map((word, i, words) => (
                    <span
                      key={word}
                      className={i === words.length - 1 ? 'block italic text-accent' : 'block'}
                    >
                      {word}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  {letter.date}
                </p>
                <a
                  href={letter.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                >
                  Original
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </header>
              <div>
                <div className="max-w-lg space-y-8 font-display text-[1.15rem] leading-[1.9] text-text/90 md:text-[1.25rem]">
                  {letter.stanzas.map((stanza, i) => {
                    const closing = i === letter.stanzas.length - 1;
                    return (
                      <p key={i} className={closing ? 'italic text-text' : undefined}>
                        {stanza.map((line, j) => {
                          const quoted = line.startsWith('“') || line.endsWith('”');
                          return (
                            <span
                              key={j}
                              className={
                                quoted
                                  ? 'block border-l border-accent/40 pl-4 italic text-accent'
                                  : 'block'
                              }
                            >
                              {line}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section aria-label="Fragments" className="mt-16 border-t border-border pt-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            Fragments
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {FRAGMENTS.map((fragment) => (
              <li
                key={fragment}
                className="rounded-xl border border-border bg-elevated p-5 font-display text-lg leading-snug text-text"
              >
                {fragment}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          More notes when they are ready.
        </p>
      </div>
    </div>
  );
}
