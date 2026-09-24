import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const HOVER_SELECTOR = 'a, button, [role="link"], [role="button"], input, textarea, select, canvas';

/**
 * Cursor — a dot + trailing ring that replaces the native pointer on
 * fine-pointer devices. Grows over anything interactive.
 * Renders nothing for touch users or reduced-motion preferences.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return undefined;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target;
      setHovering(
        t instanceof Element && t.closest(HOVER_SELECTOR) != null
      );
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]">
      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="absolute left-0 top-0"
      >
        <div
          className={`rounded-full bg-accent transition-[width,height,margin] duration-200 ${
            hovering ? 'h-2 w-2 -ml-1 -mt-1' : 'h-1.5 w-1.5 -ml-[3px] -mt-[3px]'
          }`}
        />
      </motion.div>
      <motion.div
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
        className="absolute left-0 top-0"
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            hovering
              ? '-ml-6 -mt-6 h-12 w-12 border-accent bg-accent/10'
              : '-ml-4 -mt-4 h-8 w-8 border-muted'
          }`}
        />
      </motion.div>
    </div>
  );
}
