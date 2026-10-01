/**
 * Shared keyboard helpers for tablists and dialogs.
 */

/**
 * Arrow-key navigation for `role="tablist"` containers. Attach to the
 * tablist's onKeyDown: Left/Right moves focus and activates the tab,
 * matching the click behavior each tab already has.
 */
export function tabListKeyDown(e) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const tabs = [...e.currentTarget.querySelectorAll('[role="tab"]')];
  const i = tabs.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  const dir = e.key === 'ArrowRight' ? 1 : -1;
  const next = tabs[(i + dir + tabs.length) % tabs.length];
  next.focus();
  next.click();
}
