import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { readStats, resetStats } from '../../utils/analytics.js';

function Row({ label, views }) {
  return (
    <li className="flex items-center justify-between gap-4 py-2.5">
      <span className="min-w-0 truncate text-[0.95rem] text-text">{label}</span>
      <span className="shrink-0 font-mono text-sm tabular-nums text-accent">{views}</span>
    </li>
  );
}

export default function StatsPage({ onBack }) {
  const [stats, setStats] = useState(() => readStats());
  const routes = Object.entries(stats.routes || {}).sort((a, b) => b[1] - a[1]);
  const projects = Object.entries(stats.projects || {}).sort((a, b) => b[1].views - a[1].views);
  const total = routes.reduce((n, [, v]) => n + v, 0);

  const reset = () => {
    resetStats();
    setStats(readStats());
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:pt-40">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back home
      </button>

      <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
        Private
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.02] text-text">
        Stats<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        What this browser has viewed on this site. Counted locally, never sent
        anywhere — clearing it only clears your own device.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-elevated p-5 md:p-7" aria-label="Page views">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl text-text">Pages</h2>
            <span className="font-mono text-xs tabular-nums text-muted">{total} total</span>
          </div>
          {routes.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No page views recorded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {routes.map(([route, views]) => (
                <Row key={route} label={route === '#home' ? 'Home' : route} views={views} />
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-elevated p-5 md:p-7" aria-label="Project opens">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl text-text">Projects</h2>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>
          {projects.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No project opened yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {projects.map(([id, entry]) => (
                <Row key={id} label={entry.title || `#${id}`} views={entry.views} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
