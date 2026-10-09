import { useEffect, useRef, useState } from 'react';
import { OrbitCluster, TrackLine } from './Orbit.jsx';

/** Minimum time the veil stays fully visible, then fade-out length. Total
 *  presence ≈ 0.7s — one quick beat of the orbit on every page change. */
const MIN_VISIBLE_MS = 450;
const FADE_MS = 250;

export function routeLabel(route) {
  if (!route || route === '#/') return 'home';
  if (route === '#/gallery') return 'gallery';
  if (route.startsWith('#/gallery/')) return 'photo';
  if (route === '#/projects') return 'projects';
  if (route === '#/links') return 'links';
  if (route.startsWith('#/project/')) return 'project';
  if (route.startsWith('#/')) return 'lost';
  return 'aayush';
}

/** Module-level navigation memory. Component refs cannot survive StrictMode
 *  remounts (dev double-invoke would flash the veil on first load), so the
 *  handled key lives outside the component — same approach as create.io. */
let lastHandledKey = null;

/** Full-screen orbit veil shown briefly on every page (hash-route) change.
 *  Non-interactive throughout: pointer-events-none, so it never traps
 *  clicks or focus. Skipped on first mount (including the boot → site
 *  handoff) and for reduced-motion users. */
export default function RouteVeil({ routeKey, label }) {
  const [phase, setPhase] = useState('hidden');
  const timers = useRef([]);

  useEffect(() => {
    // Same key as already handled: a re-run, not a navigation. (StrictMode
    // double-invokes effects in dev; this collapses both runs into one, and
    // the boot → site handoff never flashes the veil.)
    if (lastHandledKey === routeKey) return undefined;
    const firstMount = lastHandledKey === null;
    lastHandledKey = routeKey;
    if (firstMount) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase('shown');
    timers.current.push(window.setTimeout(() => setPhase('leaving'), MIN_VISIBLE_MS));
    timers.current.push(window.setTimeout(() => setPhase('hidden'), MIN_VISIBLE_MS + FADE_MS));
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [routeKey]);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden="true"
<<<<<<< HEAD
      className={`pointer-events-none fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-bg/80 backdrop-blur-[2px] transition-opacity ${
=======
      className={`pointer-events-none fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-bg/80 transition-opacity ${
>>>>>>> portfolio-remote/rebrand
        phase === 'leaving' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="route-loader-in relative grid w-full max-w-[16rem] justify-items-center px-6 text-center">
        <OrbitCluster box={176} mark={56} />
        <p className="mt-6 max-w-full truncate font-mono text-[9px] uppercase tracking-[0.2em] text-accent-deep">
          aayush / {label || 'working'}
        </p>
        <div className="mt-4 w-full">
          <TrackLine />
        </div>
      </div>
    </div>
  );
}
