import { scrollToTarget } from '../../utils/scroll.js';

// Buy Me a Coffee profile.
const SUPPORT_URL = 'https://buymeacoffee.com/aayush38';

/** Hand-drawn takeaway cup: domed lid, sleeve band, chunky strokes that
 *  stay legible at small sizes. Inherits text color so it adapts anywhere. */
function CoffeeCup({ className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 6.5V5a3 3 0 0 1 6 0v1.5" />
      <path d="M6 6.5h12v1.5H6z" />
      <path d="M7.2 9.5h9.6l-1 11H8.2l-1-11z" />
      <path d="M7.5 14h9" strokeWidth="3.2" />
    </svg>
  );
}

export default function Support() {
  return (
    <section id="support" aria-label="Support" className="relative scroll-mt-20 border-t border-border">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-10 rounded-2xl border border-border bg-elevated p-8 md:grid-cols-[auto_1fr_auto] md:gap-12 md:p-12">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent"
          >
            <CoffeeCup className="h-7 w-7" />
          </span>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Support
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text">
              Fuel the <em className="italic text-accent">work.</em>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              Everything here is free and open. If a project saved you an
              afternoon, a coffee keeps the next one coming — or just{' '}
              <button
                type="button"
                onClick={() => scrollToTarget('#contact')}
                className="font-semibold text-accent underline underline-offset-4 transition-colors hover:text-accent-deep"
              >
                say thanks directly
              </button>
              .
            </p>
          </div>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-deep md:justify-self-end"
          >
            <CoffeeCup className="h-4 w-4" />
            Buy me a coffee
          </a>
        </div>
      </div>
    </section>
  );
}
