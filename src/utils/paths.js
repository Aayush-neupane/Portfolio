/**
 * Prefix root-absolute public paths with Vite's base so the site works
 * when served from a subpath (e.g. GitHub Pages `/Portfolio/`).
 * Leaves relative paths, external URLs, and non-strings untouched.
 */
export function withBase(path) {
  if (typeof path !== 'string' || path === '') return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}${path}`;
}
