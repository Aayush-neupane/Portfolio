/**
 * Responsive gallery variants generated alongside the originals
 * (npm run gallery:variants):
 *  `<name>-thumb.avif` (560px) for grids, rails and cards,
 *  `<name>-mid.avif` (1200px) for the lightbox.
 * Works on base-prefixed paths too, since the suffix is inserted before the
 * extension. Falls back to the source when there is nothing to derive.
 */
function variant(src, suffix) {
  if (typeof src !== 'string') return src;
  const i = src.lastIndexOf('.');
  if (i < 0) return src;
  // Only rewrite gallery originals; anything else passes through untouched.
  if (!/\/assets\/images\/gallery\//.test(src)) return src;
  if (src.endsWith('-thumb.avif') || src.endsWith('-mid.avif')) return src;
  return `${src.slice(0, i)}-${suffix}.avif`;
}

export function thumb(src) {
  return variant(src, 'thumb');
}

export function mid(src) {
  return variant(src, 'mid');
}
