import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { fetchCount, peekCount, subscribeCount } from './likes.js';

/**
 * Read-only like count for cards. The button itself stays in the detail view;
 * this only shows how many people have pressed it.
 */
export default function LikeCount({ kind, id, dark = false, className = '' }) {
  const [count, setCount] = useState(() => peekCount(kind, id));
  const ref = useRef(null);

  useEffect(() => {
    setCount(peekCount(kind, id));
    let alive = true;
    const unsubscribe = subscribeCount(kind, id, (value) => {
      if (alive) setCount(value);
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [kind, id]);

  useEffect(() => {
    if (count !== null) return undefined;
    const el = ref.current;
    const load = () => {
      fetchCount(kind, id)
        .then(setCount)
        .catch(() => {});
    };
    if (!el || typeof IntersectionObserver === 'undefined') {
      load();
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [kind, id, count]);

  return (
    <span
      ref={ref}
      className={`pointer-events-none inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 font-mono text-sm font-bold tabular-nums shadow-md ${
        dark
          ? 'border-white/25 bg-black/75 text-white backdrop-blur-sm'
          : 'border-accent/40 bg-elevated text-text'
      } ${className}`}
    >
      <Heart className="h-4 w-4 text-accent" fill="currentColor" aria-hidden="true" />
      <span aria-hidden="true">{count === null ? '...' : count}</span>
      <span className="sr-only">
        {count === null ? 'Likes loading' : `${count} ${count === 1 ? 'like' : 'likes'}`}
      </span>
    </span>
  );
}
