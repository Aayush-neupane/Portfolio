import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lightbox, PhotoFrame } from './Gallery.jsx';

const PAGE_SIZE = 8;
const GAP = 20;

// Bento layout is experimental: flip to false to fall back to the justified rows below.
const USE_BENTO = true;

function bentoAr(photo) {
  return photo.w && photo.h ? photo.w / photo.h : 1;
}

/**
 * Lays photos out as exact-fit bento bands. Every tile's box is derived from
 * its own aspect ratio (w = h * ar), so no frame is ever cropped. Each band's
 * height is solved so its tiles plus gaps fill the row exactly, so no gaps
 * open up either. Bands alternate between tall feature blocks (a large tile
 * beside two stacked frames) and short rows of varying counts, which is what
 * makes the board read as bento. Photo order is preserved throughout.
 */
function buildBentoBands(list, pageStart, width) {
  if (!width || list.length === 0) return [];
  // Phones get one fluid frame per row: natural ratio, no forced box.
  if (width < 640) {
    return list.map((photo, i) => {
      const w = width;
      const h = w / bentoAr(photo);
      return {
        kind: 'column',
        h,
        centered: false,
        cells: [{ kind: 'single', w, h, tile: { photo, gi: pageStart + i, w, h } }],
      };
    });
  }

  const minH = Math.max(150, width * 0.16);
  const maxRowH = Math.min(800, width * 0.7);
  const maxFeatH = Math.min(1100, width * 0.95);
  const minW = Math.max(110, width * 0.11);

  const n = list.length;
  const photos = list.map((photo, i) => ({ photo, gi: pageStart + i, ar: bentoAr(photo) }));
  const bands = [];
  let i = 0;
  let prevKind = '';
  let bandNo = 0;

  const stackS = (a, b) => (a * b) / (a + b);
  const single = (ref, w, h) => ({
    kind: 'single', w, h,
    tile: { photo: photos[ref].photo, gi: photos[ref].gi, w, h },
  });

  function build(kind, idx) {
    const P = (k) => photos[idx + k].ar;
    if (kind === 'row2' || kind === 'row3' || kind === 'row4' || kind === 'row5') {
      const k = { row2: 2, row3: 3, row4: 4, row5: 5 }[kind];
      const slice = Array.from({ length: k }, (_, j) => P(j));
      const H = (width - GAP * (k - 1)) / slice.reduce((s, a) => s + a, 0);
      return { kind, k, H, ncols: k, centered: false, cells: slice.map((ar, j) => single(idx + j, H * ar, H)) };
    }
    if (kind === 'featL' || kind === 'featR') {
      const tallFirst = kind === 'featL';
      const arT = tallFirst ? P(0) : P(2);
      const a1 = tallFirst ? P(1) : P(0);
      const a2 = tallFirst ? P(2) : P(1);
      const S = stackS(a1, a2);
      const H = (width - GAP + GAP * S) / (arT + S);
      const Wc = (H - GAP) * S;
      const h1 = Wc / a1;
      const h2 = Wc / a2;
      const r1 = tallFirst ? idx + 1 : idx;
      const r2 = tallFirst ? idx + 2 : idx + 1;
      const tall = single(tallFirst ? idx : idx + 2, H * arT, H);
      const stack = {
        kind: 'stack', w: Wc, h: H,
        top: { photo: photos[r1].photo, gi: photos[r1].gi, w: Wc, h: h1 },
        bottom: { photo: photos[r2].photo, gi: photos[r2].gi, w: Wc, h: h2 },
      };
      return { kind, k: 3, H, ncols: 2, centered: false, cells: tallFirst ? [tall, stack] : [stack, tall] };
    }
    if (kind === 'stack2') {
      const S1 = stackS(P(0), P(1));
      const S2 = stackS(P(2), P(3));
      const H = (width - GAP) / (S1 + S2) + GAP;
      const W1 = (H - GAP) * S1;
      const W2 = (H - GAP) * S2;
      const mk = (ref, w, h) => ({ photo: photos[ref].photo, gi: photos[ref].gi, w, h });
      return {
        kind, k: 4, H, ncols: 2, centered: false,
        cells: [
          { kind: 'stack', w: W1, h: H, top: mk(idx, W1, W1 / P(0)), bottom: mk(idx + 1, W1, W1 / P(1)) },
          { kind: 'stack', w: W2, h: H, top: mk(idx + 2, W2, W2 / P(2)), bottom: mk(idx + 3, W2, W2 / P(3)) },
        ],
      };
    }
    if (kind === 'hero') {
      const ar = P(0);
      const H = Math.min(Math.max(width / ar, minH), maxRowH);
      const w = H * ar;
      return { kind, k: 1, H, ncols: 1, centered: w < width - 1, cells: [single(idx, w, H)] };
    }
    return null;
  }

  function valid(b) {
    if (!b) return false;
    if (b.kind === 'hero') return true;
    const cap = b.kind.startsWith('row') ? maxRowH : maxFeatH;
    if (!(b.H >= minH - 1e-9 && b.H <= cap + 1e-9)) return false;
    for (const c of b.cells) {
      if (c.w < minW - 1e-9 || c.w > width - GAP - minW + 1e-9) return false;
      if (c.kind === 'stack') {
        const f1 = c.top.h / b.H;
        const f2 = c.bottom.h / b.H;
        if (f1 < 0.28 || f1 > 0.72 || f2 < 0.28 || f2 > 0.72) return false;
      }
    }
    return true;
  }

  const NEED = { row2: 2, row3: 3, row4: 4, row5: 5, featL: 3, featR: 3, stack2: 4 };
  const tallIdeal = maxRowH * 0.85;
  const shortIdeal = minH * 1.5;

  while (i < n) {
    const r = n - i;
    if (r === 1) {
      bands.push(build('hero', i));
      i += 1;
      prevKind = 'hero';
      bandNo++;
      continue;
    }
    const ideal = bandNo % 2 === 0 ? tallIdeal : shortIdeal;
    const order =
      bandNo % 4 === 0 ? ['featL', 'featR', 'row3', 'stack2', 'row2', 'row4', 'row5'] :
      bandNo % 4 === 1 ? ['row3', 'row4', 'row2', 'row5', 'featL', 'featR', 'stack2'] :
      bandNo % 4 === 2 ? ['featR', 'featL', 'stack2', 'row4', 'row2', 'row3', 'row5'] :
        ['stack2', 'row4', 'row5', 'row3', 'row2', 'featL', 'featR'];
    let best = null;
    let bestScore = Infinity;
    for (const kind of order) {
      const k = NEED[kind];
      if (k > r || r - k === 1) continue;
      const b = build(kind, i);
      if (!valid(b)) continue;
      let score = Math.abs(b.H - ideal) / ideal;
      if (kind === 'featL' || kind === 'featR' || kind === 'stack2') score -= 0.3;
      if (kind === prevKind) score += 0.25;
      if (score < bestScore) {
        bestScore = score;
        best = b;
      }
    }
    if (!best) {
      // Lenient fallback: exact fit is preserved, height may run tall or short.
      const k = r >= 4 ? 4 : r >= 3 ? 3 : 2;
      best = k === 4 ? build('row4', i) : k === 3 ? build('row3', i) : build('row2', i);
      best.fallback = true;
    }
    bands.push(best);
    prevKind = best.kind;
    i += best.k;
    bandNo++;
  }
  return bands;
}


