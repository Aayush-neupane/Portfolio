import { OrbitCluster, TrackLine } from '../Loader/Orbit.jsx';

/** In-app 404 for unknown `#/…` routes: the orbit over an off-the-map note
 *  with ways back. Mirrors the static `public/404.html` for server 404s. */
export default function NotFoundPage({ onHome, onGallery }) {
  return (
    <div className="relative mx-auto grid min-h-svh w-full max-w-md place-items-center overflow-hidden px-6 pb-16 pt-24 md:pt-32">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="route-loader-in relative grid w-full justify-items-center text-center">
        <OrbitCluster box={240} mark={72} />
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-accent-deep">
          aayush / lost
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-text sm:text-5xl">
          Off the map.
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          That page doesn&apos;t exist — but the work does. Take a way back:
        </p>
        <div className="mt-6 w-full">
          <TrackLine />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onHome}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-deep"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-elevated px-7 py-3 text-sm font-medium text-text transition-all duration-200 hover:border-linestrong hover:text-accent"
          >
            View gallery
          </button>
        </div>
      </div>
    </div>
  );
}
