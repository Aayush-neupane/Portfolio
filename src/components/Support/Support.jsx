import { scrollToTarget } from '../../utils/scroll.js';

// Buy Me a Coffee profile.
const SUPPORT_URL = 'https://buymeacoffee.com/aayush38';

/** Original illustrated coffee scene in the same spirit: cream cup with a
 *  heart, steam curls and a sparkle on a dashed orbit — drawn in
 *  currentColor so the linework follows the active accent, exactly like
 *  the site loader. */
function CoffeeScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 300 280"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="150" cy="140" r="112" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4 9" />
      <ellipse cx="142" cy="222" rx="85" ry="12" fill="currentColor" fillOpacity="0.08" />
      <path
        d="M100 115h100l-11 70q-5 25-39 25t-39-25l-11-70Z"
        fill="#f7f5ef"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M200 130h10q24 0 18 22-4 18-34 18"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="150" cy="115" rx="50" ry="10" fill="#a67550" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M138 88q-12-10 1-20t0-19M162 90q-12-10 1-20t0-19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M150 168c-18-20-30 5 0 19 30-14 18-39 0-19Z"
        fill="currentColor"
      />
      <path
        d="M60 200l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pocket version of the same cup for the button: body, handle, heart. */
function CoffeeCup({ className = 'h-4 w-4' }) {
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
      <path d="M5 10h13l-1.5 8.2a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8L6 10" />
      <path d="M18 11.5h.8a2.6 2.6 0 0 1 0 5.2H18" />
      <ellipse cx="11.5" cy="10" rx="5.5" ry="1.6" fill="#a67550" stroke="none" />
      <path d="M11.5 13.4c-1.7-1.8-2.8.5 0 1.8 2.8-1.3 1.7-3.6 0-1.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Support() {
  return (
    <section id="support" aria-label="Support" className="relative scroll-mt-20 border-t border-border">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-10 rounded-2xl border border-border bg-elevated p-8 md:grid-cols-[auto_1fr_auto] md:gap-12 md:p-12">
          <span aria-hidden="true" className="mx-auto w-40 text-accent sm:w-48 md:mx-0">
            <CoffeeScene className="h-auto w-full" />
          </span>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              One small cup · A big thank you
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text">
              Enjoyed something I <em className="italic text-accent">built?</em>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              If a project saved you an afternoon, you can buy me a coffee. It
              helps me keep building and sharing — or just{' '}
              <button
                type="button"
                onClick={() => scrollToTarget('#contact')}
                className="font-semibold text-accent underline underline-offset-4 transition-colors hover:text-accent-deep"
              >
                say thanks directly
              </button>
              .
            </p>
            <p className="mt-4 text-sm text-muted">
              Your time here already means a lot. Thank you for stopping by.
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
