import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { thumb, mid } from '../../utils/galleryImg.js';
import SmartImage from '../Loader/SmartImage.jsx';
import ShareMenu from '../Share/ShareMenu.jsx';

gsap.registerPlugin(ScrollTrigger);

function PhotoShareButton({ photo }) {
  if (typeof window === 'undefined' || !photo) return null;
  // Pretty per-photo link (matches the prerendered /gallery/:id stubs).
  const base = window.location.pathname.replace(/\/$/, '');
  const url =
    photo.id !== undefined && photo.id !== null
      ? `${window.location.origin}${base}/gallery/${encodeURIComponent(String(photo.id))}`
      : photo.src
        ? new URL(photo.src, window.location.origin).href
        : '';
  return (
    <span onClick={(e) => e.stopPropagation()}>
      <ShareMenu
        title={`${photo.title} — Aayush Neupane`}
        text={photo.story || photo.title}
        url={url}
        imageSrc={photo.src}
        layout="icon"
      />
    </span>
  );
}

const LAYOUT = [
  { align: 'self-start', nudge: 'pt-1', img: 'max-h-[46vh] md:max-h-[54vh]' },
  { align: 'self-end', nudge: 'pb-8', img: 'max-h-[38vh] md:max-h-[42vh]' },
  { align: 'self-center', nudge: '', img: 'max-h-[42vh] md:max-h-[48vh]' },
  { align: 'self-start', nudge: 'pt-12', img: 'max-h-[36vh] md:max-h-[40vh]' },
  { align: 'self-end', nudge: 'pb-1', img: 'max-h-[48vh] md:max-h-[56vh]' },
  { align: 'self-center', nudge: 'md:-mt-10', img: 'max-h-[40vh] md:max-h-[44vh]' },
];

export function PhotoFrame({ photo, index, onOpen, className, imgClass, dimmed, onLoad, eager, large, hideStory, compact }) {
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
        className={`relative overflow-hidden rounded-lg border bg-subtle transition-all duration-300 group-hover:border-accent/70 group-focus-visible:border-accent ${dimmed ? 'border-border' : 'border-linestrong'
          }`}
      >
        <SmartImage
          sources={[thumb(photo.src), photo.src]}
          alt={photo.title}
          width={photo.w}
          height={photo.h}
          eager={eager}
          onLoad={onLoad}
          mark={40}
          caption="photo unavailable"
          imgClassName={`${imgClass || 'h-auto w-full'} group-hover:scale-[1.03]`}
        />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-bg/70 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          <Expand className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="w-0 min-w-full">
        <div className={`mt-4 flex items-baseline gap-3 transition-opacity duration-300 ${dimmed ? 'opacity-50' : 'opacity-100'} ${compact ? 'mt-2 gap-2' : ''}`}>
          <span aria-hidden="true" className={`shrink-0 font-display leading-none text-accent ${compact ? 'text-xl' : 'text-3xl'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className={`truncate font-display leading-snug text-text transition-colors duration-200 group-hover:text-accent ${large ? 'text-3xl md:text-4xl' : compact ? 'text-base' : 'text-2xl'}`}>{photo.title}</p>
            <p className={`mt-1 truncate font-mono uppercase tracking-[0.1em] text-muted ${compact ? 'text-[0.6rem]' : 'text-[0.7rem]'}`}>
              {photo.location}
              {photo.meta ? ` · ${photo.meta}` : ''}
            </p>
          </div>
        </div>
        {photo.story && !hideStory && !compact && (
          <p className={`mt-2 line-clamp-2 leading-relaxed text-muted transition-opacity duration-300 ${large ? 'max-w-2xl md:text-base' : 'text-sm'} ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
            {photo.story}
          </p>
        )}
      </div>
    </button>
  );
}

