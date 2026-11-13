import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import {
  fetchCount,
  hitLike,
  markLiked,
  peekCount,
  readLiked,
  subscribeCount,
} from './likes.js';

/**
 * Anonymous like: one per browser, no signup. The count lives in Abacus;
 * localStorage only remembers that this browser already pressed the heart.
 */
export default function LikeButton({ kind, id, dark = false, className = '' }) {
  const [count, setCount] = useState(() => peekCount(kind, id));
  const [liked, setLiked] = useState(() => readLiked(kind, id));
  const busy = useRef(false);

  useEffect(() => {
    let alive = true;
    setLiked(readLiked(kind, id));
    setCount(peekCount(kind, id));
    const unsubscribe = subscribeCount(kind, id, (value) => {
      if (alive) setCount(value);
    });
    fetchCount(kind, id)
      .then((value) => {
        if (alive) setCount(value);
      })
      .catch(() => {});
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [kind, id]);

  const like = async () => {
    if (liked || busy.current) return;
    busy.current = true;
    try {
      const value = await hitLike(kind, id);
      setCount(value);
      setLiked(true);
      markLiked(kind, id);
    } catch {
      /* counter unreachable: leave the button ready to try again */
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
      className={`inline-flex items-center gap-3 rounded-full border-2 px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-[0.14em] shadow-lg transition-colors duration-200 ${
        liked
          ? 'border-accent bg-accent text-accent-contrast'
          : dark
            ? 'border-accent/60 bg-black/40 text-accent hover:bg-accent hover:text-accent-contrast'
            : 'border-accent/60 bg-elevated text-accent hover:bg-accent hover:text-accent-contrast'
      } ${className}`}
    >
      <Heart
        className="h-5 w-5"
        fill={liked ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      {liked ? 'Liked' : 'Like'}
      {count !== null && <span className="tabular-nums">{count}</span>}
    </button>
  );
}
