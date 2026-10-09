import { useCallback, useEffect, useRef, useState } from 'react';
import { OrbitMark, OrbitMini } from './Orbit.jsx';

/** Universal image: a logo skeleton while loading, a soft fade-in on
 *  arrival, and a logo tile when the source is truly gone.
 *  `sources` are tried in order, so gallery variants transparently fall
 *  back to originals.
 *
 *  Sizing/aspect classes go on `className` (the wrapper); fit classes
 *  (`object-cover`, hover zooms) go on `imgClassName`. */
export default function SmartImage({
  sources,
  src,
  alt = '',
  className = '',
  imgClassName = '',
  imgStyle,
  eager = false,
  width,
  height,
  sizes,
  fetchPriority,
  decoding = 'async',
  draggable = false,
  mark = 44,
  failMark = 52,
  caption = 'image unavailable',
  onLoad,
}) {
  const list = sources ?? (src ? [src] : []);
  const key = list.join('|');
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState(list.length > 0 ? 'loading' : 'failed');
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  // New image → start over.
  useEffect(() => {
    setIdx(0);
    setStatus(list.length > 0 ? 'loading' : 'failed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Cached images may already be complete before listeners attach.
  const handleRef = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setStatus('ready');
      onLoadRef.current?.();
    }
  }, []);

  const current = list[idx];
  const positioned = /(^|\s)(absolute|fixed)(\s|$)/.test(` ${className} `);

  return (
    <span className={`${positioned ? '' : 'relative '}block overflow-hidden ${className}`}>
      {status === 'loading' && (
        <span className="skeleton absolute inset-0 grid place-items-center" aria-hidden="true">
          <OrbitMini size={mark} />
        </span>
      )}
      {status === 'failed' ? (
        <span
          role="img"
          aria-label={alt ? `${alt} unavailable` : 'Image unavailable'}
          className="absolute inset-0 grid place-items-center gap-2 border border-border bg-subtle p-3 text-center"
        >
          <OrbitMark size={failMark} plain />
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted">
            {caption}
          </span>
        </span>
      ) : (
        current && (
          <img
            key={current}
            ref={handleRef}
            src={current}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={fetchPriority}
            decoding={decoding}
            draggable={draggable}
            onError={() => {
              if (idx + 1 < list.length) setIdx(idx + 1);
              else setStatus('failed');
            }}
            onLoad={() => {
              setStatus('ready');
              onLoadRef.current?.();
            }}
            style={imgStyle}
            className={`${imgClassName} transition-all duration-500 ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      )}
    </span>
  );
}
