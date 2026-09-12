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
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export default function ProjectsPage({ projects, onBack }) {
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
        {filtered.map((p, i) => {
          const live = isValidUrl(p.liveUrl) ? p.liveUrl : null;
          const repo = isValidUrl(p.githubUrl) ? p.githubUrl : null;
          return (
            <li
              key={p.id ?? i}
              className="group grid gap-4 py-5 transition-colors duration-200 hover:bg-subtle sm:grid-cols-[auto_7rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
            >
              <span aria-hidden="true" className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <RowThumb project={p} />
              <div className="min-w-0">
                <h2 className="truncate font-display text-xl text-text transition-colors group-hover:text-accent md:text-2xl">
                  {p.title}
                </h2>
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
        })}
      </ol>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted">Nothing in this category yet.</p>
      )}
    </div>
  );
}
