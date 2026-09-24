import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { scrollToTarget } from '../../utils/scroll.js';
import Magnetic from '../Magnetic/Magnetic.jsx';

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

export default function Hero({ profile, now, onProject }) {
  const rootRef = useRef(null);
  const name = profile?.name || 'Aayush Neupane';
  const [first, ...restName] = name.split(' ');
  const tagline =
    profile?.tagline ||
    'I build fast, usable websites with React and TypeScript — and games with Unity. Based in Jhapa, Nepal, open for freelance.';
  const nowText = now?.text || 'Shipping Excurion';
  const nowSub = now?.sub || null;
  const nowProjectId = now?.link?.projectId ?? null;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const canTilt = useMemo(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(pointer: coarse)').matches,
    []
  );
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const onTilt = (e) => {
    if (!canTilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

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
            Available for work
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
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget('#projects')}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep hover:shadow-lg"
              >
                View Work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget('#contact')}
                className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-7 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:-translate-y-px hover:bg-accent hover:text-white"
              >
                Get in Touch
              </button>
            </Magnetic>
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
                <CountUp to={4} suffix="+ yrs" />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                Projects
              </dt>
              <dd className="mt-1 font-mono text-xl text-text">
                <CountUp to={20} suffix="+" />
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

        <div data-reveal data-parallax className="relative" onMouseMove={onTilt} onMouseLeave={resetTilt}>
          <motion.div
            style={
              canTilt
                ? { rotateX: srx, rotateY: sry, transformPerspective: 900 }
                : undefined
            }
          >
            <div className="rounded-xl border border-border bg-elevated p-6 transition-colors duration-200 hover:border-linestrong md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                  Build log
                </span>
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              </div>
              <p className="mt-8 font-display text-4xl leading-none text-text md:text-5xl">
                Ship<span className="text-accent">.</span>
              </p>
              <div className="mt-8 space-y-3 font-mono text-xs leading-relaxed">
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="uppercase tracking-[0.14em] text-muted">Focus</span>
                  <span className="text-text">Full-stack web</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="uppercase tracking-[0.14em] text-muted">Stack</span>
                  <span className="text-text">React · TypeScript</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="uppercase tracking-[0.14em] text-muted">Status</span>
                  <span className="text-accent">Open to work</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.14em] text-muted">{now?.label || 'Now'}</span>
                  {nowProjectId != null && onProject ? (
                    <button
                      type="button"
                      onClick={() => onProject({ id: nowProjectId })}
                      className="text-right transition-colors hover:text-accent"
                    >
                      <span className="text-text">{nowText}</span>
                      {nowSub && <span className="mt-0.5 block text-[0.65rem] normal-case tracking-normal text-muted">{nowSub}</span>}
                    </button>
                  ) : (
                    <span className="text-right">
                      <span className="text-text">{nowText}</span>
                      {nowSub && <span className="mt-0.5 block text-[0.65rem] normal-case tracking-normal text-muted">{nowSub}</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-xl border border-border"
          />
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
