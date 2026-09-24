import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github, Plus } from 'lucide-react';
import { scrollToTarget } from '../../utils/scroll.js';

gsap.registerPlugin(ScrollTrigger);

const TABS = ['All', 'Web Apps', 'Tools', 'Games', 'Landing Pages', 'Ed-Tech'];

function normalizeCategory(p) {
  const c = String(p.category || p.status || '').toLowerCase();
  if (c.includes('landing')) return 'Landing Pages';
  if (c.includes('ed')) return 'Ed-Tech';
  if (c.includes('tool')) return 'Tools';
  if (c.includes('web')) return 'Web Apps';
  if (c.includes('game')) return 'Games';
  return 'Web Apps';
}

function isValidUrl(u) {
  return typeof u === 'string' && /^https?:\/\//.test(u) && u !== 'https://' && u !== 'http://';
}

function ProjectVisual({ project, large }) {
  const [failed, setFailed] = useState(false);
  const src = project.image;
  const alt = `${project.title || 'Project'} preview screenshot`;
  if (large) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-subtle">
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
          <div className="absolute inset-0 flex flex-col justify-between p-5" aria-hidden="true">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              {String(project.id).padStart(2, '0')}
            </span>
            <span className="font-display text-3xl leading-none text-muted/70 md:text-4xl">
              {project.title?.charAt(0) || 'A'}
            </span>
          </div>
          {src && !failed && (
            <img
              src={src}
              alt={alt}
              loading="lazy" decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-subtle">
      <div className="absolute inset-0 flex flex-col justify-between p-5" aria-hidden="true">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          {String(project.id).padStart(2, '0')}
        </span>
        <span className="font-display text-3xl leading-none text-muted/70 md:text-4xl">
          {project.title?.charAt(0) || 'A'}
        </span>
      </div>
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy" decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
}

function TechTags({ tech }) {
  if (!tech || tech.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
      {tech.slice(0, 5).map((t) => (
        <li
          key={t}
          className="rounded-md border border-border bg-subtle px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project, onDetails }) {
  const live = isValidUrl(project.liveUrl) ? project.liveUrl : null;
  const repo = isValidUrl(project.githubUrl) ? project.githubUrl : null;
  const primary = live || repo;
  if (!primary && !onDetails) return null;
  return (
    <div className="mt-5 flex items-center gap-4">
      {primary && (
        <a
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
        >
          View Project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      )}
      {onDetails && (
        <button
          type="button"
          onClick={() => onDetails(project)}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          Details
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {live && repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source code on GitHub`}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          Code
        </a>
      )}
    </div>
  );
}

export default function Projects({ projects, onViewAll, onOpen }) {
  const [filter, setFilter] = useState('All');
  const rootRef = useRef(null);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items = useMemo(
    () =>
      (projects || []).map((p) => ({ ...p, _cat: normalizeCategory(p) })),
    [projects]
  );

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((p) => p._cat === filter)),
    [items, filter]
  );

  const [featured, ...rest] = filtered;

  const counts = useMemo(() => {
    const c = { All: items.length };
    TABS.slice(1).forEach((t) => {
      c[t] = items.filter((x) => x._cat === t).length;
    });
    return c;
  }, [items]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="projects" ref={rootRef} className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <p
          data-reveal
          className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
        >
          Selected Work
        </p>
        <h2
          data-reveal
          className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
        >
          Selected <em className="italic">work.</em>
        </h2>

        <div
          data-reveal
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-8 flex flex-wrap gap-2"
        >
          {TABS.map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-accent text-white'
                    : 'border border-border bg-elevated text-muted hover:-translate-y-px hover:border-linestrong hover:text-text'
                }`}
              >
                {tab}
                <span
                  className={`ml-1.5 font-mono text-[0.7rem] tabular-nums ${
                    active ? 'text-white/80' : 'text-muted'
                  }`}
                >
                  {counts[tab] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-muted">No projects in this category yet.</p>
        ) : (
          <div className="mt-10">
            {featured && (
              <motion.article
                key={featured.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="group grid gap-6 rounded-xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-1 hover:border-linestrong md:p-7 lg:grid-cols-2 lg:gap-8"
              >
                <ProjectVisual project={featured} large />
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                      Featured · {featured._cat}
                    </p>
                    <span aria-hidden="true" className="font-mono text-sm text-muted">
                      01
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-text">
                    {featured.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{featured.description}</p>
                  <div className="mt-5">
                    <TechTags tech={featured.techStack} />
                  </div>
                  {featured.status && (
                    <p className="mt-4 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {featured.status}
                    </p>
                  )}
                  <ProjectLinks project={featured} onDetails={onOpen} />
                </div>
              </motion.article>
            )}

            <motion.div layout={!reduce} className="mt-6 grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {rest.map((p, i) => (
                  <motion.article
                    key={p.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`group flex flex-col rounded-xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-1 hover:border-linestrong ${
                      i % 2 === 1 ? 'flex-col-reverse justify-end' : ''
                    }`}
                  >
                    <ProjectVisual project={p} />
                    <div className={i % 2 === 1 ? 'mb-5' : 'mt-5'}>
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                          {p._cat}
                        </p>
                        <span aria-hidden="true" className="font-mono text-xs text-muted transition-colors duration-200 group-hover:text-accent">
                          {String(i + 2).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-2 line-clamp-1 font-display text-2xl text-text">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                        {p.description}
                      </p>
                      <div className="mt-4">
                        <TechTags tech={p.techStack} />
                      </div>
                      {p.status && (
                        <p className="mt-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {p.status}
                        </p>
                      )}
                      <ProjectLinks project={p} onDetails={onOpen} />
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
              {filter === 'All' && (
                <motion.article
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-linestrong bg-transparent p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-text">
                    Something new is brewing.
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                    Have an idea worth building? My inbox is open.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToTarget('#contact')}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
                  >
                    Let&apos;s talk
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </motion.article>
              )}
            </motion.div>
          </div>
        )}

        <div data-reveal className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            And plenty of smaller experiments
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <button
              type="button"
              onClick={onViewAll}
              className="group/gh inline-flex items-center gap-2 font-display text-2xl text-text transition-colors hover:text-accent md:text-3xl"
            >
              Browse all projects
              <ArrowUpRight className="h-6 w-6 text-accent transition-transform duration-200 group-hover/gh:-translate-y-1 group-hover/gh:translate-x-1" aria-hidden="true" />
            </button>
            <a
              href="https://github.com/aayush-neupane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
