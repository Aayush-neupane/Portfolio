// Anonymous like counts shared by the like button and the read-only badges.
// One browser counts once; the number itself lives in Abacus.
// shortcut: Abacus allows 30 requests per 10 seconds per IP, so badge reads
// are queued at one per 400 ms and cached for ten minutes.
const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'aayush-neupane-portfolio';
const LIKED_KEY = 'an-likes';
const COUNTS_KEY = 'an-like-counts';
const TTL = 10 * 60 * 1000;
const GAP = 400;

export function counterKey(kind, id) {
  return `${kind}-${String(id).replace(/[^A-Za-z0-9_-]+/g, '-')}`.slice(0, 64);
}

function itemKey(kind, id) {
  return `${kind}:${id}`;
}

export function readLiked(kind, id) {
  try {
    return Boolean((JSON.parse(localStorage.getItem(LIKED_KEY)) || {})[itemKey(kind, id)]);
  } catch {
    return false;
  }
}

export function markLiked(kind, id) {
  try {
    const liked = JSON.parse(localStorage.getItem(LIKED_KEY)) || {};
    liked[itemKey(kind, id)] = 1;
    localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
  } catch {
    /* private mode: the like still counts for this visit */
  }
}

const counts = new Map();
const listeners = new Map();
const pending = new Map();
const hitKeys = new Set();
const queue = [];
let timer = null;

if (typeof window !== 'undefined') {
  try {
    const stored = JSON.parse(localStorage.getItem(COUNTS_KEY)) || {};
    const now = Date.now();
    for (const [key, entry] of Object.entries(stored)) {
      if (entry && typeof entry.value === 'number' && now - entry.at < TTL) {
        counts.set(key, entry.value);
      }
    }
  } catch {
    /* unreadable cache: start fresh */
  }
}

function persist() {
  try {
    const now = Date.now();
    const out = {};
    for (const [key, value] of counts) out[key] = { value, at: now };
    localStorage.setItem(COUNTS_KEY, JSON.stringify(out));
  } catch {
    /* private mode: counts still work for this visit */
  }
}

export function peekCount(kind, id) {
  const key = counterKey(kind, id);
  return counts.has(key) ? counts.get(key) : null;
}

export function subscribeCount(kind, id, fn) {
  const key = counterKey(kind, id);
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(fn);
  return () => {
    set.delete(fn);
    if (set.size === 0) listeners.delete(key);
  };
}

function publish(key, value) {
  counts.set(key, value);
  persist();
  const set = listeners.get(key);
  if (set) for (const fn of set) fn(value);
}

function drain() {
  if (timer || queue.length === 0) return;
  timer = setTimeout(async () => {
    timer = null;
    const job = queue.shift();
    const key = counterKey(job.kind, job.id);
    try {
      const res = await fetch(
        `${API}/get/${NAMESPACE}/${encodeURIComponent(key)}`
      );
      let value = 0;
      if (res.ok) value = Number((await res.json()).value) || 0;
      else if (res.status !== 404) throw new Error(`HTTP ${res.status}`);
      // A like that landed while this read was queued owns the newer value.
      if (hitKeys.has(key)) value = counts.has(key) ? counts.get(key) : value;
      else publish(key, value);
      job.resolve(value);
    } catch (err) {
      job.reject(err);
    } finally {
      pending.delete(key);
      drain();
    }
  }, GAP);
}

export function fetchCount(kind, id) {
  const key = counterKey(kind, id);
  if (counts.has(key)) return Promise.resolve(counts.get(key));
  if (pending.has(key)) return pending.get(key);
  const promise = new Promise((resolve, reject) => {
    queue.push({ kind, id, resolve, reject });
    drain();
  });
  pending.set(key, promise);
  return promise;
}

export async function hitLike(kind, id) {
  const key = counterKey(kind, id);
  hitKeys.add(key);
  try {
    const res = await fetch(
      `${API}/hit/${NAMESPACE}/${encodeURIComponent(key)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const value = Number((await res.json()).value) || 0;
    publish(key, value);
    return value;
  } catch (err) {
    hitKeys.delete(key);
    throw err;
  }
}
