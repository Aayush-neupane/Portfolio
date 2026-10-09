export function scrollToTarget(selector) {
  const go = (el) => {
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
  };
  const first = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (first) {
    go(first);
    return;
  }
  // Below-fold sections mount on approach: retry briefly while their chunk
  // loads instead of dropping the navigation.
  if (typeof selector !== 'string') return;
  let tries = 0;
  const id = setInterval(() => {
    const el = document.querySelector(selector);
    if (el || ++tries >= 20) {
      clearInterval(id);
      if (el) go(el);
    }
  }, 125);
}

export function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
