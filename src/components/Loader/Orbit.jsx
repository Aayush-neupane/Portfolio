import { withBase } from '../../utils/paths.js';

/**
 * Shared orbit language — copied from create.io
 * (`src/components/layout/Orbit.tsx`): rings, haloed mark and tracked line.
 * Tokens mapped onto the portfolio design system (paper surfaces in light
 * mode, accent comet). The source mark is a light logo, so it is inverted
 * to ink for contrast against the paper medallion in light mode.
 */

/** The logo in a haloed medallion, inverted to ink on paper. */
export function OrbitMark({ size = 80 }) {
  const inner = Math.round(size * 0.62);
  return (
    <span
      className="relative grid place-items-center rounded-full border border-border bg-elevated"
      style={{ width: size, height: size, boxShadow: '0 18px 50px rgba(41,39,33,.12)' }}
      aria-hidden="true"
    >
      <span className="loader-halo pointer-events-none absolute inset-[-1px] rounded-full border border-accent" />
      <img
        src={withBase('/assets/images/profile/logo-trp.png')}
        alt=""
        width={inner}
        height={inner}
        decoding="async"
        draggable={false}
        className="orbit-mark-img rounded-full object-cover"
        style={{ width: inner, height: inner }}
      />
    </span>
  );
}

/** A self-aligning cluster: a comet arc with a head satellite sweeping the
 *  outer ring, a dashed ring drifting the other way, and the haloed mark
 *  pinned at the center — one flow box, so the composition can never drift
 *  apart at any viewport size. */
export function OrbitCluster({ box = 288, mark = 80 }) {
  return (
    <span
      className="relative grid place-items-center"
      style={{ width: box, height: box }}
      aria-hidden="true"
    >
      <span className="loader-orbit-spin absolute inset-0">
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full overflow-visible">
          <circle cx="50" cy="50" r="49" stroke="#292721" strokeOpacity="0.22" strokeWidth="0.5" />
          <circle
            cx="50"
            cy="50"
            r="49"
            className="stroke-accent"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="77 231"
          />
          <circle cx="50" cy="99" r="2.2" className="fill-accent" />
        </svg>
      </span>
      <span
        className="loader-orbit-spin-rev absolute rounded-full border border-dashed border-border"
        style={{ inset: Math.round(box * 0.16), opacity: 0.6 }}
      >
        <span
          className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: '#667a60' }}
        />
      </span>
      <OrbitMark size={mark} />
    </span>
  );
}

/** A journey in one row: origin dot, tracked line, destination node. */
export function TrackLine({ animate = true }) {
  return (
    <span className="flex w-full items-center gap-3" aria-hidden="true">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#292721' }} />
      <span className="relative h-px flex-1 overflow-hidden bg-border">
        <span
          className={`absolute inset-y-0 w-2/5 bg-accent ${animate ? 'loader-track-slide' : 'left-1/4'}`}
        />
      </span>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#667a60' }} />
    </span>
  );
}
