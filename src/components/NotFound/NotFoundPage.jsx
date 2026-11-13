import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OrbitCluster, TrackLine } from '../Loader/Orbit.jsx';

function words(value) {
  return String(value || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1);
}

/** Token overlap is enough to catch typos and half-remembered slugs. */
function score(query, text) {
  const q = words(query);
  const t = words(text);
  if (!q.length || !t.length) return 0;
  let n = 0;
  for (const w of q) {
    if (t.includes(w)) n += 2;
    else if (w.length > 2 && t.some((x) => x.startsWith(w) || w.startsWith(x))) n += 1;
  }
  return n;
}

/** In-app 404 for unknown `#/…` routes: the orbit over an off-the-map note
 *  with ways back and the closest project/photo the slug might have meant.
 *  Mirrors the static `public/404.html` for server 404s. */
export default function NotFoundPage({
  onHome,
  onGallery,
  route = '',
  projects = [],
  photos = [],
  onProject,
  onPhoto,
}) {
  const suggestions = useMemo(() => {
    const tail = route.replace(/^#\//, '').split('/').filter(Boolean).pop() || '';
    let query = tail;
    try {
      query = decodeURIComponent(tail);
    } catch {
      /* malformed escape: search the raw text */
    }
    query = query.replace(/[-_]+/g, ' ').trim();
    if (!query) return [];

    const rank = (list, kind) =>
      list
        .map((item) => ({
          kind,
          id: item.id,
          title: item.title,
          score: score(query, item.title) + (String(item.id) === query ? 4 : 0),
        }))
        .sort((a, b) => b.score - a.score)[0];

    return [rank(projects, 'project'), rank(photos, 'photo')]
      .filter((s) => s && s.score > 0 && s.title)
      .slice(0, 2);
  }, [route, projects, photos]);

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
          That page doesn&apos;t exist, but the work does. Take a way back:
        </p>
        <div className="mt-6 w-full">
          <TrackLine />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onHome}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-contrast transition duration-200 hover:brightness-110"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-elevated px-7 py-3 text-sm font-medium text-text transition duration-200 hover:border-linestrong hover:text-accent"
          >
            View gallery
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-6 w-full text-left">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              Did you mean
            </p>
            <ul className="mt-2 space-y-2">
              {suggestions.map((s) => (
                <li key={`${s.kind}-${s.id}`}>
                  <button
                    type="button"
                    onClick={() => (s.kind === 'project' ? onProject?.(s.id) : onPhoto?.(s.id))}
                    className="group flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-elevated px-4 py-3 text-left transition-colors duration-200 hover:border-linestrong"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-text group-hover:text-accent">
                        {s.title}
                      </span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                        {s.kind === 'project' ? 'Project' : 'Photo'}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
