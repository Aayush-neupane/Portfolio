import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clean = (w) => w.replace(/[.,!?—–;:'"“”]/g, '').toLowerCase();

/**
 * TextReveal3D — scroll-triggered 3D text animation.
 * Words tilt up from rotateX(-75deg) with a scrubbed stagger;
 * `emphasis` words render in accent italic, and an optional
 * supporting line fades in as the scrub completes.
 */
export default function TextReveal3D({ text, eyebrow, emphasis = [], support }) {
  const rootRef = useRef(null);
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const emph = new Set(emphasis.map((w) => String(w).toLowerCase()));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const inners = root.querySelectorAll('[data-word-inner]');
    const tail = root.querySelector('[data-support]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([inners, tail], { opacity: 1, rotateX: 0, yPercent: 0, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', end: 'top 32%', scrub: 0.5 },
      });
      tl.fromTo(
        inners,
        { opacity: 0, rotateX: -75, yPercent: 24 },
        { opacity: 1, rotateX: 0, yPercent: 0, ease: 'none', stagger: 0.08, duration: 1 }
      );
      if (tail) {
        tl.fromTo(
          tail,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 },
          0.72
        );
      }
    }, root);
    return () => ctx.revert();
  }, [text, support]);

  return (
    <section aria-label="Design philosophy" className="border-t border-border">
      <div ref={rootRef} className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        {eyebrow && (
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <p
          className="mt-5 max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.12] text-text"
          style={{ perspective: '900px' }}
        >
          {words.map((w, i) => {
            const hot = emph.has(clean(w));
            return (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <span
                  data-word-inner
                  className={`inline-block will-change-transform ${hot ? 'italic text-accent' : ''}`}
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {w}
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              </span>
            );
          })}
        </p>
        {support && (
          <p data-support className="mt-7 max-w-xl leading-[1.6] text-muted">
            {support}
          </p>
        )}
      </div>
    </section>
  );
}
