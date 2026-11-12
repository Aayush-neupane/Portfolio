import { ArrowLeft } from 'lucide-react';

const PIECES = [
  {
    slug: 'prem-darshan',
    kicker: 'On the line in my bio',
    date: '2026',
    title: 'Prem darshan ho, pradarshan haina',
    devanagari: 'प्रेम दर्शन हो, प्रदर्शन हैन',
    translation: 'Love is something you behold, not something you put on display.',
    body: [
      'I keep coming back to this line because it is easy to get backwards. We are taught to perform affection: post the flowers, announce the milestone, make the feeling legible to an audience. The gesture becomes content, and the content becomes the point.',
      'But darshan is quieter than that. It is the meeting that happens when attention is honest — the moment you look at something long enough to stop asking what it can do for you. Pradarshan is the opposite: the same thing arranged for spectators, polished until the looking is no longer necessary.',
      'The line is not really about public and private. It is about why a thing is made. A photograph can be a performance, or it can be a way of looking. A website can shout, or it can open a door. A life can be a feed, or it can be a series of small, unposted attentions.',
      'I am not always on the right side of that line. I make things for people to see; there is no pretending otherwise. But I want the seeing to come first. I want the work to be worth the look, not just good at asking for it.',
      'That is the bar, anyway. Everything else is noise.',
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

        <div className="mt-16 space-y-16">
          {PIECES.map((piece) => (
            <article
              key={piece.slug}
              id={piece.slug}
              className="scroll-mt-28 border-t border-border pt-10"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {piece.kicker} · {piece.date}
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-text">
                {piece.title}
              </h2>

              <p
                lang="ne"
                className="mt-8 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.35] text-accent"
              >
                {piece.devanagari}
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                {piece.translation}
              </p>

              <div className="mt-8 space-y-6 text-base leading-[1.85] text-muted md:text-lg">
                {piece.body.map((para, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.85] first-letter:text-accent'
                        : undefined
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

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
