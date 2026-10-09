import { useEffect, useState } from 'react';
import { OrbitMini } from './Orbit.jsx';
import { subscribeSlow } from '../../utils/imageBus.js';

/** Default grace period before the badge appears — fast loads never flash it. */
const DEFAULT_DELAY = 1200;

/** Mini orbit pill pinned bottom-right (above the chat float) while slow
 *  work is still pending — lazy page chunks on bad connections, the
 *  contact send, stuck images, anything wired through the `active` flag.
 *  Renders nothing for fast resolutions. Non-interactive, announced politely. */
export default function SlowBadge({ active, label = 'loading', delay = DEFAULT_DELAY, bottom = 'bottom-20' }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return undefined;
    }
    const t = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(t);
  }, [active, delay]);

  if (!active || !shown) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`fixed ${bottom} right-5 z-[95] flex items-center gap-3 rounded-full border border-border bg-elevated/90 py-2 pl-2.5 pr-4 shadow-xl backdrop-blur-md`}
    >
      <OrbitMini size={30} />
      <span className="font-mono text-[10px] lowercase tracking-[0.14em] text-muted">
        {label}
        <span className="slow-dots" aria-hidden="true" />
      </span>
    </div>
  );
}

/** Corner badge driven by stuck images site-wide (see SmartImage). Mount
 *  once — it stacks above the chunk badge when both fire together. */
export function ImageSlowBadge({ label = 'loading images' }) {
  const [stuck, setStuck] = useState(0);

  useEffect(() => subscribeSlow(setStuck), []);

  return <SlowBadge active={stuck > 0} label={label} delay={400} bottom="bottom-36" />;
}