function BentoCell({ photo, index, onOpen, className, style }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo: ${photo.title}`}
      style={style}
      className={`group relative overflow-hidden rounded-lg border border-linestrong bg-subtle text-left transition-colors duration-300 hover:border-accent focus-visible:border-accent ${className}`}
    >
      {!failed ? (
        <img
          src={photo.src}
          alt={photo.title}
          width={photo.w}
          height={photo.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        <span className="grid h-full w-full place-items-center p-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
          Drop {photo.src?.split('/').pop()} in public/assets/images/gallery/
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="min-w-0">
          <span className="block truncate font-display text-sm text-white">{photo.title}</span>
          <span className="mt-0.5 block truncate font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/70">
            {photo.location}
            {photo.meta ? ` · ${photo.meta}` : ''}
          </span>
        </span>
        <span className="shrink-0 font-display text-sm leading-none text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
      </span>
    </button>
  );
}

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

  const bento = useMemo(
    () => (USE_BENTO ? buildBentoBands(visible, safePage * PAGE_SIZE, cw || 1152) : []),
    [visible, safePage, cw]
  );

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
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-6 md:pt-40">
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
      <p className="mt-3 text-sm text-muted">Tap any frame to step closer.</p>

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
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 sm:px-5 sm:py-2.5 ${
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

      {/* Mobile: 2-column masonry — no tiny justified rows, no horizontal overflow */}
      <div className={`mt-6 columns-2 gap-4 sm:hidden ${USE_BENTO ? 'hidden' : ''}`}>
        {visible.map((photo, i) => {
          const gi = safePage * PAGE_SIZE + i;
          return (
            <div key={photo.src || gi} className="mb-4 break-inside-avoid">
              <PhotoFrame
                photo={photo}
                index={gi}
                onOpen={setOpenIndex}
                hideStory
                compact
                className="group w-full text-left"
                imgClass="h-auto w-full rounded-lg"
              />
            </div>
          );
        })}
      </div>

      {USE_BENTO ? (
        <div ref={wrapRef} className="mt-8">
          {bento.map((band, bi) => (
            <div
              key={bi}
              className="flex flex-nowrap"
              style={{
                height: band.h,
                gap: GAP,
                justifyContent: band.centered ? 'center' : 'flex-start',
                marginTop: bi > 0 ? GAP : 0,
              }}
            >
              {band.cells.map((cell) => {
                if (cell.kind === 'single') {
                  const { tile } = cell;
                  return (
                    <BentoCell
                      key={tile.photo.src || tile.gi}
                      photo={tile.photo}
                      index={tile.gi}
                      onOpen={setOpenIndex}
                      className="shrink-0"
                      style={{ width: tile.w, height: tile.h }}
                    />
                  );
                }
                return (
                  <div
                    key={`${cell.top.photo.src}+${cell.bottom.photo.src}`}
                    className="flex shrink-0 flex-col flex-nowrap"
                    style={{ width: cell.w, height: cell.h, gap: GAP }}
                  >
                    {[cell.top, cell.bottom].map((tile) => (
                      <BentoCell
                        key={tile.photo.src || tile.gi}
                        photo={tile.photo}
                        index={tile.gi}
                        onOpen={setOpenIndex}
                        className="shrink-0"
                        style={{ width: tile.w, height: tile.h }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div ref={wrapRef} className="mt-8 hidden sm:block">
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
      )}

      {pageCount > 1 && (
        <nav aria-label="Gallery pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
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
