import { withBase } from '../../utils/paths.js';

/**
 * Shared orbit language — after the create.io orbit
 * (`src/components/layout/Orbit.tsx`), improvised here: a conic sweep ring
 * and a tick ring join the comet arc, and the mark gains an inner hairline
 * plus an accent glow. All colors resolve through the portfolio theme vars,
 * so the same composition reads on dark ink and on light paper. The source
 * mark is a light logo, so it is inverted to ink in light mode
 * (see `html.light .orbit-mark-img`).
 */

/** The logo in a layered medallion: sweep ring, tick ring, halo, glow.
 *  `plain` skips the outer rings for tight compositions (see OrbitMini). */
export function OrbitMark({ size = 80, plain = false }) {
  const inner = Math.round(size * 0.6);
  return (
    <span
      className="relative grid place-items-center rounded-full"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {!plain && (
        <>
          {/* conic sweep — a soft accent arc circling the medallion */}
          <span className="orbit-sweep pointer-events-none absolute inset-0 rounded-full" />
          {/* tick ring drifting the other way */}
          <span className="loader-orbit-spin-rev pointer-events-none absolute rounded-full" style={{ inset: -7 }}>
            <svg viewBox="0 0 100 100" fill="none" className="h-full w-full overflow-visible">
              <circle
                cx="50"
                cy="50"
                r="49"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="1.2 7.96"
                style={{ stroke: 'var(--color-linestrong)', opacity: 0.5 }}
              />
            </svg>
          </span>
        </>
      )}
      {/* medallion */}
      <span
        className="relative grid place-items-center rounded-full border bg-elevated"
        style={{
          width: Math.round(size * 0.72),
          height: Math.round(size * 0.72),
          borderColor: 'var(--color-border)',
          boxShadow:
            '0 0 0 1px var(--color-border), 0 18px 50px rgba(41,39,33,.12), 0 0 44px var(--color-accent-soft)',
        }}
      >
        <span
          className="loader-halo pointer-events-none absolute inset-[-1px] rounded-full border"
          style={{ borderColor: 'var(--color-accent)' }}
        />
        <span
          className="pointer-events-none absolute rounded-full border opacity-60"
          style={{ inset: 5, borderColor: 'var(--color-border)' }}
        />
        <img
          src={withBase('/assets/images/profile/logo-trp.png')}
          alt=""
          width={inner}
          height={inner}
          decoding="async"
          draggable={false}
          className="orbit-mark-img relative rounded-full object-cover"
          style={{ width: inner, height: inner }}
        />
      </span>
    </span>
  );
}

/** A self-aligning cluster: a comet arc with a head satellite sweeping the
 *  outer ring, a dashed sage ring drifting the other way, and the layered
 *  mark pinned at the center — one flow box, so the composition can never
 *  drift apart at any viewport size. */
export function OrbitCluster({ box = 288, mark = 80 }) {
  return (
    <span
      className="relative grid place-items-center"
      style={{ width: box, height: box }}
      aria-hidden="true"
    >
      <span className="loader-orbit-spin absolute inset-0">
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full overflow-visible">
          <circle
            cx="50"
            cy="50"
            r="49"
            strokeWidth="0.5"
            style={{ stroke: 'var(--color-text)', opacity: 0.22 }}
          />
          <circle
            cx="50"
            cy="50"
            r="49"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="77 231"
            style={{ stroke: 'var(--color-accent)' }}
          />
          <circle cx="50" cy="99" r="2.2" style={{ fill: 'var(--color-accent)' }} />
        </svg>
      </span>
      <span
        className="loader-orbit-spin-rev absolute rounded-full border border-dashed"
        style={{
          inset: Math.round(box * 0.16),
          borderColor: 'var(--color-border)',
          opacity: 0.6,
        }}
      >
        <span
          className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: 'var(--color-accent-deep)' }}
        />
      </span>
      <OrbitMark size={mark} />
    </span>
  );
}

/** Compact orbit for tight spaces (route fallback, slow-load badge): a
 *  single comet ring hugging a small mark. */
export function OrbitMini({ size = 48 }) {
  const ring = Math.round(size * 0.24);
  return (
    <span
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="loader-orbit-spin absolute rounded-full" style={{ inset: -ring }}>
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full overflow-visible">
          <circle
            cx="50"
            cy="50"
            r="49"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70 238"
            style={{ stroke: 'var(--color-accent)' }}
          />
          <circle cx="50" cy="99" r="6" style={{ fill: 'var(--color-accent)' }} />
        </svg>
      </span>
      <OrbitMark size={size} plain />
    </span>
  );
}

/** A journey in one row: origin dot, tracked line, destination node. */
export function TrackLine({ animate = true }) {
  return (
    <span className="flex w-full items-center gap-3" aria-hidden="true">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--color-text)' }} />
      <span className="relative h-px flex-1 overflow-hidden" style={{ background: 'var(--color-border)' }}>
        <span
          className={`absolute inset-y-0 w-2/5 ${animate ? 'loader-track-slide' : 'left-1/4'}`}
          style={{ background: 'var(--color-accent)' }}
        />
      </span>
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: 'var(--color-accent-deep)' }}
      />
    </span>
  );
}
