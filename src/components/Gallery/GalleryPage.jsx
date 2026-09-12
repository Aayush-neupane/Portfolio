import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lightbox, PhotoFrame } from './Gallery.jsx';

const PAGE_SIZE = 12;
const GAP = 20;

function buildRows(list, pageStart, width) {
  const targetH = width && width < 640 ? 200 : 300;
  const cap = targetH * 1.85;
  const rows = [];
  let cur = [];
  let sum = 0;
  const pushRow = (isLast) => {
    if (cur.length === 0) return;
    let h = (width - GAP * (cur.length - 1)) / sum;
    let center = false;
    if (isLast && h > cap) {
      h = targetH;
      center = true;
    }
    rows.push({
      center,
      cells: cur.map((cell) => ({ ...cell, w: Math.max(80, h * cell.ar) })),
    });
    cur = [];
    sum = 0;
  };
  list.forEach((photo, i) => {
    const ar = photo.w && photo.h ? photo.w / photo.h : 1;
    cur.push({ photo, gi: pageStart + i, ar });
    sum += ar;
    if (sum >= width / targetH) pushRow(false);
  });
  pushRow(true);
  return rows;
}

export default function GalleryPage({ photos, onBack }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('All');
  const gridTopRef = useRef(null);
  const items = useMemo(() => {
    const arr = [...(photos || [])];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [photos]);

  const cats = useMemo(
    () => ['All', ...[...new Set(items.map((p) => p.category).filter(Boolean))].sort()],
    [items]
  );
  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((p) => p.category === filter)),
    [items, filter]
  );
  const counts = useMemo(() => {
    const c = { All: items.length };
    cats.slice(1).forEach((t) => {
      c[t] = items.filter((p) => p.category === t).length;
    });
    return c;
  }, [items, cats]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const wrapRef = useRef(null);
  const [cw, setCw] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setCw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(
    () => buildRows(visible, safePage * PAGE_SIZE, cw || 1152),
    [visible, safePage, cw]
  );

  useEffect(() => {
    setPage(0);
    setOpenIndex(null);
  }, [photos, filter]);

  const step = (dir) =>
    setOpenIndex((i) => (i === null ? i : (i + dir + filtered.length) % filtered.length));

  const scrollGridTop = () => {
    const el = gridTopRef.current;
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90, duration: 0.9 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goPage = (p) => {
    setPage(Math.min(Math.max(0, p), pageCount - 1));
    requestAnimationFrame(scrollGridTop);
  };

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
        Gallery
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02] text-text">
        Every frame<span className="text-accent">.</span>
      </h1>
      <p className="mt-5 max-w-xl font-display text-xl leading-relaxed text-text md:text-2xl">
        Light, collected patiently. Storms, moons, and small wildflowers, kept
        exactly as the evenings gave them.
      </p>
      <p className="mt-3 text-sm text-muted">Click any frame to step closer.</p>

      <div
        ref={gridTopRef}
        role="tablist"
        aria-label="Filter photos by category"
        className="mt-8 flex scroll-mt-28 flex-wrap gap-2"
      >
        {cats.map((cat) => {
          const selected = filter === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? 'bg-accent text-white'
                  : 'border border-border bg-elevated text-muted hover:-translate-y-px hover:border-linestrong hover:text-text'
              }`}
            >
              {cat}
              <span
                className={`ml-1.5 font-mono text-[0.7rem] tabular-nums ${
                  selected ? 'text-white/80' : 'text-muted'
                }`}
              >
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        {String(filtered.length).padStart(2, '0')} frames
        {pageCount > 1 ? ` · page ${safePage + 1} of ${pageCount}` : ''}
      </p>

      <div ref={wrapRef} className="mt-8">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className={`flex gap-5 ${row.center ? 'justify-center' : ''} ${ri > 0 ? 'mt-10' : ''}`}
          >
            {row.cells.map(({ photo, gi, w }) => (
              <div key={photo.src || gi} style={{ width: w }} className="shrink-0">
                <PhotoFrame
                  photo={photo}
                  index={gi}
                  onOpen={setOpenIndex}
                  hideStory
                  className="group w-full text-left"
                  imgClass="h-auto w-full"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <nav aria-label="Gallery pages" className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goPage(safePage - 1)}
            disabled={safePage === 0}
            aria-label="Previous page"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {Array.from({ length: pageCount }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => goPage(n)}
              aria-label={`Page ${n + 1}`}
              aria-current={n === safePage ? 'page' : undefined}
              className={`h-11 min-w-11 rounded-full px-3 font-mono text-sm tabular-nums transition-all duration-200 ${
                n === safePage
                  ? 'bg-accent font-semibold text-white'
                  : 'border border-border text-muted hover:-translate-y-px hover:border-linestrong hover:text-text'
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goPage(safePage + 1)}
            disabled={safePage === pageCount - 1}
            aria-label="Next page"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      )}

      <AnimatePresence>
        {openIndex !== null && filtered[openIndex] && (
          <Lightbox
            photo={filtered[openIndex]}
            pos={openIndex + 1}
            total={filtered.length}
            onClose={() => setOpenIndex(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