export function Lightbox({ photo, onClose, onPrev, onNext, pos, total }) {
  const touchRef = useRef({ x: 0, y: 0 });
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  // Focus trap with focus return: Tab cycles inside the dialog, and closing
  // hands focus back to whatever opened it.
  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    const node = dialogRef.current;
    if (!node) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = [...node.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled && el.offsetParent !== null
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      window.__lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  if (!photo) return null;
  // Portaled to <body> so no ancestor stacking context can ever trap the
  // overlay beneath the fixed navbar. Exit animations still work — presence
  // is tracked by component, not by DOM location.
  return createPortal(
    <motion.div
      ref={dialogRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-[90] flex h-dvh flex-col overflow-hidden bg-black p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+1rem)] md:p-10"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between text-white">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/70">
          Frame {pos} / {total}
        </p>
        <div className="flex items-center gap-2 md:gap-3">
          <PhotoShareButton photo={photo} />
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
      </div>
      <div
        className="relative mx-auto flex w-full max-w-5xl min-h-0 min-w-0 flex-1 items-center justify-center py-3 md:gap-2 md:py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous photo"
          className="absolute left-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors active:border-accent active:text-accent md:static md:h-11 md:w-11 md:translate-y-0 md:bg-transparent md:backdrop-blur-none md:hover:border-accent md:hover:text-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center px-12 md:px-0">
          <SmartImage
            sources={photo ? [mid(photo.src), photo.src] : []}
            alt={photo.title}
            eager
            mark={52}
            caption="photo coming soon"
            className="grid min-h-[36vh] w-full max-w-3xl place-items-center"
            imgClassName="mx-auto max-h-[52vh] w-auto max-w-full touch-pan-y select-none rounded-lg object-contain md:max-h-[62vh]"
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next photo"
          className="absolute right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors active:border-accent active:text-accent md:static md:h-11 md:w-11 md:translate-y-0 md:bg-transparent md:backdrop-blur-none md:hover:border-accent md:hover:text-accent"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        className="mx-auto max-h-[26vh] w-full max-w-5xl shrink-0 overflow-y-auto overscroll-contain text-center md:max-h-none md:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-xl text-white md:text-2xl">{photo.title}</p>
        <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/60">
          {photo.location}
          {photo.meta ? ` · ${photo.meta}` : ''}
        </p>
        {photo.story && (
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            {photo.story}
          </p>
        )}
        <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35 md:hidden">
          Swipe sideways for more
        </p>
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
  // Same scroll-driven sideways reel on every screen — phones included.
  // Vertical scroll pins the section and drives the track sideways,
  // exactly like the desktop experience.
  const pinEnabled = !reduce;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.scrollWidth - window.innerWidth);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || items.length === 0) return;
    if (!pinEnabled) return;
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
              setPos(Math.min(items.length, Math.round(p * (items.length - 1)) + 1));
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
  }, [measure, pinEnabled, items.length]);

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
    <section id="gallery" ref={rootRef} className="relative overflow-hidden border-t border-border">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
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
        <div className="relative flex h-svh min-h-[560px] flex-col overflow-hidden md:min-h-[620px]">
          <div
            ref={ghostRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center overflow-hidden [justify-content:safe_center]"
          >
            <span
              className="whitespace-nowrap font-display text-[38vw] italic leading-none text-transparent opacity-60 sm:text-[30vw] md:text-[24vw]"
              style={{ WebkitTextStroke: '1px var(--color-border)' }}
            >
              Aayush.
            </span>
          </div>

          <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-x-4 gap-y-3 px-5 pt-20 sm:px-6 md:pt-24">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Side quest · keep scrolling
            </p>
            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              <span aria-hidden="true" className="mr-1 font-mono text-xs tabular-nums text-muted">
                {pad(pos)} / {pad(items.length)}
              </span>
              <button
                type="button"
                onClick={() => goTo(Math.max(0, pos - 2))}
                aria-label="Previous photos"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-bg text-muted transition-all duration-200 hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(items.length - 1, pos))}
                aria-label="Next photos"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-bg text-muted transition-all duration-200 hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-stretch">
            <div
              ref={trackRef}
              className="flex h-full w-max items-stretch gap-6 pl-5 pr-[14vw] pt-20 sm:gap-8 sm:pl-6 md:gap-14 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pt-28"
            >
              <div className="w-[78vw] shrink-0 self-center sm:w-[60vw] md:w-[28vw]">
                <h2 className="font-display text-[clamp(2rem,9vw,3.6rem)] leading-[1.02] text-text md:text-[clamp(2.2rem,4.5vw,3.6rem)]">
                  Photos I can&apos;t stop taking<span className="text-accent">.</span>
                </h2>
                <p className="mt-4 max-w-sm font-display text-xl leading-snug text-text md:mt-5 md:text-2xl">
                  Six evenings I refused to forget, collected frame by frame.
                </p>
                <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent md:mt-6">
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
                      className="group max-w-[78vw] text-left sm:max-w-[60vw] md:max-w-[82vw]"
                      imgClass={`${lay.img} h-auto w-auto max-w-full`}
                    />
                  </div>
                );
              })}
              <div className="grid w-[68vw] shrink-0 self-center place-items-center sm:w-[46vw] md:w-[26vw]">
                <div className="text-center">
                  <p className="font-display text-3xl leading-tight text-text md:text-4xl">
                    Want the
                    <br />
                    whole roll?
                  </p>
                  <button
                    type="button"
                    onClick={onViewAll}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-deep"
                  >
                    Open gallery
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-5 z-10 mx-auto w-full max-w-6xl px-5 sm:px-6 md:bottom-8">
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
