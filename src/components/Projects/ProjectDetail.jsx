import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2 } from 'lucide-react';

function isValidUrl(u) {
  return typeof u === 'string' && /^https?:\/\//.test(u) && u !== 'https://' && u !== 'http://';
}

function DetailVisual({ project }) {
  const [failed, setFailed] = useState(false);
  if (!project.image || failed) {
    return (
      <div
        aria-hidden="true"
        className="grid aspect-[16/10] place-items-center overflow-hidden rounded-xl border border-border bg-subtle"
      >
        <span className="font-display text-8xl text-muted/60">
          {project.title?.charAt(0) || '·'}
        </span>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-subtle">
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-border bg-elevated px-4 py-2.5"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 hidden truncate font-mono text-[0.65rem] tracking-wide text-muted sm:block">
          {project.title}
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        <img
          src={project.image}
          alt={`${project.title || 'Project'} preview screenshot`}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

function RelatedThumb({ project }) {
  const [failed, setFailed] = useState(false);
  if (!project.image || failed) {
    return (
      <div
        aria-hidden="true"
        className="grid aspect-[16/9] place-items-center overflow-hidden rounded-lg border border-border bg-subtle"
      >
        <span className="font-display text-4xl text-muted/60">
          {project.title?.charAt(0) || '·'}
        </span>
      </div>
    );
  }
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border bg-subtle">
      <img
        src={project.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

function CopyLinkButton({ project }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/project/${project.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent" aria-hidden="true" />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}

export default function ProjectDetail({
  project,
  prev,
  next,
  onBack,
  backLabel,
  onOpen,
  index,
  total,
  all,
}) {
  if (!project) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:pt-40">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel || 'Back'}
        </button>
        <h1 className="mt-8 font-display text-[clamp(2rem,4vw,3rem)] text-text">
          Project not found.
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          That project id doesn&apos;t match anything in the portfolio. It may
          have been moved or removed.
        </p>
      </div>
    );
  }

  const live = isValidUrl(project.liveUrl) ? project.liveUrl : null;
  const repo = isValidUrl(project.githubUrl) ? project.githubUrl : null;
  const tech = project.techStack || [];
  const related = (all || [])
    .filter((p) => String(p.id) !== String(project.id) && (p.category || '') === (project.category || '') && project.category)
    .slice(0, 3);
  const position =
    typeof index === 'number' && typeof total === 'number'
      ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:pt-40">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel || 'Back'}
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <DetailVisual project={project} />
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {[
              { term: 'Project', value: position || '—' },
              { term: 'Category', value: project.category || '—' },
              { term: 'Stack', value: tech.length > 0 ? `${tech.length} tech` : '—' },
              { term: 'Status', value: project.status || 'archived' },
            ].map(({ term, value }) => (
              <div key={term} className="bg-elevated px-4 py-3.5">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                  {term}
                </dt>
                <dd className="mt-1.5 flex items-center gap-2 truncate font-mono text-sm capitalize text-text">
                  {term === 'Status' && (
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {[project.category, project.status].filter(Boolean).join(' · ')}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.02] text-text">
            {project.title}
          </h1>
          <p className="mt-5 leading-[1.7] text-muted">{project.description}</p>

          {tech.length > 0 && (
            <div className="mt-7">
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                Built with
              </h2>
              <ol className="mt-3 divide-y divide-border border-y border-border">
                {tech.map((t, i) => (
                  <li key={t} className="flex items-baseline gap-4 py-2.5">
                    <span aria-hidden="true" className="font-mono text-xs tabular-nums text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.95rem] text-text">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep"
              >
                View Live
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-6 py-2.5 text-sm font-medium text-text transition-all duration-200 hover:-translate-y-px hover:border-linestrong hover:text-accent"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Source Code
              </a>
            )}
            {!live && !repo && (
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted/60">
                {project.status || 'archived'}
              </span>
            )}
            <CopyLinkButton project={project} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-label="Related projects" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl text-text md:text-3xl">
              More like this<span className="text-accent">.</span>
            </h2>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Same shelf · {project.category}
            </p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpen && onOpen(r)}
                className="group rounded-xl border border-border bg-elevated p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-linestrong"
              >
                <RelatedThumb project={r} />
                <p className="mt-4 truncate font-display text-xl text-text transition-colors group-hover:text-accent">
                  {r.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                  {r.description}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <button
              type="button"
              onClick={() => onOpen(prev)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-elevated p-5 text-left transition-all duration-200 hover:-translate-y-px hover:border-linestrong"
            >
              <ArrowLeft
                className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                  Previous
                </span>
                <span className="mt-1 block truncate font-display text-xl text-text transition-colors group-hover:text-accent">
                  {prev.title}
                </span>
              </span>
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              type="button"
              onClick={() => onOpen(next)}
              className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-elevated p-5 text-right transition-all duration-200 hover:-translate-y-px hover:border-linestrong"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                  Next
                </span>
                <span className="mt-1 block truncate font-display text-xl text-text transition-colors group-hover:text-accent">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent"
                aria-hidden="true"
              />
            </button>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
