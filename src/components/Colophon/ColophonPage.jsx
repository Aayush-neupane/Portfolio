import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Stack',
    items: ['React 19 + Vite', 'Tailwind CSS', 'GSAP + Framer Motion', 'Lenis smooth scroll'],
  },
  {
    title: 'Type',
    items: [
      'Instrument Serif: display',
      'Plus Jakarta Sans: body',
      'Noto Serif Devanagari: Nepali verse',
      'JetBrains Mono: labels and code',
    ],
  },
  {
    title: 'Images',
    items: [
      'Shot on iPhone 11 Pro, edited in Snapseed',
      'AVIF + JPEG variants generated at build',
      'Self-hosted fonts, no third-party CDN',
    ],
  },
  {
    title: 'Hosting',
    items: ['Netlify', 'Private content encrypted at rest (AES-256)'],
  },
  {
    title: 'Privacy',
    items: [
      'No cookies, no fingerprinting',
      'Anonymous like counts via Abacus',
      'No third-party trackers',
    ],
  },
];

/** Colophon: what the site is made of, in one screen. */
export default function ColophonPage({ onBack, onContact }) {
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
        <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Colophon
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02] text-text">
          Made of small <em className="italic text-accent">deliberate</em> parts.
        </h1>
        <p className="mt-5 max-w-xl leading-[1.6] text-muted">
          The stack, type, and tools behind this site, and the choices that keep
          it fast, quiet, and free of trackers.
        </p>

        <dl className="mt-12 divide-y divide-border border-y border-border">
          {SECTIONS.map((section) => (
            <div key={section.title} className="grid gap-3 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {section.title}
              </dt>
              <dd>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-text">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-muted">
          Questions about how something was built?{' '}
          <button
            type="button"
            onClick={onContact}
            className="inline-flex items-center gap-1 font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-deep"
          >
            Ask me
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </p>
      </div>
    </div>
  );
}
