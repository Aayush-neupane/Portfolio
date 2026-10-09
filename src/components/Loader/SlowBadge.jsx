import { useEffect, useState } from 'react';
import { OrbitMini } from './Orbit.jsx';

/** Grace period before the badge appears — fast loads never flash it. */
const GRACE_MS = 1200;

/** Mini orbit pill pinned bottom-right (above the chat float) while slow
 *  work is still pending — lazy page chunks on bad connections, the
 *  contact send, anything wired through the `active` flag. Renders
 *  nothing for fast resolutions. Non-interactive, announced politely. */
export default function SlowBadge({ active, label = 'loading' }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return undefined;
    }
    const t = window.setTimeout(() => setShown(true), GRACE_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  if (!active || !shown) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="fixed bottom-20 right-5 z-[95] flex items-center gap-3 rounded-full border border-border bg-elevated/90 py-2 pl-2.5 pr-4 shadow-xl backdrop-blur-md"
    >
      <OrbitMini size={30} />
      <span className="font-mono text-[10px] lowercase tracking-[0.14em] text-muted">
        {label}
        <span className="slow-dots" aria-hidden="true" />
      </span>
    </div>
  );
}
