import { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../../utils/motion.js';
import { liteSrc } from '../../utils/paths.js';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2 } from 'lucide-react';
import Magnetic from '../Magnetic/Magnetic.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

function isValidUrl(u) {
  return typeof u === 'string' && /^https?:\/\//.test(u) && u !== 'https://' && u !== 'http://';
}

function DetailVisual({ project, enterFrom, onEntered }) {
  const [failed, setFailed] = useState(false);
  const boxRef = useRef(null);
  const willZoom =
    !!enterFrom &&
    enterFrom.rect &&
    String(enterFrom.id) === String(project.id) &&
    typeof window !== 'undefined' &&
    !isReducedMotion();
  const [arrived, setArrived] = useState(!willZoom);

  useEffect(() => {
    if (!willZoom) return undefined;
    const box = boxRef.current;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      setArrived(true);
      onEntered?.();
    };
    if (!box) {
      done();
      return undefined;
    }
    // Wait for the hero image so the target rect has its natural height.
    // (Same file as the card thumbnail, so this resolves instantly in practice.)
    const heroImg = box.querySelector('img');
    if (heroImg && !heroImg.complete) {
      let started = false;
      const safety = setTimeout(start, 1500);
      function start() {
        if (started) return;
        started = true;
        clearTimeout(safety);
        run();
      }
      heroImg.addEventListener('load', start, { once: true });
      heroImg.addEventListener('error', start, { once: true });
      return () => {
        clearTimeout(safety);
        heroImg.removeEventListener('load', start);
        heroImg.removeEventListener('error', start);
      };
    }
    return run();
    function run() {
      const target = boxRef.current;
      if (!target) {
        done();
        return undefined;
      }
      // Prefer the image itself so the ghost lands pixel-true.
      const to = (target.querySelector('img') || target).getBoundingClientRect();
    const from = enterFrom.rect;
    const ghost = document.createElement('img');
    if (enterFrom.src) ghost.src = enterFrom.src;
    ghost.alt = '';
    ghost.setAttribute('aria-hidden', 'true');
    Object.assign(ghost.style, {
      position: 'fixed',
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      objectFit: 'cover',
      objectPosition: 'top',
      borderRadius: '12px',
      zIndex: 250,
      pointerEvents: 'none',
      margin: '0',
    });
    document.body.appendChild(ghost);
    const anim = ghost.animate(
      [
        {
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
          borderRadius: '12px',
        },
        {
          left: `${to.left}px`,
          top: `${to.top}px`,
          width: `${to.width}px`,
          height: `${to.height}px`,
          borderRadius: '16px',
        },
      ],
      { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
    anim.onfinish = () => {
      ghost.remove();
      done();
    };
    // Fallback: never leave the hero invisible (no WAAPI, dropped frames).
    const fallback = setTimeout(() => {
      ghost.remove();
      done();
    }, 1200);
    const rawFinish = anim.onfinish;
    anim.onfinish = (e) => {
      clearTimeout(fallback);
      rawFinish(e);
    };
    return () => {
      clearTimeout(fallback);
      try {
        anim.cancel();
      } catch {
        /* already finished */
      }
      ghost.remove();
    };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frame = (inner, natural) => (
    <div className="relative mx-auto w-full max-w-4xl">
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-3xl bg-accent/10 blur-2xl"
      />
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-subtle transition-opacity duration-300 ${
          arrived ? 'opacity-100' : 'opacity-0'
        }`}
      >
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
        {natural ? (
          <div ref={boxRef}>{inner}</div>
        ) : (
          <div ref={boxRef} className="relative aspect-[21/9]">
            {inner}
          </div>
        )}
      </div>
    </div>
  );

  if (!project.image || failed) {
    return frame(
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <span className="font-display text-7xl leading-none text-muted/50 md:text-8xl">
          {project.title?.charAt(0) || '·'}
        </span>
      </div>
    );
  }
  return frame(
    <img
      src={project.image}
      alt={`${project.title || 'Project'} preview screenshot`}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onError={() => setFailed(true)}
      className="block h-auto w-full"
    />,
    true
  );
}

function RelatedThumb({ project }) {
  const [failed, setFailed] = useState(false);
  const { saver } = useSettings();
  if (!project.image || failed) {
    return (
      <div
        aria-hidden="true"
        className="tone grid aspect-[16/9] place-items-center overflow-hidden rounded-lg border border-border bg-subtle"
      >
        <span className="font-display text-4xl text-muted/60">
          {project.title?.charAt(0) || '·'}
        </span>
      </div>
    );
  }
  return (
    <div className="tone aspect-[16/9] overflow-hidden rounded-lg border border-border bg-subtle">
      <img
        src={saver ? liteSrc(project.image) : project.image}
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
  enterFrom,
  onEntered,
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
  const highlights = project.highlights || [];
  const related = (all || [])
    .filter((p) => String(p.id) !== String(project.id) && (p.category || '') === (project.category || '') && project.category)
    .slice(0, 3);
  const position =
    typeof index === 'number' && typeof total === 'number'
      ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28 md:pt-36">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel || 'Back'}
        </button>
        <div className="flex items-center gap-5">
          {position && (
            <span aria-hidden="true" className="font-mono text-xs tabular-nums tracking-[0.2em] text-muted">
              {position}
            </span>
          )}
          <CopyLinkButton project={project} />
        </div>
      </div>

      <header className="mt-10 md:mt-14">
        <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-accent" />
          {[project.category, project.status].filter(Boolean).join(' · ')}
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-text">
          {project.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-[1.7] text-muted md:text-lg">
          {project.description}
        </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {live && (
              <Magnetic strength={0.25} className="inline-block">
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep hover:shadow-lg"
                >
                  View Live
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Magnetic>
            )}
            {repo && (
              <Magnetic strength={0.25} className="inline-block">
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-7 py-3 text-sm font-medium text-text transition-all duration-200 hover:-translate-y-px hover:border-linestrong hover:text-accent"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Source Code
                </a>
              </Magnetic>
            )}
          {!live && !repo && (
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {project.status || 'archived'}
            </span>
          )}
        </div>
      </header>

      <div className="mt-10 md:mt-14">
        <DetailVisual project={project} enterFrom={enterFrom} onEntered={onEntered} />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {[
          { term: 'Status', value: project.status || 'archived', dot: true },
          { term: 'Category', value: project.category || '—' },
          { term: 'Stack', value: tech.length > 0 ? `${tech.length} technologies` : '—' },
          { term: 'Access', value: live && repo ? 'Live + open source' : live ? 'Live demo' : repo ? 'Open source' : 'Private' },
        ].map(({ term, value, dot }) => (
          <div key={term} className="bg-elevated px-4 py-3.5">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              {term}
            </dt>
            <dd className="mt-1.5 flex items-center gap-2 truncate font-mono text-sm capitalize text-text">
              {dot && (
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              )}
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[1fr_340px] lg:gap-14">
        {highlights.length > 0 && (
          <section aria-label="Key details">
            <h2 className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              <span aria-hidden="true" className="font-display text-lg italic text-accent">01</span>
              Why it stands out
            </h2>
            <ul className="mt-2 divide-y divide-border">
              {highlights.map((h, i) => (
                <li key={h} className="flex items-start gap-5 py-5">
                  <span aria-hidden="true" className="font-display text-2xl leading-none text-muted/50 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-display text-xl leading-snug text-text md:text-2xl">
                    {h}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside aria-label="Build facts" className="lg:pt-1">
          <div className="rounded-xl border border-border bg-elevated p-6 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              <span aria-hidden="true" className="font-display text-lg italic text-accent">02</span>
              Under the hood
            </h2>
            {tech.length > 0 ? (
              <ol className="mt-4 space-y-1">
                {tech.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-subtle"
                  >
                    <span className="text-[0.95rem] font-medium text-text">{t}</span>
                    <span aria-hidden="true" className="font-mono text-[0.65rem] tabular-nums text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted">Stack details coming soon.</p>
            )}
            <div className="mt-5 border-t border-border pt-5 font-mono text-[0.7rem] uppercase leading-loose tracking-[0.14em] text-muted">
              <p className="flex justify-between gap-3">
                <span>Status</span>
                <span className="text-text">{project.status || 'archived'}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Live</span>
                <span className={live ? 'text-accent' : 'text-muted'}>{live ? 'Online' : 'Offline'}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Source</span>
                <span className={repo ? 'text-accent' : 'text-muted'}>{repo ? 'Public' : 'Private'}</span>
              </p>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-label="Related projects" className="mt-20 md:mt-24">
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
              <Magnetic key={r.id} strength={0.12} className="block">
                <button
                  type="button"
                  onClick={() => onOpen && onOpen(r)}
                  className="group w-full rounded-xl border border-border bg-elevated p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-linestrong"
                >
                  <RelatedThumb project={r} />
                  <p className="mt-4 truncate font-display text-xl text-text transition-colors group-hover:text-accent">
                    {r.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                    {r.description}
                  </p>
                </button>
              </Magnetic>
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2 md:mt-20"
        >
          {prev ? (
            <Magnetic strength={0.12} className="block">
              <button
                type="button"
                onClick={() => onOpen(prev)}
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-elevated p-6 text-left transition-all duration-200 hover:-translate-y-px hover:border-accent/60"
              >
                <ArrowLeft
                  className="h-6 w-6 shrink-0 text-muted transition-all duration-200 group-hover:-translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                    Previous project
                  </span>
                  <span className="mt-1.5 block truncate font-display text-2xl text-text transition-colors group-hover:text-accent">
                    {prev.title}
                  </span>
                </span>
              </button>
            </Magnetic>
          ) : (
            <span />
          )}
          {next ? (
            <Magnetic strength={0.12} className="block">
              <button
                type="button"
                onClick={() => onOpen(next)}
                className="group flex w-full items-center justify-end gap-4 rounded-xl border border-border bg-elevated p-6 text-right transition-all duration-200 hover:-translate-y-px hover:border-accent/60"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                    Next project
                  </span>
                  <span className="mt-1.5 block truncate font-display text-2xl text-text transition-colors group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <ArrowRight
                  className="h-6 w-6 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                />
              </button>
            </Magnetic>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
