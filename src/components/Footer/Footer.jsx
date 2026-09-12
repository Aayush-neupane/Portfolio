import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../../utils/scroll.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-sm text-muted sm:flex-row">
        <p>© {year} Aayush Neupane. All rights reserved.</p>
        <p className="font-mono text-xs uppercase tracking-[0.14em]">
          Designed &amp; built by Aayush
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-4 py-2.5 text-xs font-medium text-muted transition-all duration-200 hover:-translate-y-px hover:border-linestrong hover:text-accent"
        >
          Top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
