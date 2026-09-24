import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';

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

export default function ProjectDetail({ project, prev, next, onBack, backLabel, onOpen }) {
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
        <DetailVisual project={project} />
        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {[project.category, project.status].filter(Boolean).join(' · ')}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.02] text-text">
            {project.title}
          </h1>
          <p className="mt-5 leading-[1.7] text-muted">{project.description}</p>

          {(project.techStack || []).length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
              {project.techStack.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-border bg-subtle px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
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
          </div>
        </div>
      </div>

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
