import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';

function isValidUrl(u) {
  return typeof u === 'string' && /^https?:\/\//.test(u) && u !== 'https://' && u !== 'http://';
}

function RowThumb({ project }) {
  const [failed, setFailed] = useState(false);
  const frame =
    'h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-subtle';
  if (!project.image || failed) {
    return (
      <div className={`${frame} grid place-items-center`} aria-hidden="true">
        <span className="font-display text-3xl text-muted/60">
          {project.title?.charAt(0) || '·'}
        </span>
      </div>
    );
  }
  return (
    <div className={frame}>
      <img
        src={project.image}
        alt={`${project.title || 'Project'} thumbnail`}
        loading="lazy" decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

const EARLY_IDS = new Set([108, 109, 110, 111, 112, 113]);

function RowItem({ project: p, index, onOpen }) {
  const live = isValidUrl(p.liveUrl) ? p.liveUrl : null;
  const repo = isValidUrl(p.githubUrl) ? p.githubUrl : null;
  return (
    <li
      key={p.id ?? index}
      className="group grid gap-4 py-5 transition-colors duration-200 hover:bg-subtle sm:grid-cols-[auto_7rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
    >
      <span aria-hidden="true" className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
        {String(index + 1).padStart(2, '0')}
      </span>
      <RowThumb project={p} />
      <div className="min-w-0">
        {onOpen ? (
          <button type="button" onClick={() => onOpen(p)} className="block min-w-0 max-w-full text-left">
            <h2 className="truncate font-display text-xl text-text transition-colors hover:text-accent md:text-2xl">
              {p.title}
            </h2>
          </button>
        ) : (
          <h2 className="truncate font-display text-xl text-text transition-colors group-hover:text-accent md:text-2xl">
            {p.title}
          </h2>
        )}
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {p.description}
        </p>
        {(p.techStack || []).length > 0 && (
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            {(p.techStack || []).slice(0, 4).join(' · ')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 sm:justify-end">
        {onOpen && (
          <button
            type="button"
            onClick={() => onOpen(p)}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            Live
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.title} source code`}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Code
          </a>
        )}
        {!live && !repo && (
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted/60">
            {p.status || 'archived'}
          </span>
        )}
      </div>
    </li>
  );
}

export default function ProjectsPage({ projects, onBack, onOpen }) {
  const [filter, setFilter] = useState('All');
  const items = projects || [];

  const cats = useMemo(
    () => ['All', ...[...new Set(items.map((p) => p.category).filter(Boolean))].sort()],
    [items]
  );
  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((p) => p.category === filter)),
    [items, filter]
  );
  const main = useMemo(() => filtered.filter((p) => !EARLY_IDS.has(p.id)), [filtered]);
  const early = useMemo(() => filtered.filter((p) => EARLY_IDS.has(p.id)), [filtered]);

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
        Archive
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <h1 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02] text-text">
          Every experiment<span className="text-accent">.</span>
        </h1>
        <a
          href="https://github.com/aayush-neupane"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-5 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-px hover:border-linestrong hover:text-accent"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub profile
        </a>
      </div>
      <p className="mt-5 max-w-xl leading-[1.6] text-muted">
        The smaller builds: games, tools, and weekend toys. Less polish than the
        featured work, more curiosity per pixel.
      </p>

      <div role="tablist" aria-label="Filter archive by category" className="mt-8 flex flex-wrap gap-2">
        {cats.map((cat) => {
          const selected = filter === cat;
          const count = cat === 'All' ? items.length : items.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-all duration-200 ${
                selected
                  ? 'bg-accent text-white'
                  : 'border border-border bg-elevated text-muted hover:-translate-y-px hover:border-linestrong hover:text-text'
              }`}
            >
              {cat}
              <span className={`ml-1.5 font-mono text-[0.7rem] tabular-nums ${selected ? 'text-white/80' : 'text-muted'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {main.map((p, i) => (
          <RowItem key={p.id ?? i} project={p} index={i} onOpen={onOpen} />
        ))}
      </ol>
      {early.length > 0 && (
        <details className="group/early mt-6 rounded-xl border border-border bg-elevated">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Early experiments · {early.length}
            </span>
            <span className="text-sm text-muted transition-transform duration-200 group-open/early:rotate-45">
              <span aria-hidden="true" className="font-mono text-lg leading-none">+</span>
              <span className="sr-only">Toggle early experiments</span>
            </span>
          </summary>
          <ol className="divide-y divide-border border-t border-border px-1 pb-2">
            {early.map((p, i) => (
              <RowItem key={p.id ?? i} project={p} index={main.length + i} onOpen={onOpen} />
            ))}
          </ol>
        </details>
      )}
      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted">Nothing in this category yet.</p>
      )}
    </div>
  );
}
