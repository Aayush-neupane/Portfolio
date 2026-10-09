/** Counts images that are genuinely stuck (still loading past their own
 *  grace period). Powers the corner orbit badge — fast images never touch
 *  this store, so the badge only ever means a bad connection. */
let slow = 0;
const subs = new Set();

function emit() {
  subs.forEach((fn) => {
    try {
      fn(slow);
    } catch {
      /* listener is gone */
    }
  });
}

/** Mark one image slow. Returns a finish function (idempotent). */
export function reportSlow() {
  slow += 1;
  emit();
  let done = false;
  return () => {
    if (done) return;
    done = true;
    slow = Math.max(0, slow - 1);
    emit();
  };
}

export function subscribeSlow(fn) {
  subs.add(fn);
  try {
    fn(slow);
  } catch {
    /* stale listener */
  }
  return () => {
    subs.delete(fn);
  };
}
