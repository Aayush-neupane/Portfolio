import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OrbitMini } from './Orbit.jsx';
import { subscribeSlow } from '../../utils/imageBus.js';

/** Default grace period before the badge appears — fast loads never flash it. */
const DEFAULT_DELAY = 1200;

/** Bare corner orbit for slow work (page chunks, sends, stuck images): no
 *  pill, no text — just the small loading-screen orbit pinned below the
 *  chat float. Announced politely through a visually-hidden label. */
export default function SlowBadge({ active, label = 'loading', delay = DEFAULT_DELAY, bottom = 'bottom-5', right = 'right-5', size = 36 }) {
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

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`fixed ${bottom} ${right} z-[95]`}
    >
      <OrbitMini size={size} />
      <span className="sr-only">{label}</span>
    </div>,
    document.body
  );
}

/** Corner orbit driven by stuck images site-wide (see SmartImage). Sits
 *  left of the chunk orbit when both fire together. */
export function ImageSlowBadge({ label = 'loading images' }) {
  const [stuck, setStuck] = useState(0);

  useEffect(() => subscribeSlow(setStuck), []);

  return <SlowBadge active={stuck > 0} label={label} delay={400} bottom="bottom-5" right="right-[4.75rem]" size={30} />;
}
