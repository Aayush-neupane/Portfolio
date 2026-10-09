import { useEffect, useState } from 'react';
import { OrbitCluster, TrackLine } from './Orbit.jsx';

/** Offline takeover: when the connection drops, the orbit holds the screen
 *  with a way back. Lifts itself the moment the browser reports online.
 *  Non-modal — it never traps focus; the retry is a plain reload. */
export default function OfflineGate() {
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-label="You are offline"
      className="fixed inset-0 z-[96] grid place-items-center overflow-hidden bg-bg px-6"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="route-loader-in relative grid w-full max-w-sm justify-items-center text-center">
        <OrbitCluster box={224} mark={64} />
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-accent-deep">
          aayush / offline
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.03em] text-text sm:text-4xl">
          You&apos;re offline.
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          Check your connection — everything will be right here when you&apos;re back.
        </p>
        <div className="mt-6 w-full">
          <TrackLine animate={false} />
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-deep"
        >
          Retry connection
        </button>
      </div>
    </div>
  );
}
