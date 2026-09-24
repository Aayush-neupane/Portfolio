export function scrollToTarget(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  if (window.__lenis) {
    // Re-sync internal scroll state with the real one first. After a page
    // swap the scroller's cached position AND page dimensions are stale,
    // which would otherwise land the smooth scroll a section early (or late).
    try {
      window.__lenis.reset();
      window.__lenis.resize();
    } catch {
      /* older lenis — scroll still works, just less exact */
    }
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
