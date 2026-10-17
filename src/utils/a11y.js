/**
 * Shared keyboard helpers for tablists and dialogs.
 */

import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal focus management: moves focus into the dialog on open, keeps Tab
 * cycling inside it, and hands focus back to whatever opened it on close.
 * The dialog must live outside `#root` (portal it to <body>) for
 * `inertBackground` to work.
 */
export function useDialogFocus({ active, containerRef, initialFocusRef }) {
  useEffect(() => {
    if (!active) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;
    // Captured before any focus move so it is the real opener, not a
    // sibling the browser focused during mount.
    const returnTo = document.activeElement;
    const focusables = () =>
      [...node.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled && el.offsetParent !== null);
    (initialFocusRef?.current ?? focusables()[0])?.focus({ preventScroll: true });
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (returnTo instanceof HTMLElement && document.contains(returnTo)) {
        returnTo.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, initialFocusRef]);
}

/**
 * Makes everything inside `#root` inert so a portaled dialog is the only
 * thing assistive tech and Tab can reach. Returns a restore function.
 */
export function inertBackground() {
  const root = document.getElementById('root');
  if (!root) return () => {};
  const children = [...root.children];
  const prev = children.map((el) => el.inert);
  children.forEach((el) => {
    el.inert = true;
  });
  return () => {
    children.forEach((el, i) => {
      if (document.contains(el)) el.inert = prev[i];
    });
  };
}

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
