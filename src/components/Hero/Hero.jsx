import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrollToTarget } from '../../utils/scroll.js';
import MacBook from './MacBook.jsx';

function CountUp({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1300;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export default function Hero({ profile, now, onProject, stats, projects = [] }) {
  const rootRef = useRef(null);
  const name = profile?.name || 'Aayush Neupane';
  const [first, ...restName] = name.split(' ');
  const tagline =
    profile?.tagline ||
    'I build fast, usable websites with React and TypeScript, and games with Unity. Based in Jhapa, Nepal, open for freelance.';
  const nowText = now?.text || 'Shipping Excurion';
  const nowSub = now?.sub || null;
  const nowProjectId = now?.link?.projectId ?? null;
  const available = now?.available !== false;
  const reply = now?.reply || '~24h';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.1 }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to('[data-parallax]', {
        y: -56,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={rootRef} className="relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-28 pt-36 md:pb-36 md:pt-44 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p data-reveal className="mb-5 font-mono text-xs tracking-[0.08em] text-muted">
            {greeting}, and thanks for stopping by.
          </p>
          <button
            data-reveal
            type="button"
            onClick={() => scrollToTarget('#contact')}
            className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-elevated py-1.5 pl-3 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors duration-200 hover:border-accent/60 hover:text-text"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {available ? `Available · replies in ${reply}` : 'Currently booked'}
          </button>
          <p
            data-reveal
            className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            Developer &amp; Builder
          </p>
          <h1
            data-reveal
            className="mt-5 font-display text-[clamp(3rem,7vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-text"
          >
            {first}{' '}
            <em className="italic">
              {restName.join(' ')}
              <span className="text-accent">.</span>
            </em>
          </h1>
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {tagline}
          </p>
          <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#projects');
              }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-contrast transition duration-200 hover:brightness-110"
            >
              View Work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#contact');
              }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-7 py-3 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-contrast"
            >
              Get in Touch
            </a>
          </div>
          <dl
            data-reveal
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6"
          >
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                Experience
              </dt>
              <dd className="mt-1 font-mono text-xl text-text">
                <CountUp to={stats?.years ?? 4} suffix="+ yrs" />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                Projects
              </dt>
              <dd className="mt-1 font-mono text-xl text-text">
                <CountUp to={stats?.projects ?? 20} suffix="+" />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                Location
              </dt>
              <dd className="mt-1 font-mono text-xl text-text">Nepal</dd>
            </div>
          </dl>
        </div>

        <div data-reveal data-parallax className="relative">
          <div
            className="hero-device relative"
            style={{ transformStyle: 'preserve-3d', perspective: '2400px' }}
          >
            <div className="hero-device-float" style={{ transformStyle: 'preserve-3d' }}>
              <MacBook
                available={available}
                reply={reply}
                nowText={nowText}
                nowSub={nowSub}
                nowProjectId={nowProjectId}
                onProject={onProject}
                projects={projects}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        data-reveal
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
          Scroll
        </span>
        <span className="block h-10 w-px overflow-hidden bg-border">
          <span className="scroll-cue-line block h-1/2 w-px bg-accent" />
        </span>
      </div>
    </section>
  );
}
