import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LAYOUT = [
  { align: 'self-start', nudge: 'pt-1', img: 'h-[46vh] md:h-[54vh]' },
  { align: 'self-end', nudge: 'pb-8', img: 'h-[38vh] md:h-[42vh]' },
  { align: 'self-center', nudge: '', img: 'h-[42vh] md:h-[48vh]' },
  { align: 'self-start', nudge: 'pt-12', img: 'h-[36vh] md:h-[40vh]' },
  { align: 'self-end', nudge: 'pb-1', img: 'h-[48vh] md:h-[56vh]' },
  { align: 'self-center', nudge: 'md:-mt-10', img: 'h-[40vh] md:h-[44vh]' },
];

export function PhotoFrame({ photo, index, onOpen, className, imgClass, dimmed, onLoad, eager, large, hideStory }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const tiltRef = useRef(null);
  const canTilt = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const onTiltMove = (e) => {
    const el = tiltRef.current;
    if (!el || !canTilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
  };
  const onTiltLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = '';
  };
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      onMouseMove={onTiltMove}
      onMouseLeave={onTiltLeave}
      aria-label={`Open photo: ${photo.title}`}
      className={className || 'group w-64 shrink-0 text-left md:w-80'}
    >
      <div
        ref={tiltRef}
        style={{ transition: 'transform 0.18s ease-out' }}
        className={`relative overflow-hidden rounded-lg border bg-subtle transition-all duration-300 group-hover:border-linestrong group-focus-visible:border-accent ${dimmed ? 'border-border' : 'border-linestrong'
          }`}
      >
        {!failed ? (
          <img
            src={photo.src}
            alt={photo.title}
            width={photo.w}
            height={photo.h}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            onLoad={() => {
              setLoaded(true);
              onLoad?.();
            }}
            className={`${imgClass || 'h-auto w-full'} transition-all duration-500 group-hover:scale-[1.03] ${!loaded ? 'opacity-0' : 'opacity-100'}
              }`}
          />
        ) : (
          <div className="grid aspect-[4/5] w-full min-w-56 place-items-center bg-elevated p-6">
            <div className="text-center">
              <p className="font-display text-6xl text-muted/50">
                {photo.title?.charAt(0) || '·'}
              </p>
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                Drop {photo.src?.split('/').pop()} in
                <br />
                public/assets/images/gallery/
              </p>
            </div>
          </div>
        )}
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-bg/70 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Expand className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="w-0 min-w-full">
        <div className={`mt-4 flex items-baseline gap-3 transition-opacity duration-300 ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
          <span aria-hidden="true" className="shrink-0 font-display text-3xl leading-none text-accent">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className={`truncate font-display leading-snug text-text transition-colors duration-200 group-hover:text-accent ${large ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{photo.title}</p>
            <p className="mt-1 truncate font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
              {photo.location}
              {photo.meta ? ` · ${photo.meta}` : ''}
            </p>
          </div>
        </div>
        {photo.story && !hideStory && (
          <p className={`mt-2 line-clamp-2 leading-relaxed text-muted transition-opacity duration-300 ${large ? 'max-w-2xl md:text-base' : 'text-sm'} ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
            {photo.story}
          </p>
        )}
      </div>
    </button>
  );
}

export function Lightbox({ photo, onClose, onPrev, onNext, pos, total }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo?.src]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.__lenis?.start();
    };
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;
  // Portaled to <body> so no ancestor stacking context can ever trap the
  // overlay beneath the fixed navbar. Exit animations still work — presence
  // is tracked by component, not by DOM location.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-[90] flex flex-col bg-black p-4 pb-[env(safe-area-inset-bottom)] md:p-10"
      onClick={onClose}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between text-white">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/70">
          Frame {pos} / {total}
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close photo"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors hover:border-accent hover:text-accent"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center gap-2 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous photo"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {!failed ? (
          <img
            src={photo.src}
            alt={photo.title}
            decoding="async"
            onError={() => setFailed(true)}
            className="max-h-[62vh] w-auto max-w-full rounded-lg object-contain"
          />
        ) : (
          <p className="font-mono text-sm text-white/60">Photo coming soon.</p>
        )}
        <button
          type="button"
          onClick={onNext}
          aria-label="Next photo"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        className="mx-auto w-full max-w-5xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-2xl text-white">{photo.title}</p>
        <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/60">
          {photo.location}
          {photo.meta ? ` · ${photo.meta}` : ''}
        </p>
        {photo.story && (
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            {photo.story}
          </p>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

export default function Gallery({ photos, onViewAll }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const ghostRef = useRef(null);
  const stRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [pos, setPos] = useState(1);
  const [prog, setProg] = useState(0);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = photos || [];

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.scrollWidth - window.innerWidth);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || items.length === 0) return;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -measure(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${measure()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              stRef.current = self;
              const p = self.progress;
              setProg(p);
              setPos(Math.min(items.length, Math.floor(p * items.length) + 1));
              // Lean the reel with scroll velocity; eases back when still.
              const skew = gsap.utils.clamp(-7, 7, self.getVelocity() / -350);
              gsap.to(track, {
                skewX: skew,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            },
          },
        }
      );
      if (ghostRef.current) {
        gsap.fromTo(
          ghostRef.current,
          { xPercent: 6 },
          {
            xPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: () => `+=${measure()}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, root);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(t);
      ctx.revert();
    };
  }, [measure, reduce, items.length]);

  const goTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    const target = st.start + (st.end - st.start) * (i / Math.max(1, items.length - 1));
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const step = (dir) =>
    setOpenIndex((i) => (i === null ? i : (i + dir + items.length) % items.length));

  if (items.length === 0) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const active = pos - 1;

  return (
    <section id="gallery" ref={rootRef} className="overflow-hidden border-t border-border">
      {reduce ? (
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-24 md:py-32 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((photo, i) => (
            <PhotoFrame
              key={photo.src || i}
              photo={photo}
              index={i}
              onOpen={setOpenIndex}
              className="group w-full text-left"
            />
          ))}
        </div>
      ) : (
        <div className="relative flex h-dvh flex-col overflow-hidden">
          <div
            ref={ghostRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center overflow-hidden [justify-content:safe_center]"
          >
            <span
              className="whitespace-nowrap font-display text-[24vw] italic leading-none text-transparent opacity-60"
              style={{ WebkitTextStroke: '1px var(--color-border)' }}
            >
              Aayush.
            </span>
          </div>

          <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-6 pt-24">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Side quest · keep scrolling
            </p>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="font-mono text-xs tabular-nums text-muted">
                {pad(pos)} / {pad(items.length)}
              </span>
              <button
                type="button"
                onClick={() => goTo(Math.max(0, pos - 2))}
                aria-label="Previous photos"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-bg text-muted transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(items.length - 1, pos))}
                aria-label="Next photos"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-bg text-muted transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-stretch">
            <div
              ref={trackRef}
              className="flex h-full w-max items-stretch gap-8 pl-6 pr-[14vw] pt-24 md:gap-14 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pt-28"
            >
              <div className="w-[80vw] shrink-0 self-center md:w-[28vw]">
                <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02] text-text">
                  Photos I can&apos;t stop taking<span className="text-accent">.</span>
                </h2>
                <p className="mt-5 max-w-sm font-display text-2xl leading-snug text-text">
                  Six evenings I refused to forget, collected frame by frame.
                </p>
                <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">
                  The reel moves sideways →
                </p>
              </div>
              {items.map((photo, i) => {
                const lay = LAYOUT[i % LAYOUT.length];
                return (
                  <div key={photo.src || i} className={`${lay.align} shrink-0 ${lay.nudge}`}>
                    <PhotoFrame
                      photo={photo}
                      index={i}
                      onOpen={setOpenIndex}
                      dimmed={i !== active}
                      eager
                      onLoad={() => ScrollTrigger.refresh()}
                      className="group max-w-[82vw] text-left"
                      imgClass={`${lay.img} w-auto max-w-full`}
                    />
                  </div>
                );
              })}
              <div className="grid w-[72vw] shrink-0 self-center place-items-center md:w-[26vw]">
                <div className="text-center">
                  <p className="font-display text-3xl leading-tight text-text md:text-4xl">
                    Want the
                    <br />
                    whole roll?
                  </p>
                  <button
                    type="button"
                    onClick={onViewAll}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep"
                  >
                    Open gallery
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-10 mx-auto w-full max-w-6xl px-6">
            <div className="h-px bg-border">
              <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${prog})` }} />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <Lightbox
            photo={items[openIndex]}
            pos={openIndex + 1}
            total={items.length}
            onClose={() => setOpenIndex(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
