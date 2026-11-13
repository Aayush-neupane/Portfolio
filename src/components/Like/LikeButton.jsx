import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

// Abacus is free, CORS-enabled, and needs no account. Counters expire only
// after six months without a hit, so the numbers survive quiet stretches.
// shortcut: Abacus allows 30 requests per 10 seconds per IP; self-host the
// counter if traffic outgrows it.
const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'aayush-neupane-portfolio';
const STORAGE_KEY = 'an-likes';

function readLiked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function markLiked(itemKey) {
  try {
    const liked = readLiked();
    liked[itemKey] = 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liked));
  } catch {
    /* private mode: the like still counts for this visit */
  }
}

/**
 * Anonymous like: one per browser, no signup. The count lives in Abacus;
 * localStorage only remembers that this browser already pressed the heart.
 */
export default function LikeButton({ kind, id, dark = false, className = '' }) {
  const itemKey = `${kind}:${id}`;
  const counterKey = `${kind}-${String(id).replace(/[^A-Za-z0-9_-]+/g, '-')}`.slice(0, 64);
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(false);
  const busy = useRef(false);
  const hit = useRef(false);

  useEffect(() => {
    setLiked(Boolean(readLiked()[itemKey]));
    setCount(null);
    hit.current = false;
    let alive = true;
    fetch(`${API}/get/${NAMESPACE}/${encodeURIComponent(counterKey)}`)
      .then((res) => (res.ok ? res.json() : { value: 0 }))
      .then((data) => {
        if (alive && !hit.current) setCount(Number(data.value) || 0);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [counterKey, itemKey]);

  const like = async () => {
    if (liked || busy.current) return;
    busy.current = true;
    hit.current = true;
    try {
      const res = await fetch(`${API}/hit/${NAMESPACE}/${encodeURIComponent(counterKey)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCount(Number(data.value) || 0);
      setLiked(true);
      markLiked(itemKey);
    } catch {
      /* counter unreachable: leave the button ready to try again */
      hit.current = false;
    } finally {
      busy.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={like}
      aria-pressed={liked}
      aria-label={liked ? `Liked this ${kind}` : `Like this ${kind}`}
      title="Anonymous like, one per browser"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] transition-colors duration-200 ${
        liked
          ? 'border-accent/60 text-accent'
          : dark
            ? 'border-white/25 text-white/70 hover:border-accent hover:text-accent'
            : 'border-border bg-elevated text-muted hover:border-accent hover:text-accent'
      } ${className}`}
    >
      <Heart
        className="h-3.5 w-3.5"
        fill={liked ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      {liked ? 'Liked' : 'Like'}
      {count !== null && <span className="tabular-nums opacity-70">{count}</span>}
    </button>
  );
}
