import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const LETTERS = [
  {
    slug: 'glorious-purpose',
    title: 'Glorious Purpose',
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
        'then let this be my last confess—',
        '"You\'re still the one I\'d choose."',
      ],
      [
        'For we are, at the end,',
        'all just stories left unread,',
        'Some written down in ink,',
        'While some in tears never shed.',
      ],
      [
        "Cuz when all is forgotten,",
        "when we're nothing but dust.",
      ],
      ['"For you,', 'For all of us."'],
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
          Occasional pieces on craft, place, and the space between. No schedule
          — only when something is worth saying.
        </p>

        <section aria-label="Letters" className="mt-16">
          {LETTERS.map((letter) => {
            const [lead, ...rest] = letter.title.split(' ');
            return (
              <article
                key={letter.slug}
                id={letter.slug}
                className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-elevated"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/10 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative px-6 py-14 text-center md:px-14 md:py-20">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-accent">
                    Letters
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(2.5rem,7vw,3.9rem)] leading-[1.02] text-text">
                    {lead}{' '}
                    <em className="italic text-accent">{rest.join(' ')}</em>
                  </h2>
                  <div
                    className="mx-auto mt-8 flex w-24 items-center gap-2 text-accent/50"
                    aria-hidden="true"
                  >
                    <span className="h-px flex-1 bg-current" />
                    <span className="h-1 w-1 rotate-45 bg-current" />
                    <span className="h-px flex-1 bg-current" />
                  </div>
                  <div className="mx-auto mt-10 max-w-md space-y-8 font-display text-[1.15rem] leading-[1.85] text-text/90 md:text-[1.3rem]">
                    {letter.stanzas.map((stanza, i) => {
                      const closing = i === letter.stanzas.length - 1;
                      return (
                        <p key={i} className={closing ? 'italic text-accent' : undefined}>
                          {stanza.map((line, j) => (
                            <span key={j} className="block">
                              {line}
                            </span>
                          ))}
                        </p>
                      );
                    })}
                  </div>
                  <a
                    href={letter.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-12 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
                  >
                    Originally posted on Instagram
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
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
