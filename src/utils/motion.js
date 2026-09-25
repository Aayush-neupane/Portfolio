/**
 * True when motion should be off: OS reduced-motion preference OR the
 * visitor's Lite-mode toggle (a `saver` class on <html>, persisted).
 */
export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  try {
    if (document.documentElement.classList.contains('saver')) return true;
  } catch {
    /* DOM unavailable */
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
